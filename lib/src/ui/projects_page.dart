import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/ui/project_widget.dart';

/// ProjectsPage for displaying projects
class ProjectsPage extends ConsumerWidget {
  /// ProjectsPage for displaying projects
  const ProjectsPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mediaQueryData = MediaQuery.of(context);
    final mainPro = ref.watch(mainProvider);
    final projects = ref.watch(projectsProvider);
    return projects.when(
      data: (projects) {
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
                child: mainPro.projectsPageIndex > 0
                    ? FloatingActionButton(
                        onPressed: () {
                          mainPro.projectsPageController.previousPage(
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
                child: mainPro.projectsPageIndex < projects.length - 1
                    ? FloatingActionButton(
                        onPressed: () {
                          mainPro.projectsPageController.nextPage(
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
          body: SizedBox(
            height: mediaQueryData.size.height,
            width: mediaQueryData.size.width,
            child: Stack(
              alignment: Alignment.topCenter,
              children: [
                PageView.builder(
                  controller: mainPro.projectsPageController,
                  onPageChanged: (i) {
                    mainPro.projectsPageIndex = i;
                  },
                  scrollDirection: Axis.vertical,
                  itemCount: projects.length,
                  itemBuilder: (context, index) {
                    return const SizedBox.shrink();
                  },
                ),
                ProjectWidget(
                  projects: projects,
                ),
              ],
            ),
          ),
        );
      },
      error: (error, stackTrace) {
        return const Center(
          child: Text(
            'Something went wrong while fetching projects',
          ),
        );
      },
      loading: () {
        return const Center(
          child: CircularProgressIndicator(),
        );
      },
    );
  }
}
