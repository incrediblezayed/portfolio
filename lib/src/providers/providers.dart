import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/providers/main_provider.dart';
import 'package:portfolio/src/repositories/experience_repository.dart';
import 'package:portfolio/src/repositories/project_repository.dart';
import 'package:portfolio/src/repositories/techstack_repository.dart';
import 'package:portfolio/src/utils/theme.dart';

/// Provider for the theme
final themeProvider = Provider(AppTheme.new);

/// Provider for the theme mode
final themeModeProvider = StateProvider((ref) => ThemeMode.system);

/// Provider for the main provider
final mainProvider = ChangeNotifierProvider(
  (ref) => MainProvider()..init(),
);

/// Provider for the projects
final projectsProvider =
    FutureProvider((ref) => ProjectRepository().getProjects());

/// Provider for the experiences
final experiencesProvider =
    FutureProvider((ref) => ExperienceRepository().getExperiences());

/// Provider for the tech stack
final techStackProvider =
    FutureProvider((ref) => TechStackRepository().getTechStack());
