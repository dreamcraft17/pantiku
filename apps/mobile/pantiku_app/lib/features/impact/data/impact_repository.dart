import '../domain/impact_summary.dart';
import '../domain/impact_story.dart';
import '../../../core/network/api_service.dart';

abstract class ImpactRepository {
  Future<ImpactSummary> getSummary();
  Future<List<ImpactStory>> getStories();
}

class MockImpactRepository implements ImpactRepository {
  @override
  Future<ImpactSummary> getSummary() async {
    return ImpactSummary(
      totalChildrenSupported: 63,
      totalOrphanages: 12,
      totalCampaigns: 8,
      totalProductsSold: 182,
      totalDonationsAmount: 45450000,
      growthTotalChildrenSupported: 8,
      growthTotalOrphanages: 5,
      growthTotalCampaigns: 11,
      growthTotalProductsSold: 14,
      growthTotalDonationsAmount: 17,
    );
  }

  @override
  Future<List<ImpactStory>> getStories() async {
    return [
      ImpactStory(
        title: 'Dari Mesin Jahit ke Produk Siap Jual',
        description:
            'Pelatihan menjahit berkembang menjadi sesi produksi rutin. Peserta membangun keterampilan nyata yang siap diterapkan di dunia kerja.',
        orphanageName: 'Panti Berdaya Jakarta Utara',
        impact: '5 anak belajar keterampilan menjahit',
      ),
      ImpactStory(
        title: 'Kelas Kuliner Menjadi Unit Produksi',
        description:
            'Dukungan alat pelatihan membuat kelas kuliner naik tingkat menjadi unit produksi mingguan yang terstruktur.',
        orphanageName: 'Panti Tumbuh Jakarta Timur',
        impact: '8 anak terlibat dalam produksi dan pengemasan',
      ),
      ImpactStory(
        title: 'Literasi Digital untuk Masa Depan Kerja',
        description:
            'Kelas digital membantu peserta membangun kebiasaan belajar teknologi yang relevan untuk masa depan.',
        orphanageName: 'Panti Mandiri Jakarta Selatan',
        impact: '6 anak menuntaskan kelas literasi digital dasar',
      ),
    ];
  }
}

class ApiImpactRepository implements ImpactRepository {
  ApiImpactRepository(this._apiService);
  final ApiService _apiService;
  final MockImpactRepository _fallback = MockImpactRepository();

  @override
  Future<ImpactSummary> getSummary() async {
    try {
      final data = await _apiService.get('/impact/summary');
      final growth = (data['growth'] as Map<String, dynamic>?) ?? const {};
      return ImpactSummary(
        totalChildrenSupported: (data['totalChildren'] as num?)?.toInt() ?? (data['total_children_supported'] as num?)?.toInt() ?? 0,
        totalOrphanages: (data['totalOrphanages'] as num?)?.toInt() ?? (data['total_orphanages'] as num?)?.toInt() ?? 0,
        totalCampaigns: (data['totalCampaigns'] as num?)?.toInt() ?? (data['total_campaigns'] as num?)?.toInt() ?? 0,
        totalProductsSold: (data['totalProductsSold'] as num?)?.toInt() ?? (data['total_products_sold'] as num?)?.toInt() ?? 0,
        totalDonationsAmount: (data['totalDonations'] as num?)?.toInt() ?? (data['total_donations_amount'] as num?)?.toInt() ?? 0,
        growthTotalChildrenSupported: (growth['totalChildren'] as num?)?.toInt() ?? (growth['total_children_supported'] as num?)?.toInt() ?? 0,
        growthTotalOrphanages: (growth['totalOrphanages'] as num?)?.toInt() ?? (growth['total_orphanages'] as num?)?.toInt() ?? 0,
        growthTotalCampaigns: (growth['totalCampaigns'] as num?)?.toInt() ?? (growth['total_campaigns'] as num?)?.toInt() ?? 0,
        growthTotalProductsSold: (growth['totalProductsSold'] as num?)?.toInt() ?? (growth['total_products_sold'] as num?)?.toInt() ?? 0,
        growthTotalDonationsAmount: (growth['totalDonations'] as num?)?.toInt() ?? (growth['total_donations_amount'] as num?)?.toInt() ?? 0,
      );
    } catch (_) {
      return _fallback.getSummary();
    }
  }

  @override
  Future<List<ImpactStory>> getStories() async {
    try {
      final raw = await _apiService.get('/impact/stories');
      final list = raw as List<dynamic>;
      return list
          .map(
            (item) => ImpactStory(
              title: item['title']?.toString() ?? '',
              description: item['description']?.toString() ?? '',
              orphanageName: item['orphanageName']?.toString() ?? '',
              impact: item['impact']?.toString() ?? '',
            ),
          )
          .toList();
    } catch (_) {
      return _fallback.getStories();
    }
  }
}
