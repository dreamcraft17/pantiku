import 'package:flutter/material.dart';

class PantikuCtaButton extends StatelessWidget {
  const PantikuCtaButton({super.key, required this.label, required this.onPressed});
  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) {
    return FilledButton(
      onPressed: onPressed,
      style: FilledButton.styleFrom(minimumSize: const Size(double.infinity, 48)),
      child: Text(label),
    );
  }
}
