import '../domain/campaign.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/network/api_service.dart';

abstract class CampaignRepository {
  Future<List<Campaign>> listCampaigns();
  Future<Campaign?> getCampaign(String id);
}

class MockCampaignRepository implements CampaignRepository {
  static final _items = [
    Campaign(id: 'c1', title: 'Sewing Machine for Productive Skills', orphanage: 'Panti Jakarta Utara', collected: 14500000, goal: 35000000),
    Campaign(id: 'c2', title: 'Baking Oven and Culinary Training', orphanage: 'Panti Jakarta Utara', collected: 18000000, goal: 42000000),
    Campaign(id: 'c3', title: 'Digital Literacy Program', orphanage: 'Panti Jakarta Timur', collected: 12000000, goal: 30000000),
  ];

  @override
  Future<Campaign?> getCampaign(String id) async {
    for (final item in _items) {
      if (item.id == id) return item;
    }
    return null;
  }

  @override
  Future<List<Campaign>> listCampaigns() async => _items;
}

class ApiCampaignRepository implements CampaignRepository {
  ApiCampaignRepository(this._apiService);
  final ApiService _apiService;
  final MockCampaignRepository _fallback = MockCampaignRepository();

  @override
  Future<Campaign?> getCampaign(String id) async {
    try {
      final data = await _apiService.get('/campaigns/$id');
      return Campaign(
        id: data['id'].toString(),
        title: data['title']?.toString() ?? '',
        orphanage: data['orphanage']?['publicAlias']?.toString() ?? data['orphanageName']?.toString() ?? 'Panti',
        collected: (data['collectedAmount'] as num?)?.toInt() ?? 0,
        goal: (data['goalAmount'] as num?)?.toInt() ?? 0,
      );
    } catch (_) {
      return _fallback.getCampaign(id);
    }
  }

  @override
  Future<List<Campaign>> listCampaigns() async {
    try {
      final raw = await _apiService.get('/campaigns');
      final list = (raw as List<dynamic>);
      return list
          .map((item) => Campaign(
                id: item['id'].toString(),
                title: item['title']?.toString() ?? '',
                orphanage: item['orphanage']?['publicAlias']?.toString() ?? item['orphanageName']?.toString() ?? 'Panti',
                collected: (item['collectedAmount'] as num?)?.toInt() ?? 0,
                goal: (item['goalAmount'] as num?)?.toInt() ?? 0,
              ))
          .toList();
    } catch (_) {
      if (AppConstants.demoMode) {
        return _fallback.listCampaigns();
      }
      return <Campaign>[];
    }
  }
}
