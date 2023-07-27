import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/models/project_model.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/utils/device_utils.dart';
import 'package:portfolio/src/utils/images.dart';
import 'package:url_launcher/url_launcher_string.dart';

/// ProjectWidget for displaying projects
class ProjectWidget extends ConsumerStatefulWidget {
  /// ProjectWidget for displaying projects
  const ProjectWidget({
    required this.projects,
    super.key,
  });

  /// List of projects
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

    final isLandscape = mediaQueryData.orientation == Orientation.landscape;
    return IgnorePointer(
      child: SizedBox(
        //width: width * 0.7,
        width: isLandscape ? null : size.width * 0.3,
        height: isLandscape ? size.height * 0.5 : null,
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
            child: CachedNetworkImage(
              imageUrl: project.image,
              fit: BoxFit.cover,
            ),
          ),
        ),
      ),
    );
  }

  Widget linkButton({
    required String asset,
    required String url,
    void Function()? onPressed,
  }) {
    final mediaQueryData = MediaQuery.of(context);

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

  Widget linkButtons({required ProjectModel project}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Wrap(
        children: [
          linkButton(
            asset: AppImages.appStore,
            url: project.appStoreUrl,
          ),
          linkButton(
            asset: AppImages.playStore,
            url: project.googlePlayUrl,
          ),
          linkButton(
            asset: AppImages.github,
            url: project.githubUrl,
          ),
          linkButton(
            asset: AppImages.webUrl,
            url: project.url,
          )
        ],
      ),
    );
  }

  Widget buildProjectDetailsLandscape({required ProjectModel project}) {
    final mediaQueryData = MediaQuery.of(context);
    final size = mediaQueryData.size;

    return SizedBox(
      width: size.width / 2,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          IgnorePointer(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                projectTitle(size, project),
                const SizedBox(
                  height: 8,
                ),
                projectDescription(project, size)
              ],
            ),
          ),
          linkButtons(project: project)
        ],
      ),
    );
  }

  Widget projectTitle(Size size, ProjectModel project) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 150),
      reverseDuration: Duration.zero,
      child: SizedBox(
        width: size.width / 2,
        child: Text(
          project.name,
          key: ValueKey(project.name),
          style: TextStyle(
            height: 1,
            fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
              mediaQuerySize: size.width,
              minSize: 60,
              multiplier: 0.08,
            ),
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }

  Widget projectDescription(ProjectModel project, Size size) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 150),
      reverseDuration: Duration.zero,
      child: Text(
        project.description,
        key: ValueKey(project.description),
        style: TextStyle(
          fontSize: DeviceUtils.minMaxSizeWithMediaQuery(
            mediaQuerySize: size.width,
            minSize: 16,
            multiplier: 0.015,
          ),
          fontWeight: FontWeight.w300,
        ),
        textAlign: TextAlign.start,
      ),
    );
  }

  Widget projectWrap({
    required ProjectModel project,
  }) {
    final mediaQueryData = MediaQuery.of(context);
    final size = mediaQueryData.size;
    final width = DeviceUtils.mediaQueryWidth(mediaQueryData);
    final orientation = mediaQueryData.orientation;
    final isLandscape = orientation == Orientation.landscape;
    if (isLandscape) {
      return Stack(
        children: [
          Align(
            alignment: imageAlignment,
            child: buildProjectImage(project: project),
          ),
          Align(
            alignment: detailsAlignment,
            child: buildProjectDetailsLandscape(project: project),
          ),
        ],
      );
    } else {
      return Padding(
        padding: const EdgeInsets.only(top: kToolbarHeight / 1.5),
        child: Wrap(
          spacing: 16,
          runSpacing: 16,
          children: [
            buildProjectImage(project: project),
            projectTitle(size, project),
            SizedBox(
              width: width,
              child: Align(
                alignment: Alignment.centerLeft,
                child: projectDescription(project, size),
              ),
            ),
            linkButtons(project: project),
          ],
        ),
      );
    }
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
            return projectWrap(
              project: project,
            );
          },
        ),
      ),
    );
  }
}
