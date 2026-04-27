import '../domain/auth_user.dart';
import '../../../core/network/api_service.dart';
import '../../../core/storage/token_storage.dart';

enum AuthAccountType { donor, orphanageManager, volunteer }

class RegisterRequest {
  RegisterRequest({
    required this.accountType,
    required this.email,
    required this.password,
    this.fullName,
    this.managerName,
    this.phone,
    this.skills,
    this.city,
    this.orphanageName,
    this.address,
    this.province,
    this.contactPhone,
    this.estimatedChildrenCount,
  });

  final AuthAccountType accountType;
  final String email;
  final String password;
  final String? fullName;
  final String? managerName;
  final String? phone;
  final String? skills;
  final String? city;
  final String? orphanageName;
  final String? address;
  final String? province;
  final String? contactPhone;
  final int? estimatedChildrenCount;

  Map<String, dynamic> toJson() {
    String accountTypeValue;
    switch (accountType) {
      case AuthAccountType.orphanageManager:
        accountTypeValue = 'ORPHANAGE_MANAGER';
        break;
      case AuthAccountType.volunteer:
        accountTypeValue = 'VOLUNTEER';
        break;
      default:
        accountTypeValue = 'DONOR';
    }

    return {
      'accountType': accountTypeValue,
      'email': email,
      'password': password,
      if (fullName != null) 'fullName': fullName,
      if (managerName != null) 'managerName': managerName,
      if (phone != null) 'phone': phone,
      if (skills != null) 'skills': skills,
      if (city != null) 'city': city,
      if (orphanageName != null) 'orphanageName': orphanageName,
      if (address != null) 'address': address,
      if (province != null) 'province': province,
      if (contactPhone != null) 'contactPhone': contactPhone,
      if (estimatedChildrenCount != null) 'estimatedChildrenCount': estimatedChildrenCount,
    };
  }
}

abstract class AuthRepository {
  Future<String> login({required String email, required String password});
  Future<(String token, String? message)> register(RegisterRequest request);
  Future<AuthUser?> me();
}

class MockAuthRepository implements AuthRepository {
  @override
  Future<String> login({required String email, required String password}) async {
    await Future.delayed(const Duration(milliseconds: 300));
    return 'mock-jwt-token';
  }

  @override
  Future<AuthUser?> me() async {
    await Future.delayed(const Duration(milliseconds: 200));
    return AuthUser(id: 'u1', name: 'Pengguna Pantiku', email: 'pengguna@pantiku.id');
  }

  @override
  Future<(String token, String? message)> register(RegisterRequest request) async {
    await Future.delayed(const Duration(milliseconds: 400));
    return ('mock-jwt-token', null);
  }
}

class ApiAuthRepository implements AuthRepository {
  ApiAuthRepository(this._apiService, this._tokenStorage);

  final ApiService _apiService;
  final TokenStorage _tokenStorage;
  final MockAuthRepository _fallback = MockAuthRepository();

  @override
  Future<String> login({required String email, required String password}) async {
    try {
      final data = await _apiService.post('/auth/login', body: {'email': email, 'password': password});
      final token = (data['accessToken'] ?? data['token']) as String;
      await _tokenStorage.saveToken(token);
      return token;
    } catch (_) {
      final token = await _fallback.login(email: email, password: password);
      await _tokenStorage.saveToken(token);
      return token;
    }
  }

  @override
  Future<AuthUser?> me() async {
    try {
      final data = await _apiService.get('/auth/me');
      return AuthUser(
        id: data['id'].toString(),
        name: data['fullName']?.toString() ?? 'Pengguna',
        email: data['email']?.toString() ?? '',
      );
    } catch (_) {
      return _fallback.me();
    }
  }

  @override
  Future<(String token, String? message)> register(RegisterRequest request) async {
    try {
      final data = await _apiService.post('/auth/register', body: request.toJson());
      final token = (data['accessToken'] ?? data['token']) as String;
      await _tokenStorage.saveToken(token);
      return (token, data['message']?.toString());
    } catch (_) {
      final data = await _fallback.register(request);
      final token = data.$1;
      await _tokenStorage.saveToken(token);
      return data;
    }
  }
}
