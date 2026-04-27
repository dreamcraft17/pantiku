import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/analytics/analytics_service.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../shared/providers.dart';

class DonationScreen extends ConsumerStatefulWidget {
  const DonationScreen({super.key, required this.campaignId});
  final String campaignId;

  @override
  ConsumerState<DonationScreen> createState() => _DonationScreenState();
}

class _DonationScreenState extends ConsumerState<DonationScreen> {
  final _nominalCtrl = TextEditingController(text: '50000');
  bool _loading = false;

  @override
  void dispose() {
    _nominalCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Donasi')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Bantu Wujudkan Program Produktif'),
            const SizedBox(height: 6),
            Text('Referensi campaign: ${widget.campaignId}'),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: [25000, 50000, 100000, 250000]
                  .map((amount) => ActionChip(
                        label: Text('Rp${amount.toString()}'),
                        onPressed: () => _nominalCtrl.text = amount.toString(),
                      ))
                  .toList(),
            ),
            const SizedBox(height: 8),
            TextField(controller: _nominalCtrl, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Nominal Donasi (IDR)')),
            const SizedBox(height: 16),
            PrimaryButton(
              label: _loading ? 'Memproses...' : 'Dukung Sekarang',
              onPressed: () async {
                if (_loading) return;
                      final amount = int.tryParse(_nominalCtrl.text) ?? 0;
                      if (amount <= 0) {
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Nominal dukungan belum valid.')));
                        return;
                      }
                      setState(() => _loading = true);
                      ref.read(analyticsServiceProvider).track(
                      AnalyticsEvent.completeDonation,
                      payload: {'campaignId': widget.campaignId, 'amount': amount},
                    );
                      try {
                        final session = await ref.read(paymentRepositoryProvider).createDonation(
                              campaignId: widget.campaignId,
                              amount: amount,
                            );
                        if (!context.mounted) return;
                        final encodedUrl = Uri.encodeComponent(session.paymentUrl);
                        context.go('/demo-payment?paymentId=${session.paymentId}&paymentUrl=$encodedUrl&type=donation');
                      } catch (_) {
                        if (!context.mounted) return;
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Gagal membuat pembayaran demo.')));
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
