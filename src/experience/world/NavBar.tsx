import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { gsap } from 'gsap';
import {
  Color,
  type Mesh,
  type MeshBasicMaterial,
  type ShaderMaterial,
} from 'three';
import { COLORS } from '../lib/colors';

const navLinks = [
  { label: 'Home' },
  { label: 'Experience' },
  { label: 'Education' },
  { label: 'Social' },
  { label: 'About Me' },
];

const FONT_SIZE = 0.06;
const FONT = '/fonts/BlenderPro-Bold.ttf';
const GAP = 0.07;
const STRIP_WIDTH = 0.008;
const STRIP_GAP = 0.003;

// Hoisted — created once, never GC'd per-render
const WHITE = new Color('#ffffff');
const ACTIVE_COLOR = new Color(COLORS.COLORI);

const NavigationLink = ({
  label,
  position,
  isActive,
  onActivate,
}: {
  label: string;
  position: [number, number, number];
  isActive: boolean;
  onActivate: () => void;
}) => {
  const [hovered, setHovered] = useState(false);
  const [textWidth, setTextWidth] = useState(0);

  const textRef = useRef<Mesh>(null);
  const underlineRef = useRef<Mesh>(null);
  const glowRef = useRef<ShaderMaterial>(null);
  const leftBracketRef = useRef<Mesh>(null);
  const rightBracketRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      glowRef.current.uniforms.uTime.value = clock.elapsedTime;
    }
  });

  const isVisible = hovered || isActive;
  const targetColor = isActive ? ACTIVE_COLOR : WHITE;
  const bracketOffset = textWidth / 2 + 0.025;

  const handleSync = () => {
    if (!textRef.current) return;
    textRef.current.geometry.computeBoundingBox();
    const bounds = textRef.current.geometry.boundingBox;
    if (bounds) setTextWidth(bounds.max.x - bounds.min.x);
  };

  useEffect(() => {
    if (
      !textRef.current ||
      !underlineRef.current ||
      !glowRef.current ||
      !leftBracketRef.current ||
      !rightBracketRef.current
    )
      return;

    const text = textRef.current;
    const underline = underlineRef.current;
    const glow = glowRef.current;
    const textMat = text.material as MeshBasicMaterial;
    const underlineMat = underline.material as MeshBasicMaterial;
    const leftBracket = leftBracketRef.current;
    const rightBracket = rightBracketRef.current;
    const leftMat = leftBracket.material as MeshBasicMaterial;
    const rightMat = rightBracket.material as MeshBasicMaterial;

    leftMat.transparent = true;
    rightMat.transparent = true;

    const colorTarget = {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
    };
    const tweenOpts = {
      duration: 0.15,
      ease: 'power2.out',
      overwrite: true as const,
    };

    gsap.to(textMat.color, { ...colorTarget, ...tweenOpts });
    gsap.to(underlineMat.color, { ...colorTarget, ...tweenOpts });
    gsap.to(glow.uniforms.uColor.value, {
      ...colorTarget,
      duration: 0.15,
      overwrite: true,
    });

    gsap.to(text.position, {
      y: isVisible ? 0.012 : 0,
      duration: 0.15,
      ease: 'power3.out',
      overwrite: true,
    });
    gsap.to(text.scale, {
      x: isActive ? 1.08 : 1,
      y: isActive ? 1.08 : 1,
      z: 1,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: true,
    });

    gsap.to(underline.scale, {
      y: isVisible ? 0.8 : 0,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: true,
    });
    gsap.to(underline.position, {
      y: isVisible ? -0.025 : -0.06,
      duration: 0.15,
      ease: 'power3.out',
      overwrite: true,
    });

    gsap.to(glow.uniforms.uOpacity, {
      value: isVisible ? 0.35 : 0,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: true,
    });

    gsap.to(leftBracket.position, {
      x: isActive ? -bracketOffset : -bracketOffset + 0.05,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: true,
    });
    gsap.to(leftMat, {
      opacity: isActive ? 1 : 0,
      duration: 0.15,
      ease: 'power2.out',
      overwrite: true,
    });

    gsap.to(rightBracket.position, {
      x: isActive ? bracketOffset : bracketOffset - 0.05,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: true,
    });
    gsap.to(rightMat, {
      opacity: isActive ? 1 : 0,
      duration: 0.15,
      ease: 'power2.out',
      overwrite: true,
    });
  }, [hovered, isActive, textWidth]);

  const segments = Math.max(
    1,
    Math.floor(textWidth / (STRIP_WIDTH + STRIP_GAP)),
  );

  return (
    <group position={position}>
      <Text
        ref={textRef}
        fontSize={FONT_SIZE}
        color="white"
        anchorX="center"
        anchorY="middle"
        font={FONT}
        onSync={handleSync}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onActivate();
        }}
      >
        {label.toUpperCase()}
      </Text>

      {textWidth > 0 && (
        <>
          {/* Gradient glow */}
          <mesh position={[0, -0.045, 0.004]} raycast={() => null}>
            <planeGeometry args={[textWidth, 0.04]} />
            <shaderMaterial
              ref={glowRef}
              transparent
              depthWrite={false}
              uniforms={{
                uColor: { value: WHITE.clone() },
                uOpacity: { value: 0 },
                uSegments: { value: segments },
                uGap: { value: STRIP_GAP / (textWidth / segments) },
                uTime: { value: 0 },
              }}
              vertexShader={`
                varying vec2 vUv;
                void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `}
              fragmentShader={`
                uniform vec3 uColor;
                uniform float uOpacity;
                uniform float uSegments;
                uniform float uGap;
                uniform float uTime;
                varying vec2 vUv;

                float random(float v) { return fract(sin(v * 127.1) * 43758.5453); }

                float animatedHeight(float idx) {
                  float phase = idx * 2.399;
                  float speed = 1.5 + random(idx + 10.0) * 5.0;
                  float h = 0.4 + sin(uTime * speed + phase) * 0.25
                              + sin(uTime * speed * 0.63 + phase * 1.7) * 0.15;
                  return clamp(h, 0.2, 1.2);
                }

                void main() {
                  float segX = vUv.x * uSegments;
                  float idx  = floor(segX);
                  float localX = fract(segX);

                  if (localX < uGap * 0.5 || localX > 1.0 - uGap * 0.5) discard;

                  float bottom = mix(0.05, 0.8, animatedHeight(idx));
                  if (vUv.y < bottom) discard;

                  float grad = pow((vUv.y - bottom) / (1.0 - bottom), 2.0);
                  gl_FragColor = vec4(uColor, grad * uOpacity);
                }
              `}
            />
          </mesh>

          {/* Underline */}
          <mesh
            ref={underlineRef}
            position={[0, -0.025, 0.005]}
            scale={[1, 0, 1]}
            raycast={() => null}
          >
            <planeGeometry args={[textWidth, 0.008]} />
            <meshBasicMaterial color="white" />
          </mesh>

          {/* Left bracket */}
          <Text
            ref={leftBracketRef}
            font={FONT}
            fontSize={FONT_SIZE}
            color={COLORS.COLORI}
            anchorX="center"
            anchorY="middle"
            position={[-bracketOffset + 0.05, 0.01, 0.01]}
          >
            [
          </Text>

          {/* Right bracket */}
          <Text
            ref={rightBracketRef}
            font={FONT}
            fontSize={FONT_SIZE}
            color={COLORS.COLORI}
            anchorX="center"
            anchorY="middle"
            position={[bracketOffset - 0.05, 0.01, 0.01]}
          >
            ]
          </Text>
        </>
      )}
    </group>
  );
};

const NavBar = ({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
}) => {
  // Estimate text widths
  const widths = navLinks.map((link) => link.label.length * FONT_SIZE * 0.55);
  const totalWidth =
    widths.reduce((sum, w) => sum + w, 0) + GAP * (navLinks.length - 1);

  let currentX = -totalWidth / 2;

  return (
    <group>
      {navLinks.map((link, index) => {
        const w = widths[index];
        const x = currentX + w / 2;
        currentX += w + GAP;
        return (
          <NavigationLink
            key={link.label}
            label={link.label}
            position={[x, 0.85, 0.06]}
            isActive={activeIndex === index}
            onActivate={() => setActiveIndex(index)}
          />
        );
      })}
    </group>
  );
};

export default NavBar;
