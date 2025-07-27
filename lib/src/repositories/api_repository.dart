import 'dart:io';

import 'package:dio/dio.dart';
import 'package:file_saver/file_saver.dart';
import 'package:portfolio/src/utils/constants.dart';

/// ApiRepository
/// This class is used to make api calls
/// It uses Dio as http client
class ApiRepository {
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: Constants.url,
    ),
  );

  /// Get method
  Future<dynamic> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Map<String, dynamic>? headers,
  }) async {
    try {
      final response = await _dio.get<dynamic>(
        path,
        queryParameters: queryParameters,
        options: Options(headers: headers),
      );
      if (response.statusCode == 200) {
        return response.data!;
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Post method
  Future<dynamic> post(
    String path, {
    Map<String, dynamic>? queryParameters,
    Map<String, dynamic>? headers,
    int successCode = 200,
    dynamic body,
  }) async {
    try {
      final response = await _dio.post<dynamic>(
        path,
        queryParameters: queryParameters,
        data: body,
        options: Options(headers: headers),
      );
      if (response.statusCode == successCode) {
        return response.data!;
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Put method
  Future<dynamic> put(
    String path, {
    Map<String, dynamic>? queryParameters,
    Map<String, dynamic>? headers,
    int successCode = 200,
    dynamic body,
  }) async {
    try {
      final response = await _dio.put<dynamic>(
        path,
        queryParameters: queryParameters,
        data: body,
        options: Options(headers: headers),
      );

      if (response.statusCode == successCode) {
        return response.data!;
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Delete method
  Future<dynamic> delete(
    String path, {
    Map<String, dynamic>? queryParameters,
    Map<String, dynamic>? headers,
    int successCode = 200,
    dynamic body,
  }) async {
    try {
      final response = await _dio.delete<dynamic>(
        path,
        queryParameters: queryParameters,
        data: body,
        options: Options(headers: headers),
      );

      if (response.statusCode == successCode) {
        return response.data!;
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      rethrow;
    }
  }

  /// Method to save resume
  Future<bool> saveResume() async {
    try {
      final response = await _dio.get<dynamic>(
        '/resume/',
      );
      if (response.statusCode == 200) {
        if (Platform.isAndroid || Platform.isIOS || Platform.isMacOS) {
          await FileSaver.instance.saveAs(
            name: 'Resume_Hassan_Ansari',
            link: LinkDetails(
              link: response.data as String,
            ),
            mimeType: MimeType.pdf,
            fileExtension: 'pdf',
          );
        } else {
          await FileSaver.instance.saveFile(
            name: 'Resume_Hassan_Ansari',
            link: LinkDetails(
              link: response.data as String,
            ),
            mimeType: MimeType.pdf,
            fileExtension: 'pdf',
          );
        }

        return true;
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      rethrow;
    }
  }
}
