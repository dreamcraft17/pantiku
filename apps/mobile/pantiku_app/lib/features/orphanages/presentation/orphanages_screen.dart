import 'package:flutter/material.dart';
import '../../../core/widgets/orphanage_profile_card.dart';

class OrphanagesScreen extends StatelessWidget {
  const OrphanagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Panti Berdaya')),
      body: ListView(
        padding: const EdgeInsets.all(12),
        children: const [
          OrphanageProfileCard(
            name: 'Panti Jakarta Utara',
            location: 'Jakarta Utara',
            description: 'Program keterampilan menjahit dan kuliner untuk penguatan kemandirian.',
          ),
          OrphanageProfileCard(
            name: 'Panti Jakarta Timur',
            location: 'Jakarta Timur',
            description: 'Program literasi digital dan kerajinan kreatif berbasis karya.',
          ),
        ],
      ),
    );
  }
}
