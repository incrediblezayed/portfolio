import 'package:portfolio/src/repositories/api_repository.dart';
import 'package:portfolio/src/utils/constants.dart';
import 'package:portfolio_core_data/portfolio_core_data.dart';

class TechStackRepository {
  ApiRepository apiRepository = ApiRepository();
  Future<List<TechStackModel>> getTechStack() async {
    try {
      final response = await apiRepository.get(
        Constants.techStackUrl,
      );
      if (response != null) {
        return (response as List<dynamic>)
            .map<TechStackModel>(
              (e) => TechStackModel.fromMap(e as Map<String, dynamic>),
            )
            .toList();
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      rethrow;
    }
  }
}
