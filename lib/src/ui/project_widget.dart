import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/models/project_model.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/utils/images.dart';
import 'package:url_launcher/url_launcher_string.dart';

class ProjectWidget extends ConsumerStatefulWidget {
  const ProjectWidget({
    required this.projects,
    required this.length,
    super.key,
  });
  final int length;
  final List<ProjectModel> projects;

  @override
  ConsumerState<ProjectWidget> createState() => _ProjectWidgetState();
}

class _ProjectWidgetState extends ConsumerState<ProjectWidget> {
  Alignment imageAlignment = Alignment.topLeft;
  Alignment detailsAlignment = Alignment.bottomRight;

  Widget buildProjectImage({required ProjectModel project}) {
    final mediaQueryData = MediaQuery.of(context);
    final size = mediaQueryData.size;
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    return IgnorePointer(
      child: SizedBox(
        //width: width * 0.7,
        height: size.height * 0.5,
        //height: size.height * 0.4,
        child: AnimatedSwitcher(
          duration: const Duration(milliseconds: 150),
          switchInCurve: Curves.easeInCirc,
          reverseDuration: Duration.zero,
          transitionBuilder: (child, animation) {
            return ScaleTransition(
              scale: animation,
              child: child,
            );
          },
          child: ClipRRect(
            borderRadius: BorderRadius.circular(24),
            key: ValueKey(project.image),
            child: Image.network(
              project.image,
              fit: BoxFit.cover,
            ),
          ),
        ),
      ),
    );
  }

  Widget linkButtons({
    required String asset,
    required String url,
    void Function()? onPressed,
  }) {
    final mediaQueryData = MediaQuery.of(context);
    final size = mediaQueryData.size;
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 250),
      reverseDuration: Duration.zero,
      transitionBuilder: (child, animation) {
        return ScaleTransition(
          scale: animation,
          child: child,
        );
      },
      child: url.isEmpty
          ? const SizedBox.shrink()
          : Padding(
              key: ValueKey(url),
              padding: const EdgeInsets.only(right: 8, bottom: 8),
              child: GestureDetector(
                onTap: onPressed ??
                    () {
                      launchUrlString(url);
                    },
                child: Image.asset(
                  asset,
                  height: DeviceUtils.minMaxSizeWithMediaQuery(
                    mediaQuerySize: width,
                    minSize: 30,
                    multiplier: 0.08,
                    maxSize: 50,
                  ),
                ),
              ),
            ),
    );
  }

  Widget buildProjectDetails({required ProjectModel project}) {
    final mediaQueryData = MediaQuery.of(context);
    final size = mediaQueryData.size;
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    return SizedBox(
      width: width,
      height: size.height * 0.5,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          IgnorePointer(
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 150),
              reverseDuration: Duration.zero,
              child: Column(
                key: ValueKey(project),
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                mainAxisAlignment: MainAxisAlignment.end,
                children: [
                  Text(
                    project.name,
                    style: TextStyle(
                      height: 0.8,
                      fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                        mediaQuerySize: size.width,
                        minSize: 60,
                        multiplier: 0.08,
                      ),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(
                    height: 8,
                  ),
                  Text(
                    project.description,
                    style: TextStyle(
                      fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
                        mediaQuerySize: size.width,
                        minSize: 16,
                        multiplier: 0.015,
                      ),
                      fontWeight: FontWeight.w300,
                    ),
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 16),
            child: Wrap(
              children: [
                linkButtons(
                  asset: AppImages.appStore,
                  url: project.appStoreUrl,
                ),
                linkButtons(
                  asset: AppImages.playStore,
                  url: project.googlePlayUrl,
                ),
                linkButtons(
                  asset: AppImages.github,
                  url: project.githubUrl,
                ),
                linkButtons(
                  asset: AppImages.webUrl,
                  url: project.url,
                )
              ],
            ),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final mediaQueryData = MediaQuery.of(context);
    final size = mediaQueryData.size;
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    final mainPro = ref.watch(mainProvider);

    return SizedBox(
      height: size.height,
      width: size.width,
      child: Padding(
        padding: EdgeInsets.symmetric(
          horizontal: size.width * 0.05,
          vertical: mediaQueryData.viewPadding.bottom,
        ),
        child: AnimatedBuilder(
          animation: mainPro.projectsPageController,
          builder: (context, child) {
            final page = mainPro.projectsPageController.page ??
                mainPro.projectsPageIndex;

            final project = widget.projects[mainPro.projectsPageIndex];
            final flooredPage = page.floor();

            final normalizedPage =
                (page - (flooredPage + 0.000000000000000001)) / 1.0;

            final normalizedValue = (normalizedPage * 2) - 1;

            final imageAlignmentValue =
                normalizedValue * (flooredPage.isEven ? -1 : 1);

            final detailsAlignmentValue =
                normalizedValue * (flooredPage.isEven ? 1 : -1);
            if (size.width != width) {
              imageAlignment = Alignment(
                imageAlignmentValue,
                -1,
              );

              detailsAlignment = Alignment(
                detailsAlignmentValue,
                1,
              );
            }
            return Stack(
              children: [
                Align(
                  alignment: imageAlignment,
                  child: buildProjectImage(project: project),
                ),
                Align(
                  alignment: detailsAlignment,
                  child: buildProjectDetails(project: project),
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
