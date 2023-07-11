import 'package:flutter/material.dart';

class HeaderButtons extends StatelessWidget {
  const HeaderButtons({
    required this.text,
    required this.onPressed,
    required this.active,
    super.key,
  });
  final String text;
  final void Function() onPressed;
  final bool active;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor:
            active ? theme.colorScheme.secondary : Colors.transparent,
        elevation: 0,
        foregroundColor:
            active ? theme.primaryColor : theme.colorScheme.primary,
      ),
      onPressed: onPressed,
      child: Text(text),
    );
  }
}
