import 'package:dio/dio.dart';
import '../constants/app_constants.dart';

class ApiClient {
  ApiClient({
    required Future<String?> Function() getToken,
    required Future<void> Function() onUnauthorized,
  }) : dio = Dio(
          BaseOptions(
            baseUrl: AppConstants.apiBaseUrl,
            connectTimeout: const Duration(seconds: 15),
            receiveTimeout: const Duration(seconds: 15),
          ),
        ) {
    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await getToken();
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          handler.next(options);
        },
        onError: (error, handler) async {
          if (error.response?.statusCode == 401) {
            await onUnauthorized();
          }

          final requestOptions = error.requestOptions;
          final retries = (requestOptions.extra['retries'] as int?) ?? 0;
          final canRetry = retries < 2 && (error.response == null || (error.response?.statusCode ?? 0) >= 500);
          if (canRetry) {
            requestOptions.extra['retries'] = retries + 1;
            await Future.delayed(Duration(milliseconds: 300 * (retries + 1)));
            final retryResponse = await dio.fetch(requestOptions);
            return handler.resolve(retryResponse);
          }
          handler.next(error);
        },
      ),
    );
  }

  final Dio dio;
}
