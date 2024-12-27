export const clearColor = { r: 0.0, g: 0.5, b: 1.0, a: 1.0 };

// Define vertices for a pyramid (4 triangles: 3 sides + base)
export const vertices = new Float32Array([
  // Front face (red)
  0.0,
  0.5,
  0.0,
  1.0,
  1.0,
  0.0,
  0.0,
  1.0, // top
  -0.5,
  -0.5,
  0.5,
  1.0,
  1.0,
  0.0,
  0.0,
  1.0, // bottom left
  0.5,
  -0.5,
  0.5,
  1.0,
  1.0,
  0.0,
  0.0,
  1.0, // bottom right

  // Right face (green)
  0.0,
  0.5,
  0.0,
  1.0,
  0.0,
  1.0,
  0.0,
  1.0, // top
  0.5,
  -0.5,
  0.5,
  1.0,
  0.0,
  1.0,
  0.0,
  1.0, // bottom left
  0.5,
  -0.5,
  -0.5,
  1.0,
  0.0,
  1.0,
  0.0,
  1.0, // bottom right

  // Back face (blue)
  0.0,
  0.5,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  1.0, // top
  0.5,
  -0.5,
  -0.5,
  1.0,
  0.0,
  0.0,
  1.0,
  1.0, // bottom left
  -0.5,
  -0.5,
  -0.5,
  1.0,
  0.0,
  0.0,
  1.0,
  1.0, // bottom right

  // Left face (yellow)
  0.0,
  0.5,
  0.0,
  1.0,
  1.0,
  1.0,
  0.0,
  1.0, // top
  -0.5,
  -0.5,
  -0.5,
  1.0,
  1.0,
  1.0,
  0.0,
  1.0, // bottom left
  -0.5,
  -0.5,
  0.5,
  1.0,
  1.0,
  1.0,
  0.0,
  1.0, // bottom right
]);

export const shaders = `
  struct Uniforms {
    modelViewProjection: mat4x4f,
  }
  @binding(0) @group(0) var<uniform> uniforms: Uniforms;

  struct VertexOut {
    @builtin(position) position: vec4f,
    @location(0) color: vec4f
  }

  @vertex
  fn vertex_main(@location(0) position: vec4f, @location(1) color: vec4f) -> VertexOut {
    var output: VertexOut;
    output.position = uniforms.modelViewProjection * position;
    output.color = color;
    return output;
  }

  @fragment
  fn fragment_main(fragData: VertexOut) -> @location(0) vec4f {
    return fragData.color;
  }
`;
