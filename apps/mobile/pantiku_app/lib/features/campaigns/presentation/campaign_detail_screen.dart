import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/analytics/analytics_service.dart';
import '../../../core/widgets/empty_state.dart';
import '../../../core/widgets/loading_state.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../shared/formatters.dart';
import '../../../shared/providers.dart';

class CampaignDetailScreen extends ConsumerWidget {
  const CampaignDetailScreen({super.key, required this.campaignId});
  final String campaignId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return FutureBuilder(
      future: ref.read(campaignRepositoryProvider).getCampaign(campaignId),
      builder: (_, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Scaffold(body: LoadingState(label: 'Memuat detail campaign...'));
        }
        final campaign = snapshot.data;
        if (campaign != null) {
          WidgetsBinding.instance.addPostFrameCallback((_) {
            ref.read(analyticsServiceProvider).track(
                  AnalyticsEvent.viewCampaign,
                  payload: {'campaignId': campaign.id, 'title': campaign.title},
                );
          });
        }
        return Scaffold(
          appBar: AppBar(title: const Text('Detail Campaign Produktif')),
          body: Padding(
            padding: const EdgeInsets.all(16),
            child: campaign == null
                ? const EmptyState(
                    title: 'Campaign belum tersedia',
                    description: 'Coba jelajahi campaign lain yang sedang berjalan.',
                  )
                : Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(campaign.title, style: Theme.of(context).textTheme.titleLarge),
                      const SizedBox(height: 8),
                      Text('Panti Berdaya: ${campaign.orphanage}'),
                      const SizedBox(height: 6),
                      const Text('Bantu wujudkan program produktif agar dampak baik terus bertumbuh.'),
                      const SizedBox(height: 10),
                      Text('${formatRupiah(campaign.collected)} / ${formatRupiah(campaign.goal)}'),
                      const SizedBox(height: 16),
                      PrimaryButton(
                        label: 'Dukung Campaign',
                        onPressed: () {
                          ref.read(analyticsServiceProvider).track(
                                AnalyticsEvent.clickDonate,
                                payload: {'campaignId': campaignId},
                              );
                          context.go('/campaigns/$campaignId/donate');
                        },
                      )
                    ],
                  ),
          ),
        );
      },
    );
  }
}
