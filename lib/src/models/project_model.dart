// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:portfolio/src/models/techstack_model.dart';


@immutable
class ProjectModel   {
  ProjectModel({
    required this.name,
    required this.description,
    required this.image,
    required this.url,
    required this.googlePlayUrl,
    required this.appStoreUrl,
    required this.startDate,
    required this.endDate,
    required this.githubUrl,
    required this.createdAt,
    this.id = '',
    this.techStacks = const [],
  });

  final String id;
  final String name;
  final String description;
  final String image;
  final String url;
  final String googlePlayUrl;
  final String appStoreUrl;
  final String githubUrl;
  final DateTime createdAt;
  final DateTime startDate;
  final DateTime endDate;
  final List<TechStackModel> techStacks;

  ProjectModel copyWith({
    String? id,
    String? name,
    String? description,
    String? image,
    String? url,
    String? googlePlayUrl,
    String? appStoreUrl,
    String? githubUrl,
    DateTime? createdAt,
    DateTime? startDate,
    DateTime? endDate,
    List<TechStackModel>? techStacks,
  }) {
    return ProjectModel(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      image: image ?? this.image,
      url: url ?? this.url,
      googlePlayUrl: googlePlayUrl ?? this.googlePlayUrl,
      appStoreUrl: appStoreUrl ?? this.appStoreUrl,
      createdAt: createdAt ?? this.createdAt,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      githubUrl: githubUrl ?? this.githubUrl,
      techStacks: techStacks ?? this.techStacks,
    );
  }

  @override
  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'name': name,
      'description': description,
      'image': image,
      'url': url,
      'googlePlayUrl': googlePlayUrl,
      'appStoreUrl': appStoreUrl,
      'githubUrl': githubUrl,
      'startDate': startDate.toUtc().toIso8601String(),
      'endDate': endDate.toUtc().toIso8601String(),
      'techStacks': techStacks.map((e) => e.toMap()).toList(),
    };
  }

  @override
  factory ProjectModel.fromMap(Map<String, dynamic> map) {
    return ProjectModel(
      id: map['id'] as String? ?? '',
      name: map['name'] as String,
      description: map['description'] as String,
      image: map['image'] as String,
      url: map['url'] as String,
      googlePlayUrl: map['googlePlayUrl'] as String,
      appStoreUrl: map['appStoreUrl'] as String,
      githubUrl: map['githubUrl'] as String,
      createdAt: DateTime.parse(map['createdAt'].toString()),
      startDate: DateTime.parse(map['startDate'].toString()),
      endDate: DateTime.parse(map['endDate'].toString()),
    );
  }

  @override
  String toJson() => json.encode(toMap());

  @override
  factory ProjectModel.fromJson(String source) =>
      ProjectModel.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  bool operator ==(covariant ProjectModel other) {
    if (identical(this, other)) return true;

    return other.id == id &&
        other.name == name &&
        other.description == description &&
        other.image == image &&
        other.url == url &&
        other.googlePlayUrl == googlePlayUrl &&
        other.appStoreUrl == appStoreUrl &&
        other.githubUrl == githubUrl &&
        other.createdAt == createdAt &&
        other.startDate == startDate &&
        other.endDate == endDate;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        name.hashCode ^
        description.hashCode ^
        image.hashCode ^
        url.hashCode ^
        googlePlayUrl.hashCode ^
        appStoreUrl.hashCode ^
        githubUrl.hashCode ^
        createdAt.hashCode ^
        startDate.hashCode ^
        endDate.hashCode;
  }
}
