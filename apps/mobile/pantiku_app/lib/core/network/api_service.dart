import 'api_client.dart';

class ApiService {
  ApiService(this._client);
  final ApiClient _client;

  Future<dynamic> get(String path, {Map<String, dynamic>? query}) async {
    final response = await _client.dio.get(path, queryParameters: query);
    return _unwrap(response.data);
  }

  Future<dynamic> post(String path, {dynamic body}) async {
    final response = await _client.dio.post(path, data: body);
    return _unwrap(response.data);
  }

  dynamic _unwrap(dynamic raw) {
    if (raw is Map<String, dynamic> && raw.containsKey('data')) {
      return raw['data'];
    }
    return raw;
  }
}
