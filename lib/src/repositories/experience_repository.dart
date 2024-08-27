import 'package:portfolio/src/repositories/api_repository.dart';
import 'package:portfolio_core_data/portfolio_core_data.dart';

class ExperienceRepository {
  ApiRepository apiRepository = ApiRepository();

  Future<List<ExperienceModel>> getExperiences() async {
    try {
      final response = await apiRepository.get(
        '/experiences/',
      );
      if (response != null) {
        return (response as List<dynamic>)
            .map<ExperienceModel>(
              (e) => ExperienceModel.fromMap(e as Map<String, dynamic>),
            )
            .where((element) => element.isActive)
            .toList();
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      rethrow;
    }
  }
}
