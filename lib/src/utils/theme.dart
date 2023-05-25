import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/utils/providers.dart';

class AppTheme {
  Ref ref;
  AppTheme(this.ref);

  void setThemeMode(ThemeMode themeMode) {
    ref.read(themeModeProvider.notifier).state = themeMode;
  }

  Color discordColor = const Color(0xff7289DA);
  Color instagramColor = const Color(0xFFD62977);
  Color twitterColor = const Color(0xff1DA1F2);
  Color whatsappColor = const Color(0xff25D366);
  Color githubColor = const Color(0xFFFFFFFF);
  Color linkedinColor = const Color(0xff0A66C2);

  void cycleThroughThemeModes() {
    ThemeMode currentThemeMode = ref.read(themeModeProvider.notifier).state;

    switch (currentThemeMode) {
      case ThemeMode.system:
        setThemeMode(ThemeMode.light);
        break;
      case ThemeMode.light:
        setThemeMode(ThemeMode.dark);
        break;
      case ThemeMode.dark:
        setThemeMode(ThemeMode.system);
        break;
    }
  }

  IconData getThemeIcon() {
    ThemeMode currentThemeMode = ref.read(themeModeProvider.notifier).state;
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

  ThemeData get lightTheme => ThemeData.light().copyWith(
        useMaterial3: true,
        appBarTheme: const AppBarTheme(centerTitle: false),
        dividerColor: Colors.black.withOpacity(0.1),
      );
  ThemeData get darkTheme => ThemeData.dark().copyWith(
        dividerColor: Colors.white.withOpacity(0.1),
        appBarTheme: const AppBarTheme(centerTitle: false),
        useMaterial3: true,
      );

  ThemeData get theme {
    ThemeMode currentThemeMode = ref.read(themeModeProvider.notifier).state;
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
