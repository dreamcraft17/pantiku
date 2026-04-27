import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/widgets/campaign_card.dart';
import '../../../core/widgets/empty_state.dart';
import '../../../core/widgets/skeleton_box.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../shared/providers.dart';

class CampaignListScreen extends ConsumerWidget {
  const CampaignListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FutureBuilder(
      future: ref.read(campaignRepositoryProvider).listCampaigns(),
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return Scaffold(
            appBar: AppBar(title: const Text('Campaign Produktif')),
            body: ListView(
              padding: const EdgeInsets.all(12),
              children: const [
                SkeletonBox(height: 180),
                SizedBox(height: 12),
                SkeletonBox(height: 180),
                SizedBox(height: 12),
                SkeletonBox(height: 180),
              ],
            ),
          );
        }
        final items = snapshot.data ?? [];
        return Scaffold(
          appBar: AppBar(title: const Text('Campaign Produktif')),
          body: items.isEmpty
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
                      title: 'Campaign pertama sedang disiapkan',
                      description:
                          'Pantiku sedang menyiapkan campaign produktif bersama panti mitra. Nantikan campaign pertama yang sudah terverifikasi.',
                    ),
                    const SizedBox(height: 12),
                    PrimaryButton(
                      label: 'Daftarkan Panti',
                      onPressed: () => context.go('/register'),
                    ),
                  ],
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: items.length,
                  itemBuilder: (_, i) {
                    final campaign = items[i];
                    return CampaignCard(
                      campaign: campaign,
                      onTap: () => context.go('/campaigns/${campaign.id}'),
                    );
                  },
                ),
        );
      },
    );
  }
}
