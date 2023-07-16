import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:url_launcher/url_launcher_string.dart';

class SocialButton extends StatefulWidget {
  const SocialButton({
    required this.icon,
    required this.iconColor,
    required this.socialName,
    this.onPressed,
//    required this.theme,
    this.url,
    super.key,
  }) : assert(url != null || onPressed != null);

  final IconData icon;
  final Color iconColor;
  final String? url;
  final String socialName;
  //final ThemeData theme;
  final void Function()? onPressed;

  @override
  State<SocialButton> createState() => _SocialButtonState();
}

class _SocialButtonState extends State<SocialButton>
    with SingleTickerProviderStateMixin {
  bool isInitialized = false;

  late AnimationController _controller;

  late Animation<Color?> color;
  late Animation<double> size;

  late Color startColor;
  late Color endColor = widget.iconColor;
  late CurvedAnimation curvedAnimation;
  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (!isInitialized) {
      _controller = AnimationController(
        duration: const Duration(milliseconds: 400),
        vsync: this,
      );
      startColor = Theme.of(context).colorScheme.onBackground;
      color = ColorTween(
        begin: startColor,
        end: endColor,
      ).animate(_controller);
      isInitialized = true;
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final mediaQueryData = MediaQuery.of(context);
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    size = Tween<double>(
      begin: DeviceUtils.minMaxSizeWithMediaQuery(
        mediaQuerySize: width,
        minSize: 24,
        multiplier: 0.05,
      ),
      end: DeviceUtils.minMaxSizeWithMediaQuery(
        mediaQuerySize: width,
        minSize: 50,
        multiplier: 0.09,
      ),
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.elasticOut,
        reverseCurve: Curves.elasticIn,
      ),
    );
    return Padding(
      padding: EdgeInsets.only(
        top: 12,
        bottom: 12,
        right: DeviceUtils.minMaxSizeWithMediaQuery(
          mediaQuerySize: width,
          minSize: 12,
          multiplier: 0.02,
        ),
        left: DeviceUtils.minMaxSizeWithMediaQuery(
          mediaQuerySize: width,
          minSize: 12,
          multiplier: 0.02,
        ),
      ),
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
                onTapCancel: () {
                  _controller.reverse();
                },
                onTap: widget.onPressed ??
                    () {
                      launchUrlString(widget.url!);
                    },
                child: Tooltip(
                  message: '${widget.socialName}\n${widget.url!}',
                  waitDuration: const Duration(milliseconds: 500),
                  child: FaIcon(
                    widget.icon,
                    color: color.value,
                    size: 24,
                  ),
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
