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

  Color darkPrimaryColor = const Color(0xff130E32);
  Color lightPrimaryColor = const Color(0xffECE9F5);

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

  IconData getThemeIconHovered() {
    final currentThemeMode = ref.read(themeModeProvider.notifier).state;
    switch (currentThemeMode) {
      case ThemeMode.system:
        return Icons.brightness_auto_outlined;
      case ThemeMode.light:
        return Icons.abc;
      case ThemeMode.dark:
        return Icons.abc;
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

  TextTheme _getTextTheme(bool dark) {
    return GoogleFonts.openSansTextTheme(_baseTheme(dark).textTheme);
  }

  ThemeData _baseTheme(bool dark) => (dark
          ? ThemeData.dark().copyWith(
              scaffoldBackgroundColor: darkPrimaryColor,
              primaryColor: darkPrimaryColor,
              colorScheme: ColorScheme.fromSeed(
                seedColor: darkPrimaryColor,
                secondary: lightPrimaryColor,
                brightness: Brightness.dark,
              ),
            )
          : ThemeData.light().copyWith(
              scaffoldBackgroundColor: lightPrimaryColor,
              primaryColor: lightPrimaryColor,
              colorScheme: ColorScheme.fromSeed(
                secondary: darkPrimaryColor,
                seedColor: lightPrimaryColor,
              ),
            ))
      .copyWith(useMaterial3: true);

  ThemeData _getTheme(bool dark) => _baseTheme(dark).copyWith(
        textTheme: _getTextTheme(dark),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ButtonStyle(
            animationDuration: const Duration(milliseconds: 200),
            backgroundColor: getMaterialStateProperty(
              defaultValue: _baseTheme(dark).colorScheme.primary,
              hovered: _baseTheme(dark).primaryColor,
            ),
            foregroundColor: getMaterialStateProperty(
              defaultValue: _baseTheme(dark).colorScheme.onPrimary,
              hovered: _baseTheme(dark).colorScheme.primary,
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          labelStyle: TextStyle(
            color: dark ? darkPrimaryColor : lightPrimaryColor,
          ),
          fillColor: ColorScheme.fromSeed(
            seedColor: dark ? darkPrimaryColor : lightPrimaryColor,
          ).primary.withOpacity(0.5),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(8),
            borderSide: BorderSide.none,
          ),
          floatingLabelStyle: TextStyle(
            fontSize: 18,
            color: dark ? lightPrimaryColor : darkPrimaryColor,
          ),
        ),
      );

  ThemeData get lightTheme => _getTheme(false);
  ThemeData get darkTheme => _getTheme(true);

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
