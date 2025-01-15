export function createGPUBuffer(
  device: GPUDevice,
  data: Float32Array,
  usage: GPUBufferUsageFlags
) {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage,
    mappedAtCreation: true,
  });
  new Float32Array(buffer.getMappedRange(0, data.byteLength)).set(data);
  buffer.unmap();
  return buffer;
}

export async function runComputeShader(
  device: GPUDevice,
  pipeline: GPUComputePipeline,
  bindGroup: GPUBindGroup,
  workgroupCount: { x: number; y: number; z?: number }
) {
  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginComputePass();
  passEncoder.setPipeline(pipeline);
  passEncoder.setBindGroup(0, bindGroup);
  passEncoder.dispatchWorkgroups(workgroupCount.x, workgroupCount.y);
  passEncoder.end();
  device.queue.submit([commandEncoder.finish()]);
}
