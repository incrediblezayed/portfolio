import 'package:flutter/material.dart';
import 'package:flutter_widget_from_html/flutter_widget_from_html.dart';

class HtmlView extends StatelessWidget {
  const HtmlView({super.key, required this.html});
  final String html;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: HtmlWidget(html),
    );
  }
}
