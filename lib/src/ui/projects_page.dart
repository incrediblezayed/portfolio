import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/models/project_model.dart';
import 'package:portfolio/src/ui/project_widget.dart';
import 'package:portfolio/src/providers/providers.dart';

class ProjectsPage extends ConsumerWidget {
  const ProjectsPage({required this.projects, super.key});
  final List<ProjectModel> projects;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mediaQueryData = MediaQuery.of(context);
    final mainPro = ref.watch(mainProvider);
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
              length: projects.length,
            ),
          ],
        ),
      ),
    );
  }
}
