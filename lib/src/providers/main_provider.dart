import 'package:flutter/material.dart';
import 'package:portfolio/src/models/experience_model.dart';
import 'package:portfolio/src/models/project_model.dart';
import 'package:portfolio/src/models/techstack_model.dart';
import 'package:portfolio/src/repositories/experience_repository.dart';
import 'package:portfolio/src/repositories/project_repository.dart';
import 'package:portfolio/src/repositories/techstack_repository.dart';

/// This is the provider that will be used to control the state of the main page
class MainProvider extends ChangeNotifier {
  int _loadingStep = 0;

  /// Current loading step
  /// 0: Not started
  /// 1: Loading 10%
  /// 2: Loading projects
  /// 3: Loading experiences
  /// 4: Loading tech stack & done
  int get loadingStep => _loadingStep;
  set loadingStep(int value) {
    _loadingStep = value;
    notifyListeners();
  }

  List<ProjectModel> projects = [];
  List<ExperienceModel> experiences = [];
  List<TechStackModel> techStack = [];

  int _mainPageIndex = 0;

  /// PageController for the main page
  late PageController mainPageController =
      PageController(initialPage: _mainPageIndex);

  /// Current index of the main page
  int get mainPageIndex => _mainPageIndex;
  set mainPageIndex(int value) {
    _mainPageIndex = value;
    notifyListeners();
  }

  int _projectsPageIndex = 0;

  /// PageController for the projects page
  late PageController projectsPageController =
      PageController(initialPage: _projectsPageIndex);

  /// Current index of the projects page
  int get projectsPageIndex => _projectsPageIndex;
  set projectsPageIndex(int value) {
    _projectsPageIndex = value;
    notifyListeners();
  }

  int _workExperiencePageIndex = 0;

  /// PageController for the work experience page
  late PageController workExperiencePageController =
      PageController(initialPage: _workExperiencePageIndex);

  /// Current index of the work experience page
  int get workExperiencePageIndex => _workExperiencePageIndex;
  set workExperiencePageIndex(int value) {
    _workExperiencePageIndex = value;
    notifyListeners();
  }

  int _homePageIndex = 0;

  /// PageController for the home page
  late PageController homePageController =
      PageController(initialPage: _homePageIndex);

  /// Current index of the home page
  int get homePageIndex => _homePageIndex;
  set homePageIndex(int value) {
    _homePageIndex = value;
    notifyListeners();
  }

  /// Current header text
  String getCurrentHeaderText() {
    switch (_mainPageIndex) {
      case 1:
        return 'Work Experience';
      case 0:
        return 'Home';
      case 2:
        return 'Projects';
      default:
        return 'Home';
    }
  }

  Future<void> init() async {
    await Future<dynamic>.delayed(const Duration(seconds: 1));
    loadingStep = 1;
    await Future<dynamic>.delayed(const Duration(seconds: 1));
    techStack = await TechStackRepository().getTechStack();
    loadingStep = 2;
    await Future<dynamic>.delayed(const Duration(seconds: 1));
    projects = await ProjectRepository().getProjects();
    loadingStep = 3;
    experiences = await ExperienceRepository().getExperiences();
    loadingStep = 4;
    await Future<dynamic>.delayed(const Duration(milliseconds: 500));
    loadingStep = 5;
  }
}
