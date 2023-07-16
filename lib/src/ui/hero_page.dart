import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/utils/images.dart';
import 'package:portfolio/src/widgets/custom_elevated_button.dart';
import 'package:portfolio/src/widgets/hero_page_text.dart';

class HeroPage extends ConsumerWidget {
  const HeroPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mainPro = ref.watch(mainProvider);

    final appTheme = ref.watch(themeProvider);
    final theme = Theme.of(context);
    final mediaQueryData = MediaQuery.of(context);
    final size = mediaQueryData.size;
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    final height = mediaQueryData.orientation == Orientation.landscape
        ? (size.height * 0.8)
        : ((size.height / 2) * 0.8);
    final buttonFullWidth = mediaQueryData.orientation == Orientation.landscape
        ? width * 0.8
        : width;
    return Container(
      height: mediaQueryData.size.height,
      width: mediaQueryData.size.width,
      alignment: Alignment.topCenter,
      padding: EdgeInsets.all(width * 0.05),
      child: Wrap(
        alignment: WrapAlignment.center,
        crossAxisAlignment: WrapCrossAlignment.center,
        runAlignment: WrapAlignment.center,
        children: [
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const HeroPageText(),
              SizedBox(
                width: buttonFullWidth,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CustomElevatedButton.icon(
                      style: ButtonStyle(
                        shape: MaterialStateProperty.all(
                          const RoundedRectangleBorder(
                            borderRadius: BorderRadius.vertical(
                              top: Radius.circular(4),
                            ),
                          ),
                        ),
                        fixedSize: appTheme.getMaterialStateProperty(
                          defaultValue: Size(buttonFullWidth, 48),
                        ),
                      ),
                      onPressed: () {
                        log('Clicked');
                      },
                      icon: const Icon(FontAwesomeIcons.fileLines),
                      label: const Text('Download My Resume'),
                    ),
                    const Divider(
                      height: 1,
                    ),
                    Theme(
                      data: theme.copyWith(
                        elevatedButtonTheme: ElevatedButtonThemeData(
                          style: theme.elevatedButtonTheme.style!.copyWith(
                            shape: MaterialStateProperty.all(
                              const RoundedRectangleBorder(),
                            ),
                            fixedSize: appTheme.getMaterialStateProperty(
                              defaultValue: const Size.fromHeight(48),
                            ),
                          ),
                        ),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: CustomElevatedButton.icon(
                              icon: const Icon(Icons.arrow_left),
                              onPressed: () {
                                mainPro.mainPageController.previousPage(
                                  duration: const Duration(milliseconds: 300),
                                  curve: Curves.ease,
                                );
                              },
                              label: const Text('My Work Experience'),
                            ),
                          ),
                          const VerticalDivider(width: 1),
                          Expanded(
                            child: CustomElevatedButton.icon(
                              iconOnRight: true,
                              icon: const Icon(Icons.arrow_right),
                              onPressed: () {
                                mainPro.mainPageController.nextPage(
                                  duration: const Duration(milliseconds: 300),
                                  curve: Curves.ease,
                                );
                              },
                              label: const Text('My Projects'),
                            ),
                          )
                        ],
                      ),
                    ),
                    const Divider(
                      height: 1,
                    ),
                    CustomElevatedButton.icon(
                      style: ButtonStyle(
                        shape: MaterialStateProperty.all(
                          const RoundedRectangleBorder(
                            borderRadius: BorderRadius.vertical(
                              bottom: Radius.circular(4),
                            ),
                          ),
                        ),
                        fixedSize: appTheme.getMaterialStateProperty(
                          defaultValue: Size(buttonFullWidth, 48),
                        ),
                      ),
                      onPressed: () {
                        mainPro.homePageController.nextPage(
                          duration: const Duration(milliseconds: 300),
                          curve: Curves.ease,
                        );
                      },
                      icon: const Icon(Icons.arrow_drop_down),
                      label: const Text('Contact Me'),
                    ),
                  ],
                ),
              ),
            ],
          ),
          Padding(
            padding: const EdgeInsets.only(top: 24),
            child: Image.asset(
              AppImages.heroImage,
              width: width * 0.9,
              height: height * 0.8,
            ),
          )
        ],
      ),
    );
  }
}
