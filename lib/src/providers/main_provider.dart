import 'package:flutter/material.dart';

class MainProvider extends ChangeNotifier {
  int _mainPageIndex = 1;
  late PageController mainPageController =
      PageController(initialPage: _mainPageIndex);
  int get mainPageIndex => _mainPageIndex;
  set mainPageIndex(int value) {
    _mainPageIndex = value;
    notifyListeners();
  }

  int _projectsPageIndex = 0;
  late PageController projectsPageController =
      PageController(initialPage: _projectsPageIndex);
  int get projectsPageIndex => _projectsPageIndex;
  set projectsPageIndex(int value) {
    _projectsPageIndex = value;
    notifyListeners();
  }

  int _workExperiencePageIndex = 0;
  late PageController workExperiencePageController =
      PageController(initialPage: _workExperiencePageIndex);
  int get workExperiencePageIndex => _workExperiencePageIndex;
  set workExperiencePageIndex(int value) {
    _workExperiencePageIndex = value;
    notifyListeners();
  }

  int _homePageIndex = 0;
  late PageController homePageController =
      PageController(initialPage: _homePageIndex);
  int get homePageIndex => _homePageIndex;
  set homePageIndex(int value) {
    _homePageIndex = value;
    notifyListeners();
  }

  String getCurrentHeaderText() {
    switch (_mainPageIndex) {
      case 0:
        return 'Work Experience';
      case 1:
        return 'HOME';
      case 2:
        return 'Projects';
      default:
        return 'HOME';
    }
  }

}
