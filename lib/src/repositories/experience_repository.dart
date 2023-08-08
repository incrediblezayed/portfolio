import 'package:portfolio/src/models/experience_model.dart';
import 'package:portfolio/src/repositories/api_repository.dart';

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
            .where((element) => element.isAtive)
            .toList();
      } else {
        throw Exception('Failed to load data');
      }
    } catch (e) {
      rethrow;
    }
  }
}
