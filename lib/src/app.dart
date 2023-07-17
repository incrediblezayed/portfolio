import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/providers/providers.dart';
import 'package:portfolio/src/ui/dashboard.dart';
import 'package:portfolio/src/utils/snackbar_utils.dart';

class Portfolio extends ConsumerWidget {
  const Portfolio({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      themeMode: ref.watch(themeModeProvider),
      theme: ref.read(themeProvider).lightTheme,
      darkTheme: ref.read(themeProvider).darkTheme,
      debugShowCheckedModeBanner: false,
      scaffoldMessengerKey: SnackbarUtils.snackbarKey,
      home: const Home(),
    );
  }
}
