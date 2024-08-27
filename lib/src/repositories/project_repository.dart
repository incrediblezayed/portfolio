import 'package:portfolio/src/repositories/api_repository.dart';
import 'package:portfolio_core_data/portfolio_core_data.dart';

class ProjectRepository {
  ApiRepository apiRepository = ApiRepository();
  Future<List<ProjectModel>> getProjects() async {
    try {
      final response = await apiRepository.get(
        '/projects/',
      );
      if (response != null) {
        return (response as List<dynamic>)
            .map<ProjectModel>(
              (e) => ProjectModel.fromMap(e as Map<String, dynamic>),
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
