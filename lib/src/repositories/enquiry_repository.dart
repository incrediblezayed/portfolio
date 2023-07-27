import 'package:portfolio/src/models/enquiry_model.dart';
import 'package:portfolio/src/repositories/api_repository.dart';
import 'package:portfolio/src/utils/constants.dart';

/// EnquiryRepository
/// This class is used to make api calls
/// for enquiries
/// It uses ApiRepository to make the calls
class EnquiryRepository {
  /// ApiRepository instance
  final apiRepository = ApiRepository();

  /// Add enquiry
  Future<bool> addEnquiry(EnquiryModel enquiryModel) async {
    try {
      final response = await apiRepository.post(
        Constants.enquiryUrl,
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
