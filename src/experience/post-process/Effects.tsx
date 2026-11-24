import {
  EffectComposer,
  Noise,
  ToneMapping,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { ToneMappingMode, BlendFunction } from 'postprocessing';

const Effects = () => {
  return (
    <EffectComposer multisampling={8}>
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <ChromaticAberration
        offset={[0.0005, 0.0005]}
        radialModulation={false}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
    </EffectComposer>
  );
};

export default Effects;
