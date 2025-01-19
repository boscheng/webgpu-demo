import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";

interface RadarScanProps {
  radius?: number;
  color?: string;
  speed?: number;
  ringCount?: number;
  onComplete?: () => void;
}

export function RadarScan({
  radius = 2,
  color = "#3DDFEA",
  speed = 1,
  ringCount = 3,
  onComplete,
}: RadarScanProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [time, setTime] = useState(0);

  // 自定义着色器
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      color: { value: new THREE.Color(color) },
      time: { value: 0 },
      radius: { value: radius },
      ringCount: { value: ringCount },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 color;
      uniform float time;
      uniform float radius;
      uniform float ringCount;
      varying vec2 vUv;

      void main() {
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vUv, center);
        
        // 创建多个向外扩散的波纹
        float wave = 0.0;
        for(float i = 0.0; i < 3.0; i++) {
          float t = time - i * 0.3;
          float wavePos = mod(t, 1.0);
          float ringDist = abs(dist - wavePos);
          wave += smoothstep(0.03, 0.0, ringDist) * (1.0 - wavePos);
        }
        
        // 创建圆形边缘
        float circle = 1.0 - smoothstep(0.45, 0.5, dist);
        
        // 创建径向渐变
        float radialGradient = 1.0 - dist * 2.0;
        
        // 组合效果
        float alpha = circle * (wave * 0.6 + 0.1) * radialGradient;
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  useFrame((state, delta) => {
    if (materialRef.current) {
      // 更新时间
      const newTime = time + delta * speed;
      setTime(newTime);
      materialRef.current.uniforms.time.value = newTime;

      // 检查是否完成一次完整扫描
      if (newTime >= 1 && onComplete) {
        onComplete();
      }
    }
  });

  return (
    <mesh rotation-x={-Math.PI / 2}>
      <planeGeometry args={[radius * 2, radius * 2]} />
      <primitive object={shaderMaterial} ref={materialRef} />
    </mesh>
  );
}
