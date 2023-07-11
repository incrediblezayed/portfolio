import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/models/project_model.dart';
import 'package:portfolio/src/ui/project_widget.dart';
import 'package:portfolio/src/utils/providers.dart';

class ProjectsPage extends ConsumerWidget {
  const ProjectsPage({required this.projects, super.key});
  final List<ProjectModel> projects;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mediaQueryData = MediaQuery.of(context);
    final main = ref.watch(mainProvider);
    return SizedBox(
      height: mediaQueryData.size.height,
      width: mediaQueryData.size.width,
      //  color: Theme.of(context).scaffoldBackgroundColor,
      child: Stack(
        alignment: Alignment.topCenter,
        children: [
          PageView.builder(
            controller: main.projectsPageController,
            onPageChanged: (i) {
              main.projectsPageIndex = i;
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
    );
  }
}
