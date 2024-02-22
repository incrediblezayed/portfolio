import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/repositories/api_repository.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/utils/snackbar_utils.dart';
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
    return AnimatedContainer(
      duration: const Duration(
        milliseconds: 100,
      ),
      height: mediaQueryData.size.height,
      width: mediaQueryData.size.width,
      alignment: mediaQueryData.orientation == Orientation.portrait
          ? Alignment.topCenter
          : Alignment.center,
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
                          ),
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
            ],
          ),
          const SizedBox(
            width: 20,
          ),
          Padding(
            padding: const EdgeInsets.only(top: 24, left: 24),
            child: SizedBox(
              width: width,
              child: Wrap(
                key: UniqueKey(),
                spacing: 12,
                runSpacing: 12,
                children: [
                  Text(
                    'My Tech Arsenal:',
                    style: theme.textTheme.displaySmall,
                  ),
                  ...mainPro.techStack.map(
                    (e) => ActionChip(
                      onPressed: () {},
                      pressElevation: 3,
                      avatar: CachedNetworkImage(imageUrl: e.image),
                      label: Text(e.name),
                      color: MaterialStateProperty.all(
                        theme.primaryColor,
                      ),
                      labelStyle: theme.textTheme.titleMedium?.copyWith(
                        color: appTheme.getAlternatePrimaryColor(),
                        fontWeight: FontWeight.w200,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
