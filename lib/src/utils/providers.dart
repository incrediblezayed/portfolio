import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/utils/theme.dart';

final themeProvider = Provider((ref) => AppTheme(ref));

final themeModeProvider = StateProvider((ref) => ThemeMode.system);
