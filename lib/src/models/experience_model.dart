// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:portfolio/src/models/techstack_model.dart';

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
  final List<TechStackModel> techStacks;
  final bool isActive;
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
    this.techStacks = const [],
    this.isActive = true,
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
    List<TechStackModel>? techStacks,
    bool? isActive,
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
      techStacks: techStacks ?? this.techStacks,
      isActive: isActive ?? this.isActive,
    );
  }

  @override
  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      if (id.isNotEmpty) 'id': id,
      'position': position,
      'company': company,
      'website': website,
      'location': location,
      'achievements': achievements,
      'startDate': startDate.toUtc().toIso8601String(),
      'endDate': endDate?.toUtc().toIso8601String(),
      'techStacks': techStacks.map((e) => e.id).toList(),
      'isActive': isActive,
    };
  }

  @override
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
      techStacks: map['techStacks'] == null
          ? []
          : List<TechStackModel>.from(
              (map['techStacks'] as List)
                      .map<TechStackModel>(
                        (c) =>
                            TechStackModel.fromMap(c as Map<String, dynamic>),
                      )
                      .toList() ??
                  [],
            ),
      isActive: map['isActive'] as bool? ?? true,
    );
  }

  @override
  String toJson() => json.encode(toMap());

  factory ExperienceModel.fromJson(String source) =>
      ExperienceModel.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'ExperienceModel(id: $id, position: $position, company: $company,website: $website location: $location, achievements: $achievements, startDate: $startDate, endDate: $endDate, createdAt: $createdAt)';
  }

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
        listEquals(other.techStacks, techStacks) &&
        other.isActive == isActive;
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
        techStacks.hashCode ^
        isActive.hashCode;
  }
}
