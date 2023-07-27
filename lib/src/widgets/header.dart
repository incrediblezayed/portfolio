import 'package:collection/collection.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/providers/main_provider.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/widgets/custom_elevated_button.dart';
import 'package:portfolio/src/widgets/header_buttons.dart';

class HeaderWidget extends ConsumerStatefulWidget {
  const HeaderWidget({super.key});

  @override
  ConsumerState<HeaderWidget> createState() => _HeaderWidgetState();
}

class _HeaderWidgetState extends ConsumerState<HeaderWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;

  late Animation<double> _animation;
  bool isMenuOpen = false;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _animation = Tween<double>(begin: 0, end: 1).animate(
      _animationController,
    );
  }

  void closeMenuifOpen() {
    if (isMenuOpen) {
      _animationController.reverse();
      setState(() {
        isMenuOpen = false;
      });
    }
  }

  List<Widget> headerButtons(MainProvider mainPro) => [
        HeaderButtons(
          key: const ValueKey('0'),
          active: mainPro.mainPageIndex == 0,
          onPressed: () {
            if (mainPro.mainPageIndex == 0) {
              mainPro.homePageController.animateToPage(
                0,
                duration: const Duration(milliseconds: 300),
                curve: Curves.ease,
              );
            } else {
              mainPro.mainPageController.animateToPage(
                0,
                duration: const Duration(milliseconds: 300),
                curve: Curves.ease,
              );
            }
            closeMenuifOpen();
          },
          text: 'Home',
        ),
        HeaderButtons(
          key: const ValueKey('1'),
          active: mainPro.mainPageIndex == 1,
          onPressed: () {
            mainPro.mainPageController.animateToPage(
              1,
              duration: const Duration(milliseconds: 300),
              curve: Curves.ease,
            );
            closeMenuifOpen();
          },
          text: 'Work Experience',
        ),
        HeaderButtons(
          key: const ValueKey('2'),
          active: mainPro.mainPageIndex == 2,
          onPressed: () {
            if (mainPro.mainPageIndex == 2) {
              mainPro.projectsPageController.animateToPage(
                0,
                duration: const Duration(milliseconds: 300),
                curve: Curves.ease,
              );
            } else {
              mainPro.mainPageController.animateToPage(
                2,
                duration: const Duration(milliseconds: 300),
                curve: Curves.ease,
              );
            }
            closeMenuifOpen();
          },
          text: 'Projects',
        ),
      ];

  List<String> newString = ['vf', 'fevfe', 'fevfev', 'fevfev', 'fevfev'];
  @override
  Widget build(BuildContext context) {
    final themeMode = ref.watch(themeModeProvider);
    final mainPro = ref.watch(mainProvider);
    final theme = Theme.of(context);
    final appTheme = ref.watch(themeProvider);
    final mediaQueryData = MediaQuery.of(context);
    final orientation = mediaQueryData.orientation;
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    if (orientation == Orientation.landscape && isMenuOpen) {
      closeMenuifOpen();
    }
    return AnimatedBuilder(
      animation: mainPro.mainPageController,
      builder: (context, child) {
        return Column(
          children: [
            SizedBox(
              height: kToolbarHeight,
              child: orientation == Orientation.landscape
                  ? Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                          width: width * 0.07,
                        ),
                        name(),
                        const Spacer(),
                        Column(
                          children: [
                            Row(
                              children: headerButtons(mainPro),
                            ),
                            SizedBox(
                              width: 130 * 3,
                              child: AnimatedAlign(
                                alignment: mainPro.mainPageIndex == 0
                                    ? Alignment.centerLeft
                                    : mainPro.mainPageIndex == 1
                                        ? Alignment.center
                                        : Alignment.centerRight,
                                duration: const Duration(milliseconds: 100),
                                child: Container(
                                  width: 130,
                                  height: 1,
                                  color: theme.colorScheme.onBackground,
                                ),
                              ),
                            )
                          ],
                        ),
                        Switch(
                          value: themeMode != ThemeMode.dark,
                          thumbIcon: appTheme.getMaterialStateProperty(
                            defaultValue: Icon(appTheme.getThemeIcon()),
                          ),
                          onChanged: (value) {
                            appTheme.setThemeMode(
                              !value ? ThemeMode.dark : ThemeMode.light,
                            );
                          },
                        )
                      ],
                    )
                  : Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          name(),
                          CustomElevatedButton(
                            style: CustomElevatedButton.styleFrom(
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            onPressed: () {
                              if (!isMenuOpen) {
                                _animationController.forward();
                              } else {
                                _animationController.reverse();
                              }
                              setState(() {
                                isMenuOpen = !isMenuOpen;
                              });
                            },
                            child: AnimatedIcon(
                              icon: AnimatedIcons.menu_close,
                              progress: _animation,
                            ),
                          ),
                        ],
                      ),
                    ),
            ),
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              transitionBuilder: (child, animation) {
                return SizeTransition(sizeFactor: animation, child: child);
              },
              child: isMenuOpen
                  ? Container(
                      key: ValueKey(isMenuOpen),
                      color: theme.scaffoldBackgroundColor,
                      width: mediaQueryData.size.width,
                      padding: const EdgeInsets.symmetric(horizontal: 12),
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ...headerButtons(mainPro)
                              .sorted(
                                (a, b) =>
                                    ((a.key! as ValueKey).value! as String)
                                        .compareTo(
                                  (b.key! as ValueKey).value! as String,
                                ),
                              )
                              .map(
                                (e) => Padding(
                                  padding: const EdgeInsets.only(bottom: 4),
                                  child: e,
                                ),
                              ),
                          SwitchListTile(
                            value: themeMode != ThemeMode.dark,
                            thumbIcon: appTheme.getMaterialStateProperty(
                              defaultValue: Icon(appTheme.getThemeIcon()),
                            ),
                            title: Text(
                              'Swicth to ${themeMode == ThemeMode.dark ? 'Light' : 'Dark'}',
                            ),
                            onChanged: (value) {
                              appTheme.setThemeMode(
                                !value ? ThemeMode.dark : ThemeMode.light,
                              );
                            },
                          )
                        ],
                      ),
                    )
                  : Container(),
            ),
          ],
        );
      },
    );
  }

  Widget name() {
    final mainPro = ref.watch(mainProvider);
    final appTheme = ref.watch(themeProvider);
    final isLandscape =
        MediaQuery.of(context).orientation == Orientation.landscape;
    final mediaQuery = MediaQuery.of(context);
    final width = DeviceUtils.mediaQueryWidth(mediaQuery);

    return Padding(
      padding: const EdgeInsets.only(top: 8, left: 8),
      child: Row(
        children: [
          Text(
            'Hassan Ansari',
            style: TextStyle(
              fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                mediaQuerySize: width,
                minSize: 14,
                multiplier: 0.05,
                maxSize: 30,
              ),
              fontWeight: FontWeight.bold,
            ),
          ),
          if (!isLandscape) ...[
            const SizedBox(
              width: 4,
            ),
            CircleAvatar(
              radius: 2,
              backgroundColor: appTheme.getAlternatePrimaryColor(),
            ),
            const SizedBox(
              width: 4,
            ),
            Text(
              mainPro.getCurrentHeaderText(),
            )
          ]
        ],
      ),
    );
  }
}
