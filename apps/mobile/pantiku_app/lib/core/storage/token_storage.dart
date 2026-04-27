import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  TokenStorage(this._secureStorage);
  final FlutterSecureStorage _secureStorage;
  static const _key = 'pantiku_access_token';

  Future<void> saveToken(String token) => _secureStorage.write(key: _key, value: token);
  Future<String?> getToken() => _secureStorage.read(key: _key);
  Future<void> clear() => _secureStorage.delete(key: _key);
}
