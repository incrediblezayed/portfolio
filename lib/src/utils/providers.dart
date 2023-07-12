import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/providers/main_provider.dart';
import 'package:portfolio/src/repositories/project_repository.dart';
import 'package:portfolio/src/utils/theme.dart';

final themeProvider = Provider(AppTheme.new);

final themeModeProvider = StateProvider((ref) => ThemeMode.dark);

final mainProvider = ChangeNotifierProvider((ref) => MainProvider());

final projectsProvider =
    FutureProvider((ref) => ProjectRepository().getProjects());
