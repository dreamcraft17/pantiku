import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../shared/providers.dart';

class DemoPaymentScreen extends ConsumerStatefulWidget {
  const DemoPaymentScreen({
    super.key,
    required this.paymentId,
    required this.paymentUrl,
    required this.referenceType,
  });

  final String paymentId;
  final String paymentUrl;
  final String referenceType;

  @override
  ConsumerState<DemoPaymentScreen> createState() => _DemoPaymentScreenState();
}

class _DemoPaymentScreenState extends ConsumerState<DemoPaymentScreen> {
  bool _loading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Pembayaran Demo')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Demo Mode', style: TextStyle(fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            const Text('Lanjutkan simulasi pembayaran untuk menyelesaikan proses dukunganmu.'),
            const SizedBox(height: 12),
            Text('Payment ID: ${widget.paymentId}', style: const TextStyle(fontSize: 12)),
            const SizedBox(height: 4),
            Text('Payment URL: ${Uri.decodeComponent(widget.paymentUrl)}', style: const TextStyle(fontSize: 12)),
            const SizedBox(height: 16),
            PrimaryButton(
              label: _loading ? 'Memproses...' : 'Simulasikan Pembayaran Berhasil',
              onPressed: () async {
                if (_loading) return;
                      setState(() => _loading = true);
                      try {
                        await ref.read(paymentRepositoryProvider).simulateSuccess(widget.paymentId);
                        ref.invalidate(impactSummaryProvider);
                        ref.invalidate(impactStoriesProvider);
                        if (!context.mounted) return;
                        context.go('/payment-success?type=${widget.referenceType.toLowerCase()}');
                      } catch (_) {
                        if (!context.mounted) return;
                        context.go('/payment-failed?type=${widget.referenceType.toLowerCase()}');
                      } finally {
                        if (mounted) setState(() => _loading = false);
                      }
                    },
            ),
          ],
        ),
      ),
    );
  }
}
