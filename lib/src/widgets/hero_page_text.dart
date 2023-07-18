import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/utils/muti_color_tween.dart';

class HeroPageText extends ConsumerStatefulWidget {
  const HeroPageText({super.key});

  @override
  ConsumerState<HeroPageText> createState() => _HeroPageTextState();
}

class _HeroPageTextState extends ConsumerState<HeroPageText>
    with SingleTickerProviderStateMixin {
  late AnimationController controller;
  List<Color> get list1 => [
        Colors.lightBlue,
        Colors.blue,
        Colors.indigo,
        Colors.purple,
        Colors.pink,
      ];
  List<Color> get list2 => [
        Colors.pinkAccent,
        Colors.lightBlueAccent,
        Colors.blueAccent,
        Colors.indigoAccent,
        Colors.purpleAccent,
      ];

  List<Color> get colors => list1;

  List<Color> get colors2 => list2;

  final String text = "Hello, I'm Hassan Ansari\nFull Stack Flutter Developer";

  @override
  void initState() {
    super.initState();
    controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    );
    initAnimation(controller);
  }

  late Tween<Color?> _color1Tween;
  late Tween<Color?> _color2Tween;

  late Animation<Color?> _color1;
  late Animation<Color?> _color2;

  void initAnimation(AnimationController controller) {
    _color1Tween = MultiColorTween(colors);
    _color2Tween = MultiColorTween(colors2);

    _color1 = _color1Tween.animate(
      CurvedAnimation(
        parent: controller,
        curve: const Interval(0, 1, curve: Curves.easeIn),
      ),
    );

    _color2 = _color2Tween.animate(
      CurvedAnimation(
        parent: controller,
        curve: const Interval(0, 1, curve: Curves.easeIn),
      ),
    );

    Future.delayed(const Duration(milliseconds: 500), () {
      controller
        ..forward()
        ..repeat(reverse: true);
    });
  }

  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appTheme = ref.watch(themeProvider);
    final theme = Theme.of(context);
    final mediaQueryData = MediaQuery.of(context);
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);

    return AnimatedBuilder(
      animation: controller,
      builder: (context, child) {
        final paint = Paint()
          ..shader = LinearGradient(
            colors: [_color1.value!, _color2.value!],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ).createShader(
            Rect.fromLTWH(0, 0, width, 0),
          );
        return SizedBox(
          width: width * 0.9,
          child: Text(
            text,
            style: TextStyle(
              fontSize: width * .07,
              fontWeight: FontWeight.bold,
              foreground: paint,
            ),
          ),
        );
      },
    );
  }
}
