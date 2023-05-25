import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/utils/providers.dart';
import 'package:portfolio/src/utils/theme.dart';
import 'package:portfolio/src/widgets/footer.dart';
import 'package:portfolio/src/widgets/info_widgets/name.dart';
import 'package:portfolio/src/widgets/info_widgets/subtitle.dart';

class Home extends ConsumerStatefulWidget {
  static const String routeName = "Home";
  @override
  String toString({DiagnosticLevel minLevel = DiagnosticLevel.info}) => "Home";
  const Home({Key? key}) : super(key: key);

  @override
  ConsumerState<Home> createState() => _HomeState();
}

class _HomeState extends ConsumerState<Home> {
  @override
  Widget build(BuildContext context) {
    AppTheme appTheme = ref.watch(themeProvider);
    ThemeData theme = Theme.of(context);
    MediaQueryData mediaQueryData = MediaQuery.of(context);
    return Scaffold(
      appBar: AppBar(
        title: const NameWidget(),
        actions: [
          IconButton(
              onPressed: () {
                ref.read(themeProvider).cycleThroughThemeModes();
              },
              icon: Icon(appTheme.getThemeIcon()))
        ],
      ),
      body: const Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            SubtitleWidget(
              textAlign: TextAlign.start,
            )
          ],
        ),
      ),
      bottomNavigationBar: const Footer(),
    );
  }
}
