import 'package:flutter/material.dart';
import '../../shared/formatters.dart';

class ImpactStatCard extends StatelessWidget {
  const ImpactStatCard({
    super.key,
    required this.label,
    this.value,
    this.numericValue,
    this.isCurrency = false,
    this.icon,
  });

  final String label;
  final String? value;
  final int? numericValue;
  final bool isCurrency;
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            if (icon != null) ...[
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Theme.of(context).colorScheme.primary.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: Theme.of(context).colorScheme.primary),
              ),
              const SizedBox(width: 12),
            ],
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label, style: Theme.of(context).textTheme.labelLarge?.copyWith(color: Colors.black87)),
                  const SizedBox(height: 6),
                  if (numericValue != null)
                    TweenAnimationBuilder<double>(
                      tween: Tween<double>(begin: 0, end: numericValue!.toDouble()),
                      duration: const Duration(milliseconds: 900),
                      curve: Curves.easeOutCubic,
                      builder: (context, animated, _) {
                        final number = animated.round();
                        final text = isCurrency ? formatRupiah(number) : number.toString();
                        return Text(
                          text,
                          style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
                        );
                      },
                    )
                  else
                    Text(
                      value ?? '0',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(fontWeight: FontWeight.w700),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
