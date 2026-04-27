import '../../../core/network/api_service.dart';

class PaymentSession {
  PaymentSession({
    required this.referenceId,
    required this.paymentId,
    required this.paymentUrl,
    required this.status,
    required this.referenceType,
  });

  final String referenceId;
  final String paymentId;
  final String paymentUrl;
  final String status;
  final String referenceType;
}

abstract class PaymentRepository {
  Future<PaymentSession> createDonation({
    required String campaignId,
    required int amount,
  });

  Future<PaymentSession> createOrder({
    required String productId,
    required int quantity,
  });

  Future<PaymentSession> simulateSuccess(String paymentId);
}

class ApiPaymentRepository implements PaymentRepository {
  ApiPaymentRepository(this._apiService);

  final ApiService _apiService;

  PaymentSession _mapSession(Map<String, dynamic> data, String referenceType) {
    return PaymentSession(
      referenceId: (data['donationId'] ?? data['orderId'] ?? '').toString(),
      paymentId: data['paymentId']?.toString() ?? '',
      paymentUrl: data['paymentUrl']?.toString() ?? '',
      status: data['status']?.toString() ?? 'PENDING',
      referenceType: referenceType,
    );
  }

  @override
  Future<PaymentSession> createDonation({required String campaignId, required int amount}) async {
    final data = await _apiService.post('/campaigns/$campaignId/donate', body: {'amount': amount}) as Map<String, dynamic>;
    return _mapSession(data, 'DONATION');
  }

  @override
  Future<PaymentSession> createOrder({required String productId, required int quantity}) async {
    final data = await _apiService.post('/orders', body: {'productId': productId, 'quantity': quantity}) as Map<String, dynamic>;
    return _mapSession(data, 'ORDER');
  }

  @override
  Future<PaymentSession> simulateSuccess(String paymentId) async {
    final data = await _apiService.post('/payments/$paymentId/simulate-success') as Map<String, dynamic>;
    return PaymentSession(
      referenceId: data['referenceId']?.toString() ?? '',
      paymentId: data['paymentId']?.toString() ?? paymentId,
      paymentUrl: '',
      status: data['status']?.toString() ?? 'PAID',
      referenceType: data['referenceType']?.toString() ?? '',
    );
  }
}
