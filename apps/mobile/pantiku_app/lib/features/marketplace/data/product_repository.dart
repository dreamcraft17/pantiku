import '../domain/product.dart';
import '../../../core/constants/app_constants.dart';
import '../../../core/network/api_service.dart';

abstract class ProductRepository {
  Future<List<Product>> listProducts();
  Future<Product?> getProduct(String id);
}

class MockProductRepository implements ProductRepository {
  static final _products = [
    Product(id: 'p1', name: 'Tote Bag Batik Jakarta', priceIdr: 95000, orphanage: 'Panti Jakarta Utara', description: 'Tas kain handmade produksi anak binaan.'),
    Product(id: 'p2', name: 'Cookies Cokelat Kacang', priceIdr: 70000, orphanage: 'Panti Jakarta Utara', description: 'Kudapan unit kuliner panti.'),
    Product(id: 'p3', name: 'Notebook Daur Ulang A5', priceIdr: 45000, orphanage: 'Panti Jakarta Timur', description: 'Produk kreatif ramah lingkungan.'),
  ];

  @override
  Future<Product?> getProduct(String id) async {
    for (final product in _products) {
      if (product.id == id) return product;
    }
    return null;
  }

  @override
  Future<List<Product>> listProducts() async => _products;
}

class ApiProductRepository implements ProductRepository {
  ApiProductRepository(this._apiService);
  final ApiService _apiService;
  final MockProductRepository _fallback = MockProductRepository();

  @override
  Future<Product?> getProduct(String id) async {
    try {
      final data = await _apiService.get('/products/$id');
      return Product(
        id: data['id'].toString(),
        name: data['name']?.toString() ?? '',
        priceIdr: (data['price'] as num?)?.toInt() ?? 0,
        orphanage: data['orphanage']?['publicAlias']?.toString() ?? data['orphanageName']?.toString() ?? 'Panti',
        description: data['description']?.toString() ?? '',
      );
    } catch (_) {
      return _fallback.getProduct(id);
    }
  }

  @override
  Future<List<Product>> listProducts() async {
    try {
      final raw = await _apiService.get('/products');
      final list = raw as List<dynamic>;
      return list
          .map((item) => Product(
                id: item['id'].toString(),
                name: item['name']?.toString() ?? '',
                priceIdr: (item['price'] as num?)?.toInt() ?? 0,
                orphanage: item['orphanage']?['publicAlias']?.toString() ?? item['orphanageName']?.toString() ?? 'Panti',
                description: item['description']?.toString() ?? '',
              ))
          .toList();
    } catch (_) {
      if (AppConstants.demoMode) {
        return _fallback.listProducts();
      }
      return <Product>[];
    }
  }
}
