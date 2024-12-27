export const clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };
export const vertices = new Float32Array([
  0.0, 0.6, 0, 1, 1, 0, 0, 1, -0.5, -0.6, 0, 1, 0, 1, 0, 1, 0.5, -0.6, 0, 1, 0,
  0, 1, 1,
]);

export const shaders = `
  struct VertexOut {
    @builtin(position) position : vec4f,
    @location(0) color : vec4f
  }

  @vertex
  fn vertex_main(@location(0) position: vec4f, @location(1) color: vec4f) -> VertexOut {
    var output : VertexOut;
    output.position = position;
    output.color = color;
    return output;
  }

  @fragment
  fn fragment_main(fragData: VertexOut) -> @location(0) vec4f {
    return fragData.color;
  }
`;
