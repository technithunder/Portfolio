import React from 'react';
import { Svg, Rect, Defs, Pattern, Image } from 'react-native-svg';

const AppLogo = () => {
  return (
    <Svg width="100" height="84" viewBox="0 0 100 84" fill="none">
      <Rect width="100" height="83.6364" fill="url(#pattern0_37_5)" />
      <Defs>
        <Pattern
          id="pattern0_37_5"
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <Image
            id="image0_37_5"
            width="132"
            height="110"
            href={{
              uri: 'data:image/png;base64,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
            }}
          />
        </Pattern>
      </Defs>
    </Svg>
  );
};

export default AppLogo;
