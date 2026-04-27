import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/auth/auth_role.dart';
import '../../../core/auth/permissions.dart';
import '../../../core/widgets/app_toast.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../shared/providers.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final role = roleNameFromToken(ref.watch(tokenProvider));
    final canManageCampaign = canCreateCampaign(role);

    return Scaffold(
      appBar: AppBar(title: const Text('Pantiku')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Anak Bertumbuh, Panti Mandiri'),
            const SizedBox(height: 6),
            const Text('Bantu wujudkan program produktif bersama ekosistem kebaikan yang berkelanjutan.'),
            const SizedBox(height: 12),
            PrimaryButton(label: 'Dukung Kemandirian', onPressed: () => context.go('/campaigns')),
            const SizedBox(height: 8),
            PrimaryButton(label: 'Beli Produk', onPressed: () => context.go('/marketplace')),
            const SizedBox(height: 8),
            PrimaryButton(label: 'Lihat Dampak Nyata', onPressed: () => context.go('/impact')),
            if (canManageCampaign) ...[
              const SizedBox(height: 8),
              PrimaryButton(
                label: 'Buat Campaign',
                onPressed: () => showSuccessToast(context, 'Fitur manajemen campaign khusus pengelola panti.'),
              ),
            ],
            const SizedBox(height: 8),
            OutlinedButton(onPressed: () => context.go('/profile'), child: const Text('Profil')),
          ],
        ),
      ),
    );
  }
}
