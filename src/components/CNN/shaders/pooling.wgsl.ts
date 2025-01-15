const pooling = `
@group(0) @binding(0) var<storage, read> inputImage: array<f32>;
@group(0) @binding(1) var<storage, read_write> outputImage: array<f32>;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let width = 28u; // 输入宽度
    let height = 28u; // 输入高度
    let poolSize = 2u; // 池化窗口大小

    let x = global_id.x * poolSize;
    let y = global_id.y * poolSize;

    if (x < width && y < height) {
        var maxVal: f32 = -1.0 / 0.0; // 初始化为负无穷
        for (var py: u32 = 0; py < poolSize; py++) {
            for (var px: u32 = 0; px < poolSize; px++) {
                let index = (y + py) * width + (x + px);
                maxVal = max(maxVal, inputImage[index]);
            }
        }
        let outputIndex = (y / poolSize) * (width / poolSize) + (x / poolSize);
        outputImage[outputIndex] = maxVal;
    }
}
`;
export default pooling;
