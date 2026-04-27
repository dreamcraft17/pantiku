import 'package:flutter/material.dart';
import '../../features/marketplace/domain/product.dart';
import '../../shared/formatters.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({super.key, required this.product, required this.onTap});

  final Product product;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: ListTile(
        onTap: onTap,
        title: Text(product.name),
        subtitle: Text('Produk Karya Panti • ${product.orphanage}\n${product.description}'),
        isThreeLine: true,
        trailing: Text(formatRupiah(product.priceIdr)),
      ),
    );
  }
}
