import 'package:flutter/material.dart';

/// Constants class
class Constants {
  static BuildContext? gloablContext;

  /// Live url for api
  static const String liveUrl = 'https://api.hassanansari.dev/api';

  /// Local url for api
  static const String localUrl = 'http://localhost:3000/api';

  /// Base Url for api
  static const String url = liveUrl;

  ///Url for projects api
  static const String projectsUrl = '/projects/';

  ///Url for work experience api
  static const String workExperienceUrl = '/work-experience/';

  ///Url for enquiry api
  static const String enquiryUrl = '/contact/';

  ///Url for tech stack api
  static const String techStackUrl = '/techStacks/';
}
