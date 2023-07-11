/* import 'dart:async';

import 'package:flutter/material.dart';
import 'package:portfolio/src/ui/home.dart';
import 'package:portfolio/src/utils/constants.dart';
import 'package:portfolio/src/widgets/info_widgets/name.dart';
import 'package:portfolio/src/widgets/info_widgets/subtitle.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  _SplashScreenState createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late AnimationController _subtitleController;
  late Animation<double> _fadeAnimation;
  late Animation<double> _fadeAnimation2;

  late Animation<Offset> _slideAnimation;
  late Animation<Offset> _subTitleSlideAnimation;

  @override
  void initState() {
    super.initState();

    // Initialize animation controller
    _controller = AnimationController(
      duration: const Duration(milliseconds: 700),
      vsync: this,
    );

    // Initialize subtitle animation controller
    _subtitleController = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    // Initialize fade animation
    _fadeAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeIn,
      ),
    );

    // Initialize fade animation
    _fadeAnimation2 = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(
        parent: _subtitleController,
        curve: Curves.easeIn,
      ),
    );

    // Initialize slide animation
    _slideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOut,
      ),
    );

    // Initialize slide animation
    _subTitleSlideAnimation = Tween<Offset>(
      begin: const Offset(0, 0.5),
      end: Offset.zero,
    ).animate(
      CurvedAnimation(
        parent: _subtitleController,
        curve: Curves.easeOut,
      ),
    );

    // Start the animation
    _controller.forward();
    Timer(const Duration(milliseconds: 1000), () {
      _subtitleController.forward();
      Timer(const Duration(milliseconds: 1500), () {
        Navigator.pushReplacement(
          context,
          PageRouteBuilder<dynamic>(
            pageBuilder: (context, animation, secondaryAnimation) {
              const begin = Offset(1, 0);
              const end = Offset.zero;
              const curve = Curves.ease;

              final tween =
                  Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
              return SlideTransition(
                position: tween.animate(animation),
                child: const Home(),
              );
            },
            transitionDuration: const Duration(milliseconds: 800),
          ),
        );
      });
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Scaffold(
      body: Center(
        child: AnimatedBuilder(
          animation: Listenable.merge([_controller, _subtitleController]),
          builder: (BuildContext context, Widget? child) {
            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Opacity(
                  opacity: _fadeAnimation.value,
                  child: Transform.translate(
                    offset: Offset(0, -50.0 * _slideAnimation.value.dy),
                    child: const NameWidget(),
                  ),
                ),
                const SizedBox(height: 20),
                Opacity(
                  opacity: _fadeAnimation2.value,
                  child: SlideTransition(
                    position: _subTitleSlideAnimation,
                    child: Column(
                      children: [
                        Hero(
                          tag: Constants.dividerTag,
                          child: Material(
                            type: MaterialType.transparency,
                            child: Divider(
                              thickness: 2,
                              indent: 50,
                              endIndent: 50,
                              color: theme.colorScheme.onSurface,
                            ),
                          ),
                        ),
                        const SizedBox(height: 10),
                        const SubtitleWidget()
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
 */
