import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:portfolio/src/providers/providers.dart';

class AppTheme {
  AppTheme(this.ref);
  Ref ref;

  void setThemeMode(ThemeMode themeMode) {
    ref.read(themeModeProvider.notifier).state = themeMode;
  }

  ThemeMode get themeMode => ref.read(themeModeProvider.notifier).state;

  Color discordColor = const Color(0xff7289DA);
  Color instagramColor = const Color(0xFFD62977);
  Color twitterColor = const Color(0xff1DA1F2);
  Color whatsappColor = const Color(0xff25D366);
  Color githubColor = const Color(0xFFFFFFFF);
  Color linkedinColor = const Color(0xff0A66C2);

  Color darkPrimaryColor = const Color(0xff130E32);
  Color lightPrimaryColor = const Color(0xffECE9F5);

  void cycleThroughThemeModes() {
    switch (themeMode) {
      case ThemeMode.system:
        setThemeMode(ThemeMode.light);
      case ThemeMode.light:
        setThemeMode(ThemeMode.dark);
      case ThemeMode.dark:
        setThemeMode(ThemeMode.system);
    }
  }

  IconData getThemeIcon() {
    switch (themeMode) {
      case ThemeMode.system:
        return Icons.brightness_auto;
      case ThemeMode.light:
        return FontAwesomeIcons.moon;
      case ThemeMode.dark:
        return FontAwesomeIcons.sun;
    }
  }

  String getIconEmoji() {
    switch (themeMode) {
      case ThemeMode.system:
        return '🌓';
      case ThemeMode.light:
        return '🌜';
      case ThemeMode.dark:
        return '🌞';
    }
  }

  Color getAlternatePrimaryColor() {
    switch (themeMode) {
      case ThemeMode.system:
        return lightPrimaryColor;
      case ThemeMode.light:
        return darkPrimaryColor;
      case ThemeMode.dark:
        return lightPrimaryColor;
    }
  }

  IconData getThemeIconHovered() {
    switch (themeMode) {
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

  ThemeData _baseTheme(bool dark) =>
      ThemeData(fontFamily: 'MPLUSRounded1c').copyWith(
        scaffoldBackgroundColor: dark ? darkPrimaryColor : lightPrimaryColor,
        primaryColor: dark ? darkPrimaryColor : lightPrimaryColor,
        primaryColorDark: darkPrimaryColor,
        primaryColorLight: lightPrimaryColor,
        colorScheme: ColorScheme.fromSeed(
          seedColor: dark ? darkPrimaryColor : lightPrimaryColor,
          secondary: dark ? lightPrimaryColor : darkPrimaryColor,
          brightness: dark ? Brightness.dark : Brightness.light,
        ),
        useMaterial3: true,
      );
/*   (dark
          ? ThemeData,.dark().copyWith(
              
              primaryColor: darkPrimaryColor,
              primaryColorDark: darkPrimaryColor,
              primaryColorLight: lightPrimaryColor,
              colorScheme: ColorScheme.fromSeed(
                seedColor: darkPrimaryColor,
                secondary: lightPrimaryColor,
                brightness: Brightness.dark,
              ),
            ),
          : ThemeData.light().copyWith(
              scaffoldBackgroundColor: lightPrimaryColor,
              primaryColor: lightPrimaryColor,
              primaryColorDark: darkPrimaryColor,
              primaryColorLight: lightPrimaryColor,
              colorScheme: ColorScheme.fromSeed(
                secondary: darkPrimaryColor,
                seedColor: lightPrimaryColor,
              ),
            ),)
      .copyWith(useMaterial3 = true); */

  ThemeData _getTheme(bool dark) => _baseTheme(dark).copyWith(
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ButtonStyle(
            textStyle: MaterialStateProperty.all(
              const TextTheme().labelLarge?.copyWith(
                    fontSize: 18,
                  ),
            ),
            animationDuration: const Duration(milliseconds: 200),
            backgroundColor: getMaterialStateProperty(
              defaultValue: _baseTheme(dark).colorScheme.primary,
              hovered: _baseTheme(dark).primaryColor,
              pressed: _baseTheme(dark).primaryColor,
            ),
            foregroundColor: getMaterialStateProperty(
              defaultValue: _baseTheme(dark).colorScheme.onPrimary,
              hovered: _baseTheme(dark).colorScheme.primary,
              pressed: _baseTheme(dark).colorScheme.primary,
            ),
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          hintStyle: TextStyle(
            color: dark ? lightPrimaryColor : darkPrimaryColor,
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
