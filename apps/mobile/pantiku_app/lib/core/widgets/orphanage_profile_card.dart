import 'package:flutter/material.dart';

class OrphanageProfileCard extends StatelessWidget {
  const OrphanageProfileCard({
    super.key,
    required this.name,
    required this.location,
    required this.description,
  });

  final String name;
  final String location;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(14),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Panti Berdaya', style: Theme.of(context).textTheme.labelMedium),
            const SizedBox(height: 4),
            Text(name, style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 4),
            Text(location),
            const SizedBox(height: 8),
            Text(description),
          ],
        ),
      ),
    );
  }
}
