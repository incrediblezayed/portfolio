import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/ui/hero_page.dart';
import 'package:portfolio/src/widgets/footer.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});
  static const String routeName = 'HomePage';

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final mainPro = ref.watch(mainProvider);

    return PageView(
      controller: mainPro.homePageController,
      scrollDirection: Axis.vertical,
      children: const [
        HeroPage(),
        Footer(),
      ],
    );
  }
}
