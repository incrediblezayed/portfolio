import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/ui/experience_widget.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/providers/providers.dart';

class WorkExperiences extends ConsumerWidget {
  const WorkExperiences({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mediaQueryData = MediaQuery.of(context);
    final mainPro = ref.watch(mainProvider);
    final experiences = ref.watch(experiencesProvider);
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    final isLandsape = mediaQueryData.orientation == Orientation.landscape;
    return SizedBox(
      height: mediaQueryData.size.height,
      width: mediaQueryData.size.width,
      child: experiences.when(
        data: (data) {
          return Scaffold(
            floatingActionButton: Column(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 100),
                  transitionBuilder: (child, animation) {
                    return ScaleTransition(
                      scale: animation,
                      child: child,
                    );
                  },
                  child: mainPro.workExperiencePageIndex > 0
                      ? FloatingActionButton(
                          onPressed: () {
                            mainPro.workExperiencePageController.previousPage(
                              duration: const Duration(milliseconds: 300),
                              curve: Curves.easeIn,
                            );
                          },
                          child: const Icon(Icons.arrow_upward),
                        )
                      : const SizedBox.shrink(),
                ),
                const SizedBox(
                  height: 4,
                ),
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 200),
                  transitionBuilder: (child, animation) {
                    return ScaleTransition(
                      scale: animation,
                      child: child,
                    );
                  },
                  child: mainPro.workExperiencePageIndex < data.length - 1
                      ? FloatingActionButton(
                          onPressed: () {
                            mainPro.workExperiencePageController.nextPage(
                              duration: const Duration(milliseconds: 300),
                              curve: Curves.easeIn,
                            );
                          },
                          child: const Icon(Icons.arrow_downward),
                        )
                      : const SizedBox.shrink(),
                )
              ],
            ),
            body: Wrap(
              alignment: WrapAlignment.center,
              crossAxisAlignment: WrapCrossAlignment.center,
              runAlignment: WrapAlignment.center,
              children: [
                SizedBox(
                  width: isLandsape ? width * 0.6 : null,
                  child: ExperienceTitleWidget(experiences: data),
                ),
                SizedBox(
                  width: width * 1.4,
                  height: mediaQueryData.size.height * 0.8,
                  child: PageView.builder(
                    scrollDirection: Axis.vertical,
                    controller: mainPro.workExperiencePageController,
                    itemCount: data.length,
                    onPageChanged: (value) {
                      mainPro.workExperiencePageIndex = value;
                    },
                    itemBuilder: (context, index) {
                      return ExperenceDetailWidget(data[index]);
                    },
                  ),
                ),
              ],
            ),
          );
        },
        error: (error, stackTrace) {
          return const Center(
            child: Text('Error'),
          );
        },
        loading: () {
          return const Center(
            child: CircularProgressIndicator(),
          );
        },
      ),
    );
  }
}
