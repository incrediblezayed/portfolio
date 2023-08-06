import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/ui/home_page.dart';
import 'package:portfolio/src/ui/projects_page.dart';
import 'package:portfolio/src/ui/work_experiences.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/widgets/header.dart';

class Dashboard extends ConsumerStatefulWidget {
  const Dashboard({super.key});

  @override
  ConsumerState<Dashboard> createState() => _HomeState();
}

class _HomeState extends ConsumerState<Dashboard>
    with TickerProviderStateMixin {
  late AnimationController _controller;
  late AnimationController _waveHeightController;
  late Animation<double> _waveHeightAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(milliseconds: 3000),
      vsync: this,
    );
    _controller.repeat();
    _waveHeightController = AnimationController(
      duration: const Duration(milliseconds: 2000),
      vsync: this,
    );
    _waveHeightAnimation = Tween<double>(begin: 0, end: 1).animate(
      _waveHeightController,
    );
  }

  GlobalKey textKey = GlobalKey();

  Widget _buildWave(double height) {
    final size = MediaQuery.sizeOf(context);
    final appTheme = ref.watch(themeProvider);
    final theme = Theme.of(context);
    return SizedBox(
      width: size.width,
      height: size.height,
      child: CustomPaint(
        painter: WavePainter(
          textKey: textKey,
          controller: _controller,
          waves: 3,
          waveAmplitude: 50,
          waveColor: LinearGradient(
            colors: [
              theme.colorScheme.onPrimary,
              appTheme.getAlternatePrimaryColor(),
            ],
            begin: Alignment.bottomCenter,
            end: Alignment.topCenter,
          ),
          loadingStep: size.height - (size.height * height),
        ),
      ),
    );
  }

  Widget _buildAnimation(double loadingStep) {
    final theme = Theme.of(context);

    final size = MediaQuery.sizeOf(context);
    final width = DeviceUtils.mediaQueryWidth(MediaQuery.of(context));

    return SizedBox(
      width: size.width,
      height: size.height,
      child: Stack(
        children: [
          _buildWave(loadingStep),
          SizedBox(
            width: size.width,
            height: size.height,
            child: ShaderMask(
              blendMode: BlendMode.srcOut,
              shaderCallback: (bounds) => LinearGradient(
                colors: [theme.primaryColor],
                stops: const [0.0],
              ).createShader(bounds),
              child: Container(
                color: Colors.transparent,
                width: size.width,
                child: Row(
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Container(
                        height: size.height,
                        width: size.width * .1,
                        color: theme.primaryColor,
                      ),
                    ),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.all(30),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            SizedBox(
                              width: width * 1.3,
                              child: const FittedBox(
                                child: Text(
                                  'Loading...',
                                  style: TextStyle(
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                              ),
                            ),
                            SizedBox(
                              width: width * 1.2,
                              height: size.height * .4,
                              child: FittedBox(
                                child: Text(
                                  '${(loadingStep * 100).floor()}%',
                                  style: const TextStyle(
                                    fontWeight: FontWeight.w900,
                                  ),
                                ),
                              ),
                            ),
                            SizedBox(
                              width: width * .5,
                              child: const FittedBox(
                                child: Text(
                                  'Welcome!!!',
                                  style: TextStyle(
                                    fontSize: 30,
                                    fontWeight: FontWeight.w600,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final mainPro = ref.watch(mainProvider);

    return Scaffold(
      body: mainPro.loadingStep == 5
          ? Padding(
              padding: EdgeInsets.only(
                top: MediaQuery.of(context).padding.top,
              ),
              child: Stack(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: kToolbarHeight * 0.9),
                    child: PageView(
                      onPageChanged: (i) {
                        mainPro.mainPageIndex = i;
                      },
                      controller: mainPro.mainPageController,
                      children: const [
                        HomePage(),
                        WorkExperiences(),
                        ProjectsPage(),
                      ],
                    ),
                  ),
                  const HeaderWidget(),
                ],
              ),
            )
          : AnimatedBuilder(
              animation: _controller,
              builder: (context, child) {
                if (mainPro.loadingStep == 1) {
                  _waveHeightController.animateTo(.25);
                } else if (mainPro.loadingStep == 2) {
                  _waveHeightController.animateTo(.5);
                } else if (mainPro.loadingStep == 3) {
                  _waveHeightController.animateTo(.75);
                } else if (mainPro.loadingStep == 4) {
                  _waveHeightController.animateTo(1);
                }
                return _buildAnimation(_waveHeightController.value);
              },
            ),
    );
  }
}

class WavePainter extends CustomPainter {
  WavePainter({
    required Animation<double> controller,
    required this.waves,
    required this.waveAmplitude,
    required this.textKey,
    required this.waveColor,
    required this.loadingStep,
  }) : _controller = controller {
    _position = Tween(begin: 0.toDouble(), end: 1.toDouble())
        .chain(CurveTween(curve: Curves.linear))
        .animate(_controller);
  }
  //static const _pi2 = 2 * pi;
  final GlobalKey textKey;
  late final Animation<double> _position;
  final Animation<double> _controller;
  final Gradient waveColor;
  final double loadingStep;

  /// Number of waves to paint.
  final int waves;

  /// How high the wave should be.
  final double waveAmplitude;
  int get _waveSegments => 2 * waves - 1;

  double waveHeight(double height) {
    ///final newheight = height - ((height / 4) * loadingStep);
    return loadingStep;
  }

  void _drawWave(Path path, int wave, Size size) {
    final waveWidth = size.width / _waveSegments;
    final waveMinHeight = waveHeight(size.height);

    final x1 = wave * waveWidth + waveWidth / 2;
    // Minimum and maximum height points of the waves.
    final y1 = waveMinHeight + (wave.isOdd ? waveAmplitude : -waveAmplitude);

    final x2 = x1 + waveWidth / 2;
    final y2 = waveMinHeight;

    path.quadraticBezierTo(x1, y1, x2, y2);
    if (wave <= _waveSegments) {
      _drawWave(path, wave + 1, size);
    }
  }

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..shader =
          waveColor.createShader(Rect.fromLTWH(0, 0, size.width, size.height))
      ..style = PaintingStyle.fill;

    // Draw the waves
    final path = Path()..moveTo(0, waveHeight(size.height));
    _drawWave(path, 0, size);

    // Draw lines to the bottom corners of the size/screen with account for one extra wave.
    final waveWidth = (size.width / _waveSegments) * 2;
    path
      ..lineTo(size.width + waveWidth, size.height)
      ..lineTo(0, size.height)
      ..lineTo(0, waveHeight(size.height))
      ..close();

    // Animate sideways one wave length, so it repeats cleanly.
    final shiftedPath = path.shift(Offset(-_position.value * waveWidth, 0));
    canvas.drawPath(shiftedPath, paint);
  }

  @override
  bool shouldRepaint(CustomPainter oldDelegate) => true;
}
