import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/models/enquiry_model.dart';
import 'package:portfolio/src/providers/main_provider.dart';
import 'package:portfolio/src/repositories/enquiry_repository.dart';
import 'package:portfolio/src/repositories/experience_repository.dart';
import 'package:portfolio/src/repositories/project_repository.dart';
import 'package:portfolio/src/utils/theme.dart';

final themeProvider = Provider(AppTheme.new);

final themeModeProvider = StateProvider((ref) => ThemeMode.dark);

final mainProvider = ChangeNotifierProvider((ref) => MainProvider());

final projectsProvider =
    FutureProvider((ref) => ProjectRepository().getProjects());

final experiencesProvider =
    FutureProvider((ref) => ExperienceRepository().getExperiences());

/* final addEnquiryProvider =
    FutureProvider.autoDispose.family<bool, EnquiryModel>(
  (ref, arg) {
    return EnquiryRepository().addEnquiry(arg);
  },
); */
