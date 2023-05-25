import 'dart:io';

import 'package:flutter/foundation.dart';

class DeviceUtils {
  static String getCurrentPlaform() {
    if (kIsWeb) {
      return "Web";
    } else {
      if (Platform.isAndroid) {
        return "Android";
      } else if (Platform.isIOS) {
        return "iOS";
      } else if (Platform.isMacOS) {
        return "MacOS";
      } else if (Platform.isWindows) {
        return "Windows";
      } else if (Platform.isLinux) {
        return "Linux";
      } else {
        return "Unknown";
      }
    }
  }

  static String getOSVersion() {
    if (kIsWeb) {
      return "";
    } else {
      return Platform.operatingSystemVersion;
    }
  }
}
