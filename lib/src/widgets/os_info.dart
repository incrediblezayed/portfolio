import 'package:flutter/material.dart';
import 'package:portfolio/src/utils/device_utils.dart';

class OSInfo extends StatelessWidget {
  const OSInfo({super.key});
  static const String routeName = 'OSInfo';

  @override
  Widget build(BuildContext context) {
    final mediaQueryData = MediaQuery.of(context);
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
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w100,
                ),
              ),
              const SizedBox(
                height: 4,
              ),
              const Text(
                'Working on all platforms! (Android, iOS, linux, Window, macOS, Web) 🎉',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w100,
                ),
              )
            ],
          ),
          const Text(
            'Developed with Flutter ❤️, by Hassan Ansari 🤓',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w100,
            ),
          )
        ],
      ),
    );
  }
}
