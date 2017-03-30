/**
 * @providesModule RNUtils.DeviceUtils
 */

import { Dimensions, Platform, StatusBar } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Singleton from 'singleton';
import _ from 'lodash';

const { height, width } = Dimensions.get('window');

const ANDROID_LOW_LEVEL_API = Platform.select({ android: Platform.Version < 21, ios: false });
const PLATFORM_IS_IOS = (Platform.OS === 'ios');

class DeviceUtils extends Singleton {
  androidLowLevelApi = ANDROID_LOW_LEVEL_API;
  platformIsIOS = PLATFORM_IS_IOS;
  screen = { height, width };

  navBarHeight = Platform.select({ android : 54, ios: 44 });
  statusBarHeight = ANDROID_LOW_LEVEL_API ? 0 : 20;

  /**
   * Padding from screen's top edge to the end of navigation bar
   * Notes that for Android versions under 21, status bars are separated from nav bar (solid),
   * while in higher versions of Android and iOS 6.0 & above,
   * status bars are merged with nav bar
   */
  navBarPadding = ANDROID_LOW_LEVEL_API
    ? this.navBarHeight
    : this.navBarHeight + this.statusBarHeight;

  get buildInfo() {
    const bundleId = DeviceInfo.getBundleId();
    const version = DeviceInfo.getVersion();
    const buildNumber = parseInt(DeviceInfo.getBuildNumber());

    const bunldeIdParts = bundleId.split('.');
    const lastPart = bunldeIdParts[bunldeIdParts.length - 1];

    const suffix = (lastPart === 'dev' || lastPart === 'stg') ? lastPart : '';
    let variant = '';

    switch (suffix) {
      case 'dev': variant = 'debug'; break;
      case 'stg': variant = 'staging'; break;
      default: variant = 'release'; break;
    }

    return {
      buildNumber,
      variant,
      versionName: _.isEmpty(suffix) ? version : `${version}-${suffix}`,
    };
  }

  showNetworkActivity(visible) {
    if (!PLATFORM_IS_IOS) return;
    StatusBar.setNetworkActivityIndicatorVisible(visible);
  }

  showStatusBar(visible) {
    if (ANDROID_LOW_LEVEL_API) return;
    StatusBar.setHidden(!visible, 'slide');
  }
}

export default DeviceUtils.get();
