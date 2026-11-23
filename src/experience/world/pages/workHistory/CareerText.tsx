import { memo } from 'react';
import { Text } from '@react-three/drei';

type CareerTextProps = {
  children: string;
  font?: string;
  fontSize?: number;
  color?: string;
  position?: [number, number, number];
  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'middle' | 'bottom';
  maxWidth?: number;
};

const CareerText = memo(
  ({
    children,
    font = 'BlenderPro-Bold.ttf',
    fontSize = 0.055,
    color = '#ffffff',
    position = [0, 0, 0],
    anchorX = 'left',
    anchorY = 'middle',
    maxWidth,
  }: CareerTextProps) => {
    return (
      <Text
        position={position}
        font={`/fonts/${font}`}
        fontSize={fontSize}
        color={color}
        anchorX={anchorX}
        anchorY={anchorY}
        maxWidth={maxWidth}
        material-toneMapped={false}
      >
        {children}
      </Text>
    );
  },
);

CareerText.displayName = 'CareerText';

export default CareerText;
