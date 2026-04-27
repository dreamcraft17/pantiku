import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../core/analytics/analytics_service.dart';
import '../core/network/api_client.dart';
import '../core/network/api_service.dart';
import '../core/storage/token_storage.dart';
import '../features/auth/data/auth_repository.dart';
import '../features/campaigns/data/campaign_repository.dart';
import '../features/impact/data/impact_repository.dart';
import '../features/impact/domain/impact_story.dart';
import '../features/impact/domain/impact_summary.dart';
import '../features/marketplace/data/product_repository.dart';
import '../features/payments/data/payment_repository.dart';

final secureStorageProvider = Provider((_) => const FlutterSecureStorage());
final analyticsServiceProvider = Provider<AnalyticsService>((_) => MockAnalyticsService());
final tokenStorageProvider = Provider((ref) => TokenStorage(ref.watch(secureStorageProvider)));
final tokenProvider = StateProvider<String?>((_) => null);
final apiClientProvider = Provider((ref) {
  final tokenStorage = ref.watch(tokenStorageProvider);
  return ApiClient(
    getToken: tokenStorage.getToken,
    onUnauthorized: () async {
      await tokenStorage.clear();
      ref.read(tokenProvider.notifier).state = null;
    },
  );
});
final apiServiceProvider = Provider((ref) => ApiService(ref.watch(apiClientProvider)));

final authRepositoryProvider = Provider<AuthRepository>((ref) => ApiAuthRepository(ref.watch(apiServiceProvider), ref.watch(tokenStorageProvider)));
final campaignRepositoryProvider = Provider<CampaignRepository>((ref) => ApiCampaignRepository(ref.watch(apiServiceProvider)));
final productRepositoryProvider = Provider<ProductRepository>((ref) => ApiProductRepository(ref.watch(apiServiceProvider)));
final impactRepositoryProvider = Provider<ImpactRepository>((ref) => ApiImpactRepository(ref.watch(apiServiceProvider)));
final impactSummaryProvider = FutureProvider<ImpactSummary>((ref) => ref.watch(impactRepositoryProvider).getSummary());
final impactStoriesProvider = FutureProvider<List<ImpactStory>>((ref) => ref.watch(impactRepositoryProvider).getStories());
final paymentRepositoryProvider = Provider<PaymentRepository>((ref) => ApiPaymentRepository(ref.watch(apiServiceProvider)));
