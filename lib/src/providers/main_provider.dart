import 'package:flutter/material.dart';

/// This is the provider that will be used to control the state of the main page
class MainProvider extends ChangeNotifier {
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
}
