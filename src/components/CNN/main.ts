import { createGPUBuffer, runComputeShader } from "./utils";
export async function main() {
  // 请求GPU适配器
  const adapter = await navigator.gpu.requestAdapter();
  // 如果没有找到适配器，抛出错误
  if (!adapter) {
    throw new Error("没有找到适配器");
  }
  // 请求GPU设备
  const device = await adapter.requestDevice();

  // 定义输入图像和卷积核
  const inputImage = new Float32Array([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25,
  ]);

  const kernel = new Float32Array([1, 0, -1, 1, 0, -1, 1, 0, -1]);

  const inputSize = 5;
  const kernelSize = 3;
  const outputSize = inputSize - kernelSize + 1;

  // 创建缓冲区
  const inputBuffer = createGPUBuffer(
    device,
    inputImage,
    GPUBufferUsage.STORAGE
  );
  const kernelBuffer = createGPUBuffer(device, kernel, GPUBufferUsage.STORAGE);
  const outputBuffer = device.createBuffer({
    size: Float32Array.BYTES_PER_ELEMENT * outputSize * outputSize,
    usage:
      GPUBufferUsage.STORAGE |
      GPUBufferUsage.COPY_SRC |
      GPUBufferUsage.MAP_READ,
    mappedAtCreation: false,
  });

  // 加载卷积计算着色器
  const shaderModule = device.createShaderModule({
    code: await fetch("./shaders/convolution.wgsl").then((res) => res.text()),
  });

  // 配置计算管线
  const pipeline = device.createComputePipeline({
    layout: "auto",
    compute: {
      module: shaderModule,
      entryPoint: "main",
    },
  });

  // 创建绑定组
  const bindGroup = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: inputBuffer } },
      { binding: 1, resource: { buffer: kernelBuffer } },
      { binding: 2, resource: { buffer: outputBuffer } },
    ],
  });

  // 执行计算
  await runComputeShader(device, pipeline, bindGroup, {
    x: outputSize,
    y: outputSize,
  });
  const stagingBuffer = device.createBuffer({
    size: outputBuffer.size,
    usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
  });
  const commandEncoder = device.createCommandEncoder();
  commandEncoder.copyBufferToBuffer(
    outputBuffer,
    0,
    stagingBuffer,
    0,
    outputBuffer.size
  );
  device.queue.submit([commandEncoder.finish()]);
  // 提取结果
  await stagingBuffer.mapAsync(GPUMapMode.READ);
  const outputData = new Float32Array(stagingBuffer.getMappedRange());
  console.log("Convolution Result:", outputData);
  stagingBuffer.unmap();
}
