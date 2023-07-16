import 'dart:io';

import 'package:dio/dio.dart';
import 'package:file_saver/file_saver.dart';
import 'package:portfolio/src/utils/constants.dart';

class ApiRepository {
  final Dio dio = Dio(
    BaseOptions(
      baseUrl: Constants.url,
    ),
  );

  Future<dynamic> get(
    String path, {
    Map<String, dynamic>? queryParameters,
    Map<String, dynamic>? headers,
  }) async {
    try {
      final response = await dio.get(
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

  Future<dynamic> post(
    String path, {
    Map<String, dynamic>? queryParameters,
    Map<String, dynamic>? headers,
    int successCode = 200,
    dynamic body,
  }) async {
    try {
      final response = await dio.post(
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

  Future<bool> saveResume() async {
    try {
      final response = await dio.get(
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
            ext: 'pdf',
          );
        } else {
          await FileSaver.instance.saveFile(
            name: 'Resume_Hassan_Ansari',
            link: LinkDetails(
              link: response.data as String,
            ),
            mimeType: MimeType.pdf,
            ext: 'pdf',
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
