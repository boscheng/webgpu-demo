@group(0) @binding(0) var<storage, read> inputImage: array<f32>;
@group(0) @binding(1) var<storage, read> kernel: array<f32>;
@group(0) @binding(2) var<storage, read_write> outputImage: array<f32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let width = 28u; // 图像宽度
    let height = 28u; // 图像高度
    let kernelSize = 3u; // 卷积核大小

    let x = global_id.x;
    let y = global_id.y;

    if (x < width - kernelSize + 1 && y < height - kernelSize + 1) {
        var sum: f32 = 0.0;
        for (var ky: u32 = 0; ky < kernelSize; ky++) {
            for (var kx: u32 = 0; kx < kernelSize; kx++) {
                let imageIndex = (y + ky) * width + (x + kx);
                let kernelIndex = ky * kernelSize + kx;
                sum += inputImage[imageIndex] * kernel[kernelIndex];
            }
        }
        let outputIndex = y * (width - kernelSize + 1) + x;
        outputImage[outputIndex] = sum + bias;
    }
}
