import { clearColor, shaders, vertices } from "./const";

export async function initWebGPU(canvas: HTMLCanvasElement) {
  // 获取WebGPU上下文
  const context = canvas.getContext("webgpu");
  // 请求GPU适配器
  const adapter = await navigator.gpu.requestAdapter();
  // 如果没有找到适配器，抛出错误
  if (!adapter) {
    throw new Error("没有找到适配器");
  }
  // 请求GPU设备
  const device = await adapter.requestDevice();
  // 创建着色器模块
  const shaderModule = await device.createShaderModule({
    code: shaders,
  });
  // 如果没有获取到WebGPU上下文，抛出错误
  if (!context) {
    throw new Error("WebGPU上下文不可用");
  }
  // 配置WebGPU上下文
  context.configure({
    device,
    format: navigator.gpu.getPreferredCanvasFormat(),
    alphaMode: "premultiplied",
  });
  // 创建顶点缓冲区
  const vertexBuffer = device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  // 将顶点数据写入缓冲区
  device.queue.writeBuffer(vertexBuffer, 0, vertices, 0, vertices.length);

  // 创建顶点缓冲区数组
  const vertexBuffers = [
    {
      attributes: [
        {
          shaderLocation: 0, // 位置属性
          offset: 0,
          format: "float32x4",
        },
        {
          shaderLocation: 1, // 颜色属性
          offset: 16,
          format: "float32x4",
        },
      ],
      arrayStride: 32,
      stepMode: "vertex",
    },
  ];
  // 创建渲染管线描述符
  const pipelineDescriptor = {
    vertex: {
      module: shaderModule,
      entryPoint: "vertex_main",
      buffers: vertexBuffers,
    },
    fragment: {
      module: shaderModule,
      entryPoint: "fragment_main",
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
        },
      ],
    },
    primitive: {
      topology: "triangle-list",
    },
    layout: "auto",
  };
  // 创建渲染管线
  const renderPipeline = device.createRenderPipeline(pipelineDescriptor);
  // 创建命令编码器
  const commandEncoder = device.createCommandEncoder();
  // 创建渲染通道描述符
  const renderPassDescriptor = {
    colorAttachments: [
      {
        clearValue: clearColor,
        loadOp: "clear",
        storeOp: "store",
        view: context.getCurrentTexture().createView(),
      },
    ],
  };
  // 开始渲染通道
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
  // 设置渲染管线
  passEncoder.setPipeline(renderPipeline);
  // 设置顶点缓冲区
  passEncoder.setVertexBuffer(0, vertexBuffer);
  // 绘制三角形
  passEncoder.draw(3);
  // 结束渲染通道
  passEncoder.end();
  // 提交命令编码器
  device.queue.submit([commandEncoder.finish()]);
}
