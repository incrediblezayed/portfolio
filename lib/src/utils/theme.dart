import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:portfolio/src/utils/providers.dart';

class AppTheme {
  AppTheme(this.ref);
  Ref ref;

  void setThemeMode(ThemeMode themeMode) {
    ref.read(themeModeProvider.notifier).state = themeMode;
  }

  Color discordColor = const Color(0xff7289DA);
  Color instagramColor = const Color(0xFFD62977);
  Color twitterColor = const Color(0xff1DA1F2);
  Color whatsappColor = const Color(0xff25D366);
  Color githubColor = const Color(0xFFFFFFFF);
  Color linkedinColor = const Color(0xff0A66C2);

  Color primaryColor = const Color(0xff130E32);

  void cycleThroughThemeModes() {
    final currentThemeMode = ref.read(themeModeProvider.notifier).state;

    switch (currentThemeMode) {
      case ThemeMode.system:
        setThemeMode(ThemeMode.light);
      case ThemeMode.light:
        setThemeMode(ThemeMode.dark);
      case ThemeMode.dark:
        setThemeMode(ThemeMode.system);
    }
  }

  IconData getThemeIcon() {
    final currentThemeMode = ref.read(themeModeProvider.notifier).state;
    switch (currentThemeMode) {
      case ThemeMode.system:
        return Icons.brightness_auto;
      case ThemeMode.light:
        return Icons.brightness_high;
      case ThemeMode.dark:
        return Icons.brightness_3;
    }
  }

  MaterialStateProperty<T> getMaterialStateProperty<T>({
    required T defaultValue,
    T? hovered,
    T? focused,
    T? pressed,
    T? selected,
    T? disabled,
  }) {
    return MaterialStateProperty.resolveWith((states) {
      if (states.contains(MaterialState.hovered) && hovered != null) {
        return hovered;
      }
      if (states.contains(MaterialState.focused) && focused != null) {
        return focused;
      }
      if (states.contains(MaterialState.pressed) && pressed != null) {
        return pressed;
      }
      if (states.contains(MaterialState.selected) && selected != null) {
        return selected;
      }
      if (states.contains(MaterialState.disabled) && disabled != null) {
        return disabled;
      }

      return defaultValue;
    });
  }

  ThemeData getTheme(bool dark) =>
      //dark ?
      //ThemeData.dark():
      ThemeData.light().copyWith(
        useMaterial3: true,
        primaryColor: primaryColor,
        textTheme: GoogleFonts.openSansTextTheme(
          ThemeData.dark().textTheme,
        ),
        colorScheme: ColorScheme.fromSeed(
          seedColor: primaryColor,
          brightness: dark ? Brightness.dark : Brightness.light,
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: ColorScheme.fromSeed(seedColor: primaryColor)
              .primary
              .withOpacity(0.5),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide.none,
          ),
          floatingLabelStyle: const TextStyle(
            fontSize: 18,
            color: Colors.white,
          ),
        ),
        textButtonTheme: TextButtonThemeData(
          style: ButtonStyle(
            foregroundColor: getMaterialStateProperty<Color>(
              defaultValue: Colors.white,
              hovered: Colors.white,
              focused: Colors.white,
              pressed: Colors.white,
              selected: Colors.white,
              disabled: Colors.white,
            ),
          ),
        ),
      );

  ThemeData get lightTheme => getTheme(false);
  ThemeData get darkTheme => getTheme(true);

  ThemeData get theme {
    final currentThemeMode = ref.read(themeModeProvider.notifier).state;
    switch (currentThemeMode) {
      case ThemeMode.system:
        return lightTheme;
      case ThemeMode.light:
        return lightTheme;
      case ThemeMode.dark:
        return darkTheme;
    }
  }
}
