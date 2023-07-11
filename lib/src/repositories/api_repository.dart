import 'package:dio/dio.dart';
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
    dynamic body,
  }) async {
    try {
      final response = await dio.post(
        path,
        queryParameters: queryParameters,
        data: body,
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
}
