import 'package:flutter/material.dart';
import 'package:portfolio/src/utils/device_utils.dart';

class OSInfo extends StatelessWidget {
  const OSInfo({super.key});

  @override
  Widget build(BuildContext context) {
    final mediaQueryData = MediaQuery.of(context);
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    return SizedBox(
      width: mediaQueryData.size.width,
      child: Wrap(
        crossAxisAlignment: WrapCrossAlignment.end,
        alignment: WrapAlignment.spaceBetween,
        spacing: 8,
        runSpacing: 16,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                'Running on ${DeviceUtils.getCurrentPlaform()} 🚀 ${DeviceUtils.getOSVersion()}',
                style: TextStyle(
                  fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                    mediaQuerySize: width,
                    minSize: 14,
                    multiplier: 0.02,
                  ),
                  fontWeight: FontWeight.w100,
                ),
              ),
              const SizedBox(
                height: 4,
              ),
              Text(
                'Working on all platforms! (Android, iOS, linux, Window, macOS, Web) 🎉',
                style: TextStyle(
                  fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                    mediaQuerySize: width,
                    minSize: 12,
                    multiplier: 0.02,
                  ),
                  fontWeight: FontWeight.w100,
                ),
              )
            ],
          ),
          Text(
            'Developed with Flutter ❤️, by Hassan Ansari 🤓',
            style: TextStyle(
              height: 0.5,
              fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                mediaQuerySize: width,
                minSize: 12,
                multiplier: 0.02,
              ),
              fontWeight: FontWeight.w100,
            ),
          )
        ],
      ),
    );
  }
}
