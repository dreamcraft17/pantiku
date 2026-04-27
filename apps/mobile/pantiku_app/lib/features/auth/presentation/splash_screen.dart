import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../shared/providers.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    Future(() async {
      final token = await ref.read(tokenStorageProvider).getToken();
      if (!mounted) return;
      if (token != null && token.isNotEmpty) {
        ref.read(tokenProvider.notifier).state = token;
        context.go('/home');
      } else {
        context.go('/login');
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(child: Text('Pantiku\nAnak Bertumbuh, Panti Mandiri', textAlign: TextAlign.center)),
    );
  }
}
