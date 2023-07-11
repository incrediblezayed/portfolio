import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/utils/providers.dart';
import 'package:portfolio/src/widgets/header_buttons.dart';

class HeaderWidget extends ConsumerWidget {
  const HeaderWidget({super.key});
  static const String routeName = 'HeaderWidget';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final homePro = ref.watch(mainProvider);
    return AnimatedBuilder(
      animation: homePro.mainPageController,
      builder: (context, child) {
        return Container(
          height: kToolbarHeight,
          decoration: BoxDecoration(
            color: ref.read(themeProvider).primaryColor,
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              HeaderButtons(
                active: homePro.mainPageIndex == 0,
                onPressed: () {
                  homePro.mainPageController.animateToPage(
                    0,
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.ease,
                  );
                },
                text: 'Work Experience',
              ),
              HeaderButtons(
                active: homePro.mainPageIndex == 1,
                onPressed: () {
                  if (homePro.mainPageIndex == 1) {
                    homePro.homePageController.animateToPage(
                      0,
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.ease,
                    );
                  } else {
                    homePro.mainPageController.animateToPage(
                      1,
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.ease,
                    );
                  }
                },
                text: 'HOME',
              ),
              HeaderButtons(
                active: homePro.mainPageIndex == 2,
                onPressed: () {
                  if (homePro.mainPageIndex == 2) {
                    homePro.projectsPageController.animateToPage(
                      0,
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.ease,
                    );
                  } else {
                    homePro.mainPageController.animateToPage(
                      2,
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.ease,
                    );
                  }
                },
                text: 'Projects',
              ),
            ],
          ),
        );
      },
    );
  }
}
