/**
 * @providesModule RNUtils.FontUtils
 */

import { Platform } from 'react-native';
import Singleton from 'singleton';
import _ from 'lodash';

const FONT_FAMILY = Platform.select({ android: 'SanFrancisco', ios: 'System' });
const FONT_STYLES = { italic: 'italic', normal: 'normal' };

// SF font weight: https://gist.github.com/anhari/02f930b6894cc30561c57892e893f540
// Normal & Bold uses default fontWeight configs
const FONT_WEIGHTS = {
  ultralight:         '100',
  light:              '200',
  regular:            '400',
  medium:             '500',
  semibold:           '600',
  normal:             'normal',
  bold:               'bold',
};

function transformFontConfigs({ family, style, weight }) {
  const customConfigs = {
    fontFamily: `${family}${_.capitalize(weight)}${_.capitalize(style)}`,
    fontStyle: FONT_STYLES.normal,
    fontWeight: FONT_WEIGHTS.normal,
  };

  const defaultConfigs = {
    fontFamily: family,
    fontStyle: style,
    fontWeight: FONT_WEIGHTS[weight] || FONT_WEIGHTS.normal,
  };

  return Platform.select({
    // Use custom configs for custom fonts on Android
    android: family === 'System' ? defaultConfigs : customConfigs,
    ios: defaultConfigs,
  });
}

class FontUtils extends Singleton {
  colors = {
    wefitTheme: '#292941',
  };

  build({
    align = 'left',
    background = 'transparent',
    color = 'black',
    family = FONT_FAMILY,
    size = 13,
    style = 'normal',
    weight = 'regular',
    ...extraProps
  } = {}) {
    return {
      color,
      backgroundColor: background,
      fontSize: size,
      textAlign: align,
      ...extraProps,
      ...transformFontConfigs({ family, style, weight }),
    };
  }
}

export default FontUtils.get();
