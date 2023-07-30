// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

import 'package:flutter/material.dart';

@immutable
class TechStackModel {
  final String id;
  final String name;
  final String image;
  final String link;
  const TechStackModel({
    required this.name,
    required this.image,
    required this.link,
    this.id = '',
  });

  TechStackModel copyWith({
    String? name,
    String? image,
    String? link,
    String? id,
  }) {
    return TechStackModel(
      id: id ?? this.id,
      name: name ?? this.name,
      image: image ?? this.image,
      link: link ?? this.link,
    );
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      if (id.isNotEmpty) 'id': id,
      'name': name,
      'image': image,
      'link': link,
    };
  }

  factory TechStackModel.fromMap(Map<String, dynamic> map) {
    return TechStackModel(
      id: map['id'] as String,
      name: map['name'] as String,
      image: map['image'] as String,
      link: map['link'] as String,
    );
  }

  String toJson() => json.encode(toMap());

  factory TechStackModel.fromJson(String source) =>
      TechStackModel.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() =>
      'TechStackModel(name: $name, image: $image, link: $link)';

  @override
  bool operator ==(covariant TechStackModel other) {
    if (identical(this, other)) return true;

    return other.name == name && other.image == image && other.link == link;
  }

  @override
  int get hashCode => name.hashCode ^ image.hashCode ^ link.hashCode;
}
