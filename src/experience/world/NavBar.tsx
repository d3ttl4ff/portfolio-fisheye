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

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Experience', path: '/' },
  // { label: 'Projekts', path: '/' },
  { label: 'Education', path: '/' },
  { label: 'Social', path: '/' },
  { label: 'About Me', path: '/' },
];

const FONT_SIZE = 0.06;
const FONT = '/fonts/BlenderPro-Bold.ttf';
const GAP = 0.07;
const STRIP_WIDTH = 0.008;
const STRIP_GAP = 0.003;

const ROSE = new Color('#729252');
const WHITE = new Color('#ffffff');

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

  // Hover always takes color precedence
  const targetColor = isActive ? ROSE : hovered ? WHITE : WHITE;

  // Bracket positions
  const bracketOffset = textWidth / 2 + 0.025;

  // Measure actual rendered text width
  const handleSync = () => {
    if (!textRef.current) return;

    textRef.current.geometry.computeBoundingBox();

    const bounds = textRef.current.geometry.boundingBox;

    if (bounds) {
      setTextWidth(bounds.max.x - bounds.min.x);
    }
  };

  // Hover and active animations
  useEffect(() => {
    if (
      !textRef.current ||
      !underlineRef.current ||
      !glowRef.current ||
      !leftBracketRef.current ||
      !rightBracketRef.current
    ) {
      return;
    }

    const text = textRef.current;
    const underline = underlineRef.current;
    const glow = glowRef.current;

    const textMaterial = text.material as MeshBasicMaterial;
    const underlineMaterial = underline.material as MeshBasicMaterial;

    const leftBracket = leftBracketRef.current;
    const rightBracket = rightBracketRef.current;

    const leftMaterial = leftBracket.material as MeshBasicMaterial;
    const rightMaterial = rightBracket.material as MeshBasicMaterial;

    // Make brackets transparent
    leftMaterial.transparent = true;
    rightMaterial.transparent = true;

    // Animate text color
    gsap.to(textMaterial.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.15,
      ease: 'power2.out',
      overwrite: true,
    });

    // Animate text position
    gsap.to(text.position, {
      y: isVisible ? 0.012 : 0,
      duration: 0.15,
      ease: 'power3.out',
      overwrite: true,
    });

    // Animate text scale when active
    gsap.to(text.scale, {
      x: isActive ? 1.08 : 1,
      y: isActive ? 1.08 : 1,
      z: 1,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: true,
    });

    // Animate underline color
    gsap.to(underlineMaterial.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.15,
      ease: 'power2.out',
      overwrite: true,
    });

    // Animate underline visibility
    gsap.to(underline.scale, {
      y: isVisible ? 0.8 : 0,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: true,
    });

    // Animate underline position
    gsap.to(underline.position, {
      y: isVisible ? -0.025 : -0.06,
      duration: 0.15,
      ease: 'power3.out',
      overwrite: true,
    });

    // Animate gradient color
    gsap.to(glow.uniforms.uColor.value, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.15,
      overwrite: true,
    });

    // Animate gradient opacity
    gsap.to(glow.uniforms.uOpacity, {
      value: isVisible ? 0.35 : 0,
      duration: 0.2,
      ease: 'power2.out',
      overwrite: true,
    });

    // Animate left bracket
    gsap.to(leftBracket.position, {
      x: isActive ? -bracketOffset : -bracketOffset + 0.05,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: true,
    });

    gsap.to(leftMaterial, {
      opacity: isActive ? 1 : 0,
      duration: 0.15,
      ease: 'power2.out',
      overwrite: true,
    });

    // Animate right bracket
    gsap.to(rightBracket.position, {
      x: isActive ? bracketOffset : bracketOffset - 0.05,
      duration: 0.2,
      ease: 'power3.out',
      overwrite: true,
    });

    gsap.to(rightMaterial, {
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
  // const bracketOffset = textWidth / 2 + 0.025;

  return (
    <group position={position}>
      {/* Navigation Text */}
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

      {/* Animated Underline and Gradient */}
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

                  gl_Position = projectionMatrix *
                    modelViewMatrix *
                    vec4(position, 1.0);
                }
              `}
              fragmentShader={`
                uniform vec3 uColor;
                uniform float uOpacity;
                uniform float uSegments;
                uniform float uGap;
                uniform float uTime;

                varying vec2 vUv;

                // Generate deterministic random values
                float random(float value) {
                    return fract(sin(value * 127.1) * 43758.5453);
                }

                // Smoothly animate each strip's random height
                float animatedHeight(float index) {
                    float time = uTime;

                    // Different speeds and phases for each stripe
                    float phase = index * 2.399;
                    float speed = 1.5 + random(index + 10.0) * 5.0;

                    // Smooth continuous movement
                    float wave1 = sin(time * speed + phase);
                    float wave2 = sin(time * speed * 0.63 + phase * 1.7);

                    // Combine waves to create more organic movement
                    float height = 0.4 + wave1 * 0.25 + wave2 * 0.15;

                    return clamp(height, 0.2, 1.2);
                }

                void main() {
                    float segments = uSegments;

                    // Identify individual strip
                    float segmentX = vUv.x * segments;
                    float segmentIndex = floor(segmentX);
                    float localX = fract(segmentX);

                    // Animate each strip independently
                    float randomHeight = animatedHeight(segmentIndex);

                    // Different bottom positions over time
                    float bottomOffset = mix(0.05, 0.8, randomHeight);

                    // Strip spacing
                    if (
                        localX < uGap * 0.5 ||
                        localX > 1.0 - uGap * 0.5
                    ) {
                        discard;
                    }

                    // Keep the top fixed, move the bottom
                    if (vUv.y < bottomOffset) {
                        discard;
                    }

                    // Independent gradient for each strip
                    float gradient = pow(
                        (vUv.y - bottomOffset) / (1.0 - bottomOffset),
                        2.0
                    );

                    gl_FragColor = vec4(
                        uColor,
                        gradient * uOpacity
                    );
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

          {/* Left Bracket */}
          <Text
            ref={leftBracketRef}
            font={FONT}
            fontSize={FONT_SIZE}
            color="#729252"
            anchorX="center"
            anchorY="middle"
            position={[-bracketOffset + 0.05, 0.01, 0.01]}
          >
            [
          </Text>

          {/* Right Bracket */}
          <Text
            ref={rightBracketRef}
            font={FONT}
            fontSize={FONT_SIZE}
            color="#729252"
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

// Active state is controlled by the parent Canvas

const NavBar = ({
  activeIndex,
  setActiveIndex,
}: {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
}) => {
  // Estimate text widths
  const widths = navLinks.map((link) => link.label.length * FONT_SIZE * 0.55);

  // Calculate total width
  const totalWidth =
    widths.reduce((sum, width) => sum + width, 0) + GAP * (navLinks.length - 1);

  // Start from the left edge
  let currentX = -totalWidth / 2;

  return (
    <group>
      {navLinks.map((link, index) => {
        const width = widths[index];

        // Move to the center of this text
        const position = currentX + width / 2;

        // Next text starts after this text and the gap
        currentX += width + GAP;

        return (
          <NavigationLink
            key={link.label}
            label={link.label}
            position={[position, 0.85, 0.06]}
            isActive={activeIndex === index}
            onActivate={() => setActiveIndex(index)}
          />
        );
      })}
    </group>
  );
};

export default NavBar;
