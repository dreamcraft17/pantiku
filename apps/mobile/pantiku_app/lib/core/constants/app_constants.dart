const _apiBaseUrlFromDefine = String.fromEnvironment('API_BASE_URL');
const _demoModeFromDefine = String.fromEnvironment('DEMO_MODE');

class AppConstants {
  static const appName = 'Pantiku';
  static const defaultApiBaseUrl = 'http://10.0.2.2:4000/api/v1';
  static final apiBaseUrl = _apiBaseUrlFromDefine.isEmpty ? defaultApiBaseUrl : _apiBaseUrlFromDefine;
  static final demoMode = _demoModeFromDefine.toLowerCase() == 'true';
}
