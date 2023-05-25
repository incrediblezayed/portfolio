import 'package:flutter/material.dart';
import 'package:portfolio/src/utils/constants.dart';

class SubtitleWidget extends StatelessWidget {
  final double? fontSize;
  final FontWeight? fontWeight;
  final Color? color;
  final TextAlign? textAlign;
  const SubtitleWidget(
      {super.key,
      this.fontSize = 18,
      this.fontWeight = FontWeight.w500,
      this.color,
      this.textAlign = TextAlign.center});

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: Constants.subtitleHeroTag,
      child: Material(
        type: MaterialType.transparency,
        child: Text(
          "Flutter fanatic with a passion for crafting top-notch mobile apps! Agile expert with strong problem-solving skills. Let's connect and bring your vision to life!",
          textAlign: textAlign,
          style: TextStyle(
            fontSize: fontSize,
            fontWeight: fontWeight,
            color: color,
          ),
        ),
      ),
    );
  }
}
