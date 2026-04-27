import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/analytics/analytics_service.dart';
import '../../../core/widgets/empty_state.dart';
import '../../../core/widgets/loading_state.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../shared/formatters.dart';
import '../../../shared/providers.dart';

class ProductDetailScreen extends ConsumerWidget {
  const ProductDetailScreen({super.key, required this.productId});
  final String productId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FutureBuilder(
      future: ref.read(productRepositoryProvider).getProduct(productId),
      builder: (_, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(body: LoadingState(label: 'Memuat detail produk...'));
        }
        final product = snapshot.data;
        if (product != null) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            ref.read(analyticsServiceProvider).track(
                  AnalyticsEvent.viewProduct,
                  payload: {'productId': product.id, 'name': product.name},
                );
          });
        }
        return Scaffold(
          appBar: AppBar(title: const Text('Detail Produk')),
          body: Padding(
            padding: const EdgeInsets.all(16),
            child: product == null
                ? const EmptyState(
                    title: 'Produk belum tersedia',
                    description: 'Silakan lihat produk karya panti lainnya.',
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(product.name, style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 8),
                      Text('Cerita di Balik Produk', style: Theme.of(context).textTheme.labelLarge),
                      const SizedBox(height: 4),
                      Text(product.description),
                      const SizedBox(height: 8),
                      Text(formatRupiah(product.priceIdr)),
                      const SizedBox(height: 12),
                      PrimaryButton(
                        label: 'Beli Produk',
                        onPressed: () async {
                          ref.read(analyticsServiceProvider).track(
                                AnalyticsEvent.buyProduct,
                                payload: {'productId': product.id, 'price': product.priceIdr},
                              );
                          try {
                            final session = await ref.read(paymentRepositoryProvider).createOrder(
                                  productId: product.id,
                                  quantity: 1,
                                );
                            if (!context.mounted) return;
                            final encodedUrl = Uri.encodeComponent(session.paymentUrl);
                            context.go('/demo-payment?paymentId=${session.paymentId}&paymentUrl=$encodedUrl&type=order');
                          } catch (_) {
                            if (!context.mounted) return;
                            ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Gagal membuat order demo.')));
                          }
                        },
                      ),
                    ],
                  ),
          ),
        );
      },
    );
  }
}
