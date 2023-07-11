import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/utils/images.dart';
import 'package:portfolio/src/utils/providers.dart';
import 'package:portfolio/src/widgets/hero_page_text.dart';

class HeroPage extends ConsumerWidget {
  const HeroPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appTheme = ref.watch(themeProvider);
    final theme = Theme.of(context);
    final mediaQueryData = MediaQuery.of(context);
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    final height = mediaQueryData.orientation == Orientation.landscape
        ? (mediaQueryData.size.height * 0.8)
        : ((mediaQueryData.size.height / 2) * 0.8);
    return Container(
      height: mediaQueryData.size.height,
      width: mediaQueryData.size.width,
      decoration: BoxDecoration(color: appTheme.primaryColor),
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
              ElevatedButton.icon(
                style: ButtonStyle(
                  shape: MaterialStateProperty.all(
                    RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                  fixedSize: appTheme.getMaterialStateProperty(
                    defaultValue: Size(width * 0.6, 48),
                  ),
                  backgroundColor: appTheme.getMaterialStateProperty(
                    defaultValue: theme.colorScheme.primary,
                  ),
                  foregroundColor: MaterialStateProperty.all(
                    appTheme.primaryColor,
                  ),
                ),
                onPressed: () {
                  log('Clicked');
                },
                icon: const Icon(FontAwesomeIcons.fileLines),
                label: const Text('Download My Resume'),
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
