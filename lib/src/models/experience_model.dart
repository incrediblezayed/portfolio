// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

import 'package:flutter/foundation.dart';

@immutable
class ExperienceModel {
  final String id;
  final String position;
  final String company;
  final String website;
  final String location;
  final List<String> achievements;
  final DateTime startDate;
  final DateTime? endDate;
  final DateTime createdAt;
  final bool isAtive;
  const ExperienceModel({
    required this.id,
    required this.position,
    required this.company,
    required this.website,
    required this.location,
    required this.achievements,
    required this.startDate,
    required this.createdAt,
    this.endDate,
    this.isAtive = false,
  });

  ExperienceModel copyWith({
    String? id,
    String? position,
    String? company,
    String? website,
    String? location,
    List<String>? achievements,
    DateTime? startDate,
    DateTime? endDate,
    DateTime? createdAt,
    bool? isAtive,
  }) {
    return ExperienceModel(
      id: id ?? this.id,
      position: position ?? this.position,
      company: company ?? this.company,
      website: website ?? this.website,
      location: location ?? this.location,
      achievements: achievements ?? this.achievements,
      startDate: startDate ?? this.startDate,
      endDate: endDate ?? this.endDate,
      createdAt: createdAt ?? this.createdAt,
      isAtive: isAtive ?? this.isAtive,
    );
  }

  factory ExperienceModel.fromMap(Map<String, dynamic> map) {
    return ExperienceModel(
      id: map['id'] as String,
      position: map['position'] as String,
      company: map['company'] as String,
      website: map['website'] as String,
      location: map['location'] as String,
      achievements: List<String>.from(map['achievements'] as List<dynamic>),
      startDate: DateTime.parse(map['startDate'].toString()),
      endDate: map['endDate'] != null
          ? DateTime.parse(map['endDate'].toString())
          : null,
      createdAt: DateTime.parse(map['createdAt'].toString()),
      isAtive: map['isAtive'] as bool? ?? false,
    );
  }

  factory ExperienceModel.fromJson(String source) =>
      ExperienceModel.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  bool operator ==(covariant ExperienceModel other) {
    if (identical(this, other)) return true;

    return other.id == id &&
        other.position == position &&
        other.company == company &&
        other.website == website &&
        other.location == location &&
        listEquals(other.achievements, achievements) &&
        other.startDate == startDate &&
        other.endDate == endDate &&
        other.createdAt == createdAt &&
        other.isAtive == isAtive;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        position.hashCode ^
        company.hashCode ^
        website.hashCode ^
        location.hashCode ^
        achievements.hashCode ^
        startDate.hashCode ^
        endDate.hashCode ^
        createdAt.hashCode ^
        isAtive.hashCode;
  }
}
