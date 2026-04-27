import 'dart:convert';

enum AuthRole { admin, orphanageManager, donor, volunteer, unknown }

String? roleNameFromToken(String? token) {
  if (token == null || token.isEmpty) return null;
  try {
    final chunks = token.split('.');
    if (chunks.length < 2) return null;
    final payload = jsonDecode(utf8.decode(base64Url.decode(base64Url.normalize(chunks[1])))) as Map<String, dynamic>;
    return payload['role']?.toString();
  } catch (_) {
    return null;
  }
}

AuthRole roleFromToken(String? token) {
  final role = roleNameFromToken(token);
  if (role == null) return AuthRole.unknown;
  switch (role) {
      case 'ADMIN':
        return AuthRole.admin;
      case 'ORPHANAGE_MANAGER':
        return AuthRole.orphanageManager;
      case 'DONOR':
        return AuthRole.donor;
      case 'VOLUNTEER':
        return AuthRole.volunteer;
      default:
        return AuthRole.donor;
  }
}
