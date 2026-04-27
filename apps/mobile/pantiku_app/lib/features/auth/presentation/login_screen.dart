import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/analytics/analytics_service.dart';
import '../../../core/widgets/app_toast.dart';
import '../../../core/widgets/primary_button.dart';
import '../../../shared/providers.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final token = await ref.read(authRepositoryProvider).login(email: _emailCtrl.text.trim(), password: _passCtrl.text);
      ref.read(tokenProvider.notifier).state = token;
      await ref.read(analyticsServiceProvider).track(
            AnalyticsEvent.login,
            payload: {'email': _emailCtrl.text.trim()},
          );
      if (mounted) {
        showSuccessToast(context, 'Login berhasil. Selamat datang kembali.');
        context.go('/home');
      }
    } catch (_) {
      setState(() {
        _error = 'Login gagal. Periksa email dan password.';
      });
      if (mounted) showErrorToast(context, 'Login gagal. Silakan coba lagi.');
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Masuk')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const Align(
                alignment: Alignment.centerLeft,
                child: Text('Masuk untuk mendukung kemandirian panti.', textAlign: TextAlign.left),
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _emailCtrl,
                decoration: const InputDecoration(labelText: 'Email'),
                validator: (value) {
                  if (value == null || value.trim().isEmpty) return 'Email wajib diisi.';
                  if (!value.contains('@')) return 'Format email tidak valid.';
                  return null;
                },
              ),
              TextFormField(
                controller: _passCtrl,
                decoration: const InputDecoration(labelText: 'Password'),
                obscureText: true,
                validator: (value) {
                  if (value == null || value.isEmpty) return 'Password wajib diisi.';
                  if (value.length < 8) return 'Password minimal 8 karakter.';
                  return null;
                },
              ),
              if (_error != null) ...[
                const SizedBox(height: 8),
                Text(_error!, style: const TextStyle(color: Colors.red)),
              ],
              const SizedBox(height: 16),
              PrimaryButton(
                label: _isLoading ? 'Memproses...' : 'Masuk',
                onPressed: _isLoading ? () {} : _submit,
              ),
              TextButton(onPressed: () => context.go('/register'), child: const Text('Belum punya akun? Daftar'))
            ],
          ),
        ),
      ),
    );
  }
}
