import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

/// Class for the device utils
class DeviceUtils {
  /// Method to get the current platform
  static String getCurrentPlaform() {
    if (kIsWeb) {
      return 'Web';
    } else {
      if (Platform.isAndroid) {
        return 'Android';
      } else if (Platform.isIOS) {
        return 'iOS';
      } else if (Platform.isMacOS) {
        return 'MacOS';
      } else if (Platform.isWindows) {
        return 'Windows';
      } else if (Platform.isLinux) {
        return 'Linux';
      } else {
        return 'Unknown';
      }
    }
  }

  /// Method to get the media query width
  static double mediaQueryWidth(MediaQueryData mediaQueryData) {
    if (mediaQueryData.orientation == Orientation.landscape) {
      return mediaQueryData.size.width / 2;
    } else {
      return mediaQueryData.size.width;
    }
  }

  /// Method to get the size from mediaquery with min and max size
  static double minMaxSizeWithMediaQuery({
    required double mediaQuerySize,
    required double minSize,
    required double multiplier,
    double? maxSize,
  }) {
    final size = mediaQuerySize * multiplier;
    if (size < minSize) {
      return minSize;
    } else if (maxSize != null && maxSize < size) {
      return maxSize;
    } else {
      return size;
    }
  }

  /// Method to get the OS version
  static String getOSVersion() {
    if (kIsWeb) {
      return '';
    } else {
      return Platform.operatingSystemVersion;
    }
  }
}
