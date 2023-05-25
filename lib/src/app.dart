import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/ui/splash.dart';
import 'package:portfolio/src/utils/providers.dart';

class Portfolio extends ConsumerWidget {
  const Portfolio({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
        themeMode: ref.watch(themeModeProvider),
        theme: ref.read(themeProvider).lightTheme,
        darkTheme: ref.read(themeProvider).darkTheme,
        home: const SplashScreen());
  }
}
