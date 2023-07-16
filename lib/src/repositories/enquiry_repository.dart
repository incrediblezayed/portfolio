import 'package:portfolio/src/models/enquiry_model.dart';
import 'package:portfolio/src/repositories/api_repository.dart';

class EnquiryRepository {
  final apiRepository = ApiRepository();
  Future<bool> addEnquiry(EnquiryModel enquiryModel) async {
    try {
      final response = await apiRepository.post(
        '/contact/',
        body: enquiryModel.toJson(),
        successCode: 201,
      );
      if (response != null && response is String && response.isNotEmpty) {
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  }
}
