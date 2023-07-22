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
    final orientation = MediaQuery.of(context).orientation;
    final isLandscape = orientation == Orientation.landscape;
    return InkWell(
      onTap: onPressed,
      child: AnimatedContainer(
        height: kToolbarHeight / 2.5,
        alignment: isLandscape ? Alignment.center : Alignment.centerLeft,
        duration: const Duration(milliseconds: 300),
        margin: const EdgeInsets.symmetric(vertical: 12),
        width: !isLandscape ? MediaQuery.of(context).size.width : 130,
        decoration: BoxDecoration(
          border: !isLandscape && active
              ? Border(
                  bottom: BorderSide(color: theme.colorScheme.onBackground),
                )
              : null,
        ),
        child: Text(
          text,
          style: TextStyle(
            color: theme.colorScheme.onBackground,
            fontSize: 20,
            fontWeight: active ? FontWeight.bold : FontWeight.normal,
          ),
        ),
      ),
    );
  }
}
