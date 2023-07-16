// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

import 'package:flutter/material.dart';

@immutable
class EnquiryModel {
  final String id;
  final String name;
  final String email;
  final String message;
  final String phone;
  final String createdAt;
  const EnquiryModel({
    required this.id,
    required this.name,
    required this.email,
    required this.message,
    required this.phone,
    required this.createdAt,
  });

  EnquiryModel copyWith({
    String? id,
    String? name,
    String? email,
    String? message,
    String? phone,
    String? createdAt,
  }) {
    return EnquiryModel(
      id: id ?? this.id,
      name: name ?? this.name,
      email: email ?? this.email,
      message: message ?? this.message,
      phone: phone ?? this.phone,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  Map<String, dynamic> toMap() {
    return <String, dynamic>{
      'name': name,
      'email': email,
      'message': message,
      'phone': phone,
    };
  }

  factory EnquiryModel.fromMap(Map<String, dynamic> map) {
    return EnquiryModel(
      id: map['id'] as String,
      name: map['name'] as String,
      email: map['email'] as String,
      message: map['message'] as String,
      phone: map['phone'] as String,
      createdAt: map['createdAt'] as String,
    );
  }

  String toJson() => json.encode(toMap());

  factory EnquiryModel.fromJson(String source) =>
      EnquiryModel.fromMap(json.decode(source) as Map<String, dynamic>);

  @override
  String toString() {
    return 'EnquiryModel(id: $id, name: $name, email: $email, message: $message, phone: $phone, createdAt: $createdAt)';
  }

  @override
  bool operator ==(covariant EnquiryModel other) {
    if (identical(this, other)) return true;

    return other.id == id &&
        other.name == name &&
        other.email == email &&
        other.message == message &&
        other.phone == phone &&
        other.createdAt == createdAt;
  }

  @override
  int get hashCode {
    return id.hashCode ^
        name.hashCode ^
        email.hashCode ^
        message.hashCode ^
        phone.hashCode ^
        createdAt.hashCode;
  }
}
