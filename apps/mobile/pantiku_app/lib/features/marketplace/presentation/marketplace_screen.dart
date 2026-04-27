import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/widgets/empty_state.dart';
import '../../../core/widgets/product_card.dart';
import '../../../core/widgets/skeleton_box.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../shared/providers.dart';

class MarketplaceScreen extends ConsumerWidget {
  const MarketplaceScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FutureBuilder(
      future: ref.read(productRepositoryProvider).listProducts(),
      builder: (_, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return Scaffold(
            appBar: AppBar(title: const Text('Produk Karya Panti')),
            body: ListView(
              padding: const EdgeInsets.all(12),
              children: const [
                SkeletonBox(height: 120),
                SizedBox(height: 12),
                SkeletonBox(height: 120),
                SizedBox(height: 12),
                SkeletonBox(height: 120),
              ],
            ),
          );
        }
        final products = snapshot.data ?? [];
        return Scaffold(
          appBar: AppBar(title: const Text('Produk Karya Panti')),
          body: products.isEmpty
              ? ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    if (AppConstants.demoMode)
                      const Padding(
                        padding: EdgeInsets.only(bottom: 12),
                        child: Text(
                          'Mode Demo — data hanya contoh',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                        ),
                      ),
                    const EmptyState(
                      title: 'Produk karya panti segera hadir',
                      description:
                          'Marketplace Pantiku akan menampilkan produk dari panti mitra setelah proses kurasi dan verifikasi selesai.',
                    ),
                    const SizedBox(height: 12),
                    PrimaryButton(
                      label: 'Saya Pengelola Panti',
                      onPressed: () => context.go('/register'),
                    ),
                  ],
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: products.length,
                  itemBuilder: (_, i) {
                    final product = products[i];
                    return ProductCard(
                      product: product,
                      onTap: () => context.go('/products/${product.id}'),
                    );
                  },
                ),
        );
      },
    );
  }
}
