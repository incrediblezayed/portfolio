import 'package:flutter/material.dart';
import 'package:portfolio/src/utils/constants.dart';

class NameWidget extends StatelessWidget {
  final double? fontSize;
  final FontWeight? fontWeight;
  final Color? color;
  static const String routeName = "NameWidget";
  const NameWidget(
      {Key? key,
      this.fontSize = 24,
      this.fontWeight = FontWeight.bold,
      this.color})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Hero(
      tag: Constants.nameHeroTag,
      child: Material(
        type: MaterialType.transparency,
        child: Text(
          'Hassan Ansari',
          style: TextStyle(
            color: color,
            fontSize: fontSize,
            fontWeight: fontWeight,
          ),
        ),
      ),
    );
  }
}
