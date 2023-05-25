import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class SocialButton extends StatefulWidget {
  final IconData icon;
  final Color iconColor;
  final Function() onPressed;
  const SocialButton(
      {Key? key,
      required this.icon,
      required this.iconColor,
      required this.onPressed})
      : super(key: key);

  @override
  State<SocialButton> createState() => _SocialButtonState();
}

class _SocialButtonState extends State<SocialButton>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  late Animation<Color?> color;
  late Animation<double> size;

  late Color startColor = const Color(0xff9e9e9e);
  late Color endColor = widget.iconColor;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    color = ColorTween(begin: startColor, end: endColor).animate(_controller);
    size = Tween<double>(begin: 24.0, end: 30.0).animate(_controller);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(8.0),
      child: SizedBox.square(
        child: MouseRegion(
          onEnter: (event) {
            _controller.forward();
          },
          onExit: (event) {
            _controller.reverse();
          },
          child: AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                return Transform.scale(
                  scale: size.value / 24,
                  child: InkWell(
                    onHover: (v) {
                      if (v) {
                        _controller.forward();
                      } else {
                        _controller.reverse();
                      }
                    },
                    onTapDown: (details) {
                      _controller.forward();
                    },
                    onTapUp: (details) {
                      _controller.reverse();
                    },
                    onTap: () {},
                    child: FaIcon(
                      widget.icon,
                      color: color.value,
                      size: 24,
                    ),
                  ),
                );
              }),
        ),
      ),
    );
  }
}
