import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../shared/providers.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profil')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Pengguna Pantiku'),
            const SizedBox(height: 8),
            const Text('donor@pantiku.id'),
            const SizedBox(height: 16),
            const Text('Riwayat kontribusi dan preferensi akun akan ditampilkan di sini.'),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: () async {
                await ref.read(tokenStorageProvider).clear();
                ref.read(tokenProvider.notifier).state = null;
                if (context.mounted) context.go('/login');
              },
              child: const Text('Logout'),
            )
          ],
        ),
      ),
    );
  }
}
