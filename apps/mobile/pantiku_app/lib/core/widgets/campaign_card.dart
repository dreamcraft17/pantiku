import 'package:flutter/material.dart';
import '../../features/campaigns/domain/campaign.dart';
import '../../shared/formatters.dart';

class CampaignCard extends StatelessWidget {
  const CampaignCard({super.key, required this.campaign, required this.onTap});

  final Campaign campaign;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final progress = campaign.goal == 0 ? 0.0 : campaign.collected / campaign.goal;
    return Card(
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.all(14),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Campaign Produktif', style: Theme.of(context).textTheme.labelMedium),
              const SizedBox(height: 4),
              Text(campaign.title, style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 4),
              Text(campaign.orphanage),
              const SizedBox(height: 10),
              LinearProgressIndicator(value: progress.clamp(0, 1)),
              const SizedBox(height: 8),
              Text('${formatRupiah(campaign.collected)} dari ${formatRupiah(campaign.goal)}'),
            ],
          ),
        ),
      ),
    );
  }
}
