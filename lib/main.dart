import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:portfolio/src/app.dart';

void main() {
  runApp(const ProviderScope(child: Portfolio()));
}
