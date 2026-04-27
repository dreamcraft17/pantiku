import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/widgets/primary_button.dart';

class PaymentSuccessScreen extends StatelessWidget {
  const PaymentSuccessScreen({super.key, required this.type});

  final String type;

  @override
  Widget build(BuildContext context) {
    final message = type == 'order'
        ? 'Terima kasih. Pembelianmu mendukung karya panti.'
        : 'Terima kasih. Dukunganmu membantu panti membangun kemandirian.';

    return Scaffold(
      appBar: AppBar(title: const Text('Pembayaran Berhasil')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Demo Mode', style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            Text(message),
            const SizedBox(height: 16),
            PrimaryButton(label: 'Lihat Dampak Nyata', onPressed: () => context.go('/impact')),
          ],
        ),
      ),
    );
  }
}
