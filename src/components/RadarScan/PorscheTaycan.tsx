import { useRef, useMemo, useEffect } from "react";
import { PointMaterial, Points, useGLTF } from "@react-three/drei";
useGLTF.preload("/porsche_taycan.glb");

function PorscheTaycan() {
  const { nodes } = useGLTF("/porsche_taycan.glb");
  const points = useRef({});

  // 从 GLB 模型中提取顶点
  const positions = useMemo(() => {
    let positions = [];
    const scale = 0.015;

    // 用于计算边界框
    let minX = Infinity,
      minY = Infinity,
      minZ = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity,
      maxZ = -Infinity;

    // 第一次遍历：计算边界框
    Object.values(nodes).forEach((node) => {
      if (node.geometry) {
        const positionAttribute = node.geometry.attributes.position;
        for (let i = 0; i < positionAttribute.count; i++) {
          const x = positionAttribute.getX(i);
          const y = positionAttribute.getY(i);
          const z = positionAttribute.getZ(i);

          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          minZ = Math.min(minZ, z);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
          maxZ = Math.max(maxZ, z);
        }
      }
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;

    // 增加插值点
    Object.values(nodes).forEach((node) => {
      if (node.geometry) {
        const positionAttribute = node.geometry.attributes.position;
        for (let i = 0; i < positionAttribute.count - 1; i++) {
          // 原始点
          const x1 = positionAttribute.getX(i);
          const y1 = positionAttribute.getY(i);
          const z1 = positionAttribute.getZ(i);

          // 下一个点
          const x2 = positionAttribute.getX(i + 1);
          const y2 = positionAttribute.getY(i + 1);
          const z2 = positionAttribute.getZ(i + 1);

          // 在两点之间插入额外的点
          const subdivisions = 3; // 每两个点之间插入的点数
          for (let j = 0; j <= subdivisions; j++) {
            const t = j / subdivisions;
            const x = x1 + (x2 - x1) * t;
            const y = y1 + (y2 - y1) * t;
            const z = z1 + (z2 - z1) * t;

            // 添加插值后的点
            positions.push(
              (y - centerY) * scale,
              (z - centerZ) * scale,
              (x - centerX) * scale
            );
          }
        }
      }
    });

    return new Float32Array(positions);
  }, [nodes]);

  // 设置初始旋转角度
  useEffect(() => {
    if (points.current) {
      points.current.rotation.y = Math.PI / 2;
    }
  }, []);

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={"#ffffff"}
        size={0.008}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
}

export default PorscheTaycan;
