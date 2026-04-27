import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'dart:async';
import '../../../core/widgets/empty_state.dart';
import '../../../core/widgets/impact_stat_card.dart';
import '../../../core/widgets/loading_state.dart';
import '../../../shared/providers.dart';

class ImpactSummaryScreen extends ConsumerStatefulWidget {
  const ImpactSummaryScreen({super.key});

  @override
  ConsumerState<ImpactSummaryScreen> createState() => _ImpactSummaryScreenState();
}

class _ImpactSummaryScreenState extends ConsumerState<ImpactSummaryScreen> with WidgetsBindingObserver {
  Timer? _autoRefreshTimer;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _autoRefreshTimer = Timer.periodic(const Duration(seconds: 45), (_) {
      ref.invalidate(impactSummaryProvider);
    });
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _autoRefreshTimer?.cancel();
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      ref.invalidate(impactSummaryProvider);
    }
  }

  @override
  Widget build(BuildContext context) {
    final impactAsync = ref.watch(impactSummaryProvider);
    final storiesAsync = ref.watch(impactStoriesProvider);

    Future<void> refresh() async {
      ref.invalidate(impactSummaryProvider);
      ref.invalidate(impactStoriesProvider);
      await ref.read(impactSummaryProvider.future);
      await ref.read(impactStoriesProvider.future);
    }

    return Scaffold(
      appBar: AppBar(title: const Text('Dampak Nyata')),
      body: RefreshIndicator(
        onRefresh: refresh,
        child: impactAsync.when(
          loading: () => ListView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            children: const [SizedBox(height: 220, child: LoadingState(label: 'Memuat data dampak...'))],
          ),
          error: (_, __) => ListView(
            padding: const EdgeInsets.all(16),
            children: [
              const EmptyState(
                title: 'Data dampak belum dapat dimuat.',
                description: 'Terjadi kendala saat memuat data. Tarik ke bawah untuk mencoba lagi.',
              ),
              const SizedBox(height: 12),
              FilledButton(
                onPressed: () => ref.invalidate(impactSummaryProvider),
                child: const Text('Muat Ulang'),
              ),
            ],
          ),
          data: (impact) {
            final isEmpty = impact.totalChildrenSupported == 0 &&
                impact.totalOrphanages == 0 &&
                impact.totalCampaigns == 0 &&
                impact.totalProductsSold == 0 &&
                impact.totalDonationsAmount == 0;

            if (isEmpty) {
              return ListView(
                padding: const EdgeInsets.all(16),
                children: const [
                  EmptyState(
                    title: 'Data dampak sedang disiapkan',
                    description: 'Pantiku akan menampilkan data dampak setelah campaign, donasi, dan produk terverifikasi mulai berjalan.',
                  ),
                ],
              );
            }

            return ListView(
              physics: const AlwaysScrollableScrollPhysics(),
              padding: const EdgeInsets.all(16),
              children: [
                const Text(
                  'Dampak Nyata',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 6),
                const Text(
                  'Anak Bertumbuh, Panti Berdaya',
                  style: TextStyle(fontSize: 14, color: Colors.black87),
                ),
                if (impact.isDemo) ...[
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFFF3CD),
                      border: Border.all(color: const Color(0xFFF4C27A)),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: const Text(
                      'Mode Demo',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF8A5A00)),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    impact.message ??
                        'Angka yang ditampilkan adalah simulasi untuk kebutuhan demonstrasi dan belum mewakili data operasional sebenarnya.',
                    style: const TextStyle(fontSize: 12, color: Color(0xFF8A5A00)),
                  ),
                ],
                const SizedBox(height: 16),
                ImpactStatCard(
                  label: 'Total Anak',
                  numericValue: impact.totalChildrenSupported,
                  icon: Icons.child_care_outlined,
                ),
                ImpactStatCard(
                  label: 'Panti Terverifikasi',
                  numericValue: impact.totalOrphanages,
                  icon: Icons.home_work_outlined,
                ),
                ImpactStatCard(
                  label: 'Campaign Aktif',
                  numericValue: impact.totalCampaigns,
                  icon: Icons.campaign_outlined,
                ),
                ImpactStatCard(
                  label: 'Produk Terjual',
                  numericValue: impact.totalProductsSold,
                  icon: Icons.shopping_bag_outlined,
                ),
                ImpactStatCard(
                  label: 'Total Dukungan',
                  numericValue: impact.totalDonationsAmount,
                  isCurrency: true,
                  icon: Icons.volunteer_activism_outlined,
                ),
                const SizedBox(height: 10),
                const Text(
                  'Cerita Dampak',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                ),
                const SizedBox(height: 8),
                ...storiesAsync.maybeWhen(
                  data: (stories) => stories
                      .take(3)
                      .map(
                        (story) => Card(
                          child: Padding(
                            padding: const EdgeInsets.all(14),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(story.title, style: const TextStyle(fontWeight: FontWeight.w700)),
                                const SizedBox(height: 6),
                                Text(story.description),
                                const SizedBox(height: 8),
                                Text(story.orphanageName, style: const TextStyle(fontSize: 12, color: Colors.black54)),
                                const SizedBox(height: 2),
                                Text(
                                  story.impact,
                                  style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Colors.teal),
                                ),
                              ],
                            ),
                          ),
                        ),
                      )
                      .toList(),
                  orElse: () => [
                    const Card(
                      child: Padding(
                        padding: EdgeInsets.all(14),
                        child: Text('Cerita dampak sedang dimuat...'),
                      ),
                    ),
                  ],
                ),
              ],
            );
          },
        ),
      ),
    );
  }
}
