import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/widgets/primary_button.dart';

class PaymentFailedScreen extends StatelessWidget {
  const PaymentFailedScreen({super.key, required this.type});

  final String type;

  @override
  Widget build(BuildContext context) {
    final nextRoute = type == 'order' ? '/marketplace' : '/campaigns';
    return Scaffold(
      appBar: AppBar(title: const Text('Pembayaran Belum Berhasil')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Demo Mode', style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            const Text('Pembayaran demo belum berhasil. Silakan coba lagi untuk melanjutkan dukunganmu.'),
            const SizedBox(height: 16),
            PrimaryButton(label: 'Coba Lagi', onPressed: () => context.go(nextRoute)),
          ],
        ),
      ),
    );
  }
}
