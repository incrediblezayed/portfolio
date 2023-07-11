import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/ui/home_page.dart';
import 'package:portfolio/src/ui/projects_page.dart';
import 'package:portfolio/src/utils/providers.dart';
import 'package:portfolio/src/widgets/header.dart';

class Home extends ConsumerStatefulWidget {
  const Home({super.key});

  @override
  ConsumerState<Home> createState() => _HomeState();
}

class _HomeState extends ConsumerState<Home> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final mainPro = ref.watch(mainProvider);

    final projectsPro = ref.watch(projectsProvider);
    return Scaffold(
      backgroundColor: theme.primaryColor,
      body: projectsPro.when(
        data: (data) {
          return Padding(
            padding: EdgeInsets.only(
              top: MediaQuery.of(context).padding.top,
            ),
            child: Stack(
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: kToolbarHeight * 0.9),
                  child: PageView(
                    onPageChanged: (i) {
                      mainPro.mainPageIndex = i;
                    },
                    controller: mainPro.mainPageController,
                    children: [
                      Container(),
                      const HomePage(),
                      ProjectsPage(
                        projects: data,
                      ),
                    ],
                  ),
                ),
                const HeaderWidget(),
              ],
            ),
          );
        },
        error: (error, stackTrace) {
          return Center(
            child: Text(
              error.toString(),
              style: theme.textTheme.displayLarge,
            ),
          );
        },
        loading: () {
          return const CircularProgressIndicator();
        },
      ),
    );
  }
}
