import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/repositories/api_repository.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/utils/images.dart';
import 'package:portfolio/src/utils/snackbar_utils.dart';
import 'package:portfolio/src/widgets/api_cors_test_page.dart';
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
              SizedBox(
                width: buttonFullWidth,
                child: const HeroPageText(),
              ),
              const SizedBox(
                height: 20,
              ),
              SizedBox(
                width: buttonFullWidth,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    CustomElevatedButton.icon(
                      style: ButtonStyle(
                        shape: WidgetStateProperty.all(
                          const RoundedRectangleBorder(
                            borderRadius: BorderRadius.vertical(
                              top: Radius.circular(4),
                            ),
                          ),
                        ),
                        fixedSize: appTheme.getWidgetStateProperty(
                          defaultValue: Size(buttonFullWidth, 48),
                        ),
                      ),
                      onPressed: () async {
                        SnackbarUtils.showLoadinSnackbar(
                          message: 'Downloading...',
                        );
                        final response = await ApiRepository().saveResume();
                        if (response) {
                          SnackbarUtils.showSuccessSnackbar(
                            message: 'Resume Downloaded',
                          );
                        } else {
                          SnackbarUtils.showErrorSnackbar(
                            message: 'Error Downloading Resume',
                          );
                        }
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
                            shape: WidgetStateProperty.all(
                              const RoundedRectangleBorder(),
                            ),
                            fixedSize: appTheme.getWidgetStateProperty(
                              defaultValue: const Size.fromHeight(48),
                            ),
                          ),
                        ),
                      ),
                      child: Row(
                        children: [
                          Expanded(
                            child: CustomElevatedButton.icon(
                              iconOnRight: true,
                              icon: const Icon(Icons.arrow_forward),
                              onPressed: () {
                                mainPro.mainPageController.nextPage(
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
                              icon: const Icon(Icons.arrow_forward),
                              onPressed: () {
                                mainPro.mainPageController.animateToPage(
                                  2,
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
                        shape: WidgetStateProperty.all(
                          const RoundedRectangleBorder(
                            borderRadius: BorderRadius.vertical(
                              bottom: Radius.circular(4),
                            ),
                          ),
                        ),
                        fixedSize: appTheme.getWidgetStateProperty(
                          defaultValue: Size(buttonFullWidth, 48),
                        ),
                      ),
                      onPressed: () {
                        mainPro.homePageController.animateTo(
                          mainPro.homePageController.position.maxScrollExtent,
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
              const SizedBox(
                height: 20,
              ),
              TextButton(
                onPressed: () async {
                  HapticFeedback.lightImpact();
                  final apiRepository = ApiRepository();
                  /*    if (kIsWeb) {
                    final response = await apiRepository.get(
                      'https://hapi-cors-test-production.up.railway.app/',
                    );
                    final htmlData = response as String;
                    debugPrint(htmlData);
                    if (context.mounted) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => HtmlView(html: htmlData),
                        ),
                      );
                    }
                  } else { */
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const ApiCorsTestPage(),
                    ),
                  );
                },
                child: const Text('Hello, I\'m Zayed, Test HAPI Cors ->'),
              ),
              const SizedBox(
                height: 20,
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
