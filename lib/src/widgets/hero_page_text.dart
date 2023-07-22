import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/utils/device_utils.dart';

class HeroPageText extends ConsumerWidget {
  const HeroPageText({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    const text = "Hello, I'm Hassan Ansari\nFull-Stack Developer";
    const Color color1 = Colors.indigo;
    const Color color2 = Colors.purple;
    final mediaQueryData = MediaQuery.of(context);
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    final paint = Paint()
      ..shader = const LinearGradient(
        colors: [color1, color2],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ).createShader(
        Rect.fromLTWH(0, 0, width, 0),
      );
    return Text(
      text,
      style: TextStyle(
        fontSize: width * .07,
        fontWeight: FontWeight.bold,
        color: !kIsWeb ||
                !(defaultTargetPlatform == TargetPlatform.iOS ||
                    defaultTargetPlatform == TargetPlatform.android)
            ? null
            : color2,
        foreground: !kIsWeb ||
                !(defaultTargetPlatform == TargetPlatform.iOS ||
                    defaultTargetPlatform == TargetPlatform.android)
            ? paint
            : null,
      ),
    );
  }
}
