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
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(4),
        ),
        backgroundColor:
            active ? theme.colorScheme.primary : theme.scaffoldBackgroundColor,
        foregroundColor: active
            ? theme.colorScheme.onPrimary
            : theme.colorScheme.onBackground,
      ),
      onPressed: onPressed,
      child: Text(text),
    );
  }
}
