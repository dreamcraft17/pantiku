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
      mode: 'demo',
      isDemo: true,
      totalChildrenSupported: 0,
      totalOrphanages: 0,
      totalCampaigns: 0,
      totalProductsSold: 0,
      totalDonationsAmount: 0,
      message: 'Angka ini adalah simulasi untuk kebutuhan demonstrasi.',
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
      final summary = (data['summary'] as Map<String, dynamic>?) ?? const {};
      return ImpactSummary(
        mode: (data['mode']?.toString() ?? 'real'),
        isDemo: data['isDemo'] == true,
        totalChildrenSupported: (summary['totalChildren'] as num?)?.toInt() ?? 0,
        totalOrphanages: (summary['totalOrphanages'] as num?)?.toInt() ?? 0,
        totalCampaigns: (summary['totalCampaigns'] as num?)?.toInt() ?? 0,
        totalProductsSold: (summary['totalProductsSold'] as num?)?.toInt() ?? 0,
        totalDonationsAmount: (summary['totalDonationsAmount'] as num?)?.toInt() ?? 0,
        message: data['message']?.toString(),
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
