import { clearColor, shaders, vertices } from "./const";
import { mat4 } from "gl-matrix";

export async function initWebGPU(canvas: HTMLCanvasElement) {
  const context = canvas.getContext("webgpu");
  const adapter = await navigator.gpu.requestAdapter();

  if (!adapter) {
    throw new Error("No adapter found");
  }

  const device = await adapter.requestDevice();
  const shaderModule = device.createShaderModule({
    code: shaders,
  });

  if (!context) {
    throw new Error("WebGPU context not available");
  }

  context.configure({
    device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: "premultiplied",
  });

  // Create vertex buffer
  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vertexBuffer, 0, vertices);

  // Create uniform buffer for transformation matrix
  const uniformBufferSize = 4 * 16; // 4x4 matrix
  const uniformBuffer = device.createBuffer({
    size: uniformBufferSize,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });

  // Create bind group layout and bind group
  const bindGroupLayout = device.createBindGroupLayout({
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: { type: "uniform" },
      },
    ],
  });

  const bindGroup = device.createBindGroup({
    layout: bindGroupLayout,
    entries: [
      {
        binding: 0,
        resource: { buffer: uniformBuffer },
      },
    ],
  });

  const pipelineLayout = device.createPipelineLayout({
    bindGroupLayouts: [bindGroupLayout],
  });

  // Create pipeline
  const pipeline = device.createRenderPipeline({
    layout: pipelineLayout,
    vertex: {
      module: shaderModule,
      entryPoint: "vertex_main",
      buffers: [
        {
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: "float32x4",
            },
            {
              shaderLocation: 1,
              offset: 16,
              format: "float32x4",
            },
          ],
          arrayStride: 32,
          stepMode: "vertex",
        },
      ],
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fragment_main",
      targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
    },
    primitive: {
      topology: "triangle-list",
      cullMode: "back",
    },
    depthStencil: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: "depth24plus",
    },
  });

  // Create depth texture
  const depthTexture = device.createTexture({
    size: [canvas.width, canvas.height],
    format: "depth24plus",
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });

  function render() {
    // Update transformation matrix
    const modelViewProjection = mat4.create();
    const projection = mat4.perspective(
      mat4.create(),
      (45 * Math.PI) / 180.0,
      canvas.width / canvas.height,
      0.1,
      100.0
    );
    const view = mat4.lookAt(mat4.create(), [0, 1, 4], [0, 0, 0], [0, 1, 0]);

    mat4.multiply(modelViewProjection, projection, view);

    // Rotate the pyramid
    const now = Date.now() / 1000;
    mat4.rotate(modelViewProjection, modelViewProjection, now, [0, 1, 0]);

    device.queue.writeBuffer(
      uniformBuffer,
      0,
      modelViewProjection as Float32Array
    );

    const commandEncoder = device.createCommandEncoder();
    const renderPassDescriptor: GPURenderPassDescriptor = {
      colorAttachments: [
        {
          view: context.getCurrentTexture().createView(),
          clearValue: clearColor,
          loadOp: "clear",
          storeOp: "store",
        },
      ],
      depthStencilAttachment: {
        view: depthTexture.createView(),
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
    passEncoder.setPipeline(pipeline);
    passEncoder.setBindGroup(0, bindGroup);
    passEncoder.setVertexBuffer(0, vertexBuffer);
    passEncoder.draw(12, 1, 0, 0); // 4 triangles * 3 vertices
    passEncoder.end();

    device.queue.submit([commandEncoder.finish()]);
    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}