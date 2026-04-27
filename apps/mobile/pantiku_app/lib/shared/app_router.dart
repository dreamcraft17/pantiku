import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/register_screen.dart';
import '../features/auth/presentation/splash_screen.dart';
import '../features/campaigns/presentation/campaign_detail_screen.dart';
import '../features/campaigns/presentation/campaign_list_screen.dart';
import '../features/campaigns/presentation/donation_screen.dart';
import '../features/home/presentation/home_screen.dart';
import '../features/impact/presentation/impact_summary_screen.dart';
import '../features/marketplace/presentation/marketplace_screen.dart';
import '../features/marketplace/presentation/product_detail_screen.dart';
import '../features/payments/presentation/demo_payment_screen.dart';
import '../features/payments/presentation/payment_failed_screen.dart';
import '../features/payments/presentation/payment_success_screen.dart';
import '../features/profile/presentation/profile_screen.dart';

final appRouterProvider = Provider<GoRouter>((_) {
  return GoRouter(
    initialLocation: '/splash',
    routes: [
      GoRoute(path: '/splash', builder: (_, __) => const SplashScreen()),
      GoRoute(path: '/login', builder: (_, __) => const LoginScreen()),
      GoRoute(path: '/register', builder: (_, __) => const RegisterScreen()),
      GoRoute(path: '/home', builder: (_, __) => const HomeScreen()),
      GoRoute(path: '/campaigns', builder: (_, __) => const CampaignListScreen()),
      GoRoute(path: '/campaigns/:id', builder: (_, state) => CampaignDetailScreen(campaignId: state.pathParameters['id']!)),
      GoRoute(path: '/campaigns/:id/donate', builder: (_, state) => DonationScreen(campaignId: state.pathParameters['id']!)),
      GoRoute(path: '/marketplace', builder: (_, __) => const MarketplaceScreen()),
      GoRoute(path: '/products/:id', builder: (_, state) => ProductDetailScreen(productId: state.pathParameters['id']!)),
      GoRoute(
        path: '/demo-payment',
        builder: (_, state) => DemoPaymentScreen(
          paymentId: state.uri.queryParameters['paymentId'] ?? '',
          paymentUrl: state.uri.queryParameters['paymentUrl'] ?? '',
          referenceType: state.uri.queryParameters['type'] ?? 'DONATION',
        ),
      ),
      GoRoute(
        path: '/payment-success',
        builder: (_, state) => PaymentSuccessScreen(type: state.uri.queryParameters['type'] ?? 'donation'),
      ),
      GoRoute(
        path: '/payment-failed',
        builder: (_, state) => PaymentFailedScreen(type: state.uri.queryParameters['type'] ?? 'donation'),
      ),
      GoRoute(path: '/impact', builder: (_, __) => const ImpactSummaryScreen()),
      GoRoute(path: '/profile', builder: (_, __) => const ProfileScreen()),
    ],
  );
});
