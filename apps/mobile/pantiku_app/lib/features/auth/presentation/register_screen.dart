import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/analytics/analytics_service.dart';
import '../../../core/widgets/app_toast.dart';
import '../../../core/widgets/primary_button.dart';
import '../data/auth_repository.dart';
import '../../../shared/providers.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _managerNameCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _skillsCtrl = TextEditingController();
  final _cityCtrl = TextEditingController();
  final _orphanageNameCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  final _provinceCtrl = TextEditingController();
  final _contactPhoneCtrl = TextEditingController();
  final _estimatedChildrenCtrl = TextEditingController();
  AuthAccountType _accountType = AuthAccountType.donor;
  bool _isLoading = false;
  String? _error;

  @override
  void dispose() {
    _nameCtrl.dispose();
    _managerNameCtrl.dispose();
    _emailCtrl.dispose();
    _passCtrl.dispose();
    _phoneCtrl.dispose();
    _skillsCtrl.dispose();
    _cityCtrl.dispose();
    _orphanageNameCtrl.dispose();
    _addressCtrl.dispose();
    _provinceCtrl.dispose();
    _contactPhoneCtrl.dispose();
    _estimatedChildrenCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _isLoading = true;
      _error = null;
    });
    try {
      final result = await ref.read(authRepositoryProvider).register(
            RegisterRequest(
              accountType: _accountType,
              email: _emailCtrl.text.trim(),
              password: _passCtrl.text,
              fullName: _accountType != AuthAccountType.orphanageManager ? _nameCtrl.text.trim() : null,
              managerName: _accountType == AuthAccountType.orphanageManager ? _managerNameCtrl.text.trim() : null,
              phone: _phoneCtrl.text.trim().isEmpty ? null : _phoneCtrl.text.trim(),
              skills: _accountType == AuthAccountType.volunteer && _skillsCtrl.text.trim().isNotEmpty ? _skillsCtrl.text.trim() : null,
              city: _cityCtrl.text.trim().isEmpty ? null : _cityCtrl.text.trim(),
              orphanageName: _accountType == AuthAccountType.orphanageManager ? _orphanageNameCtrl.text.trim() : null,
              address: _accountType == AuthAccountType.orphanageManager ? _addressCtrl.text.trim() : null,
              province: _accountType == AuthAccountType.orphanageManager ? _provinceCtrl.text.trim() : null,
              contactPhone: _accountType == AuthAccountType.orphanageManager ? _contactPhoneCtrl.text.trim() : null,
              estimatedChildrenCount: _accountType == AuthAccountType.orphanageManager ? int.tryParse(_estimatedChildrenCtrl.text.trim()) : null,
            ),
          );
      final token = result.$1;
      ref.read(tokenProvider.notifier).state = token;
      await ref.read(analyticsServiceProvider).track(
            AnalyticsEvent.register,
            payload: {'email': _emailCtrl.text.trim(), 'accountType': _accountType.name},
          );
      if (mounted) {
        if (_accountType == AuthAccountType.orphanageManager) {
          showSuccessToast(
            context,
            result.$2 ??
                'Pendaftaran panti berhasil dikirim. Tim Pantiku akan melakukan verifikasi sebelum campaign dapat dibuat.',
          );
        } else {
          showSuccessToast(context, 'Registrasi berhasil. Selamat bergabung.');
        }
        context.go('/home');
      }
    } catch (_) {
      setState(() {
        _error = 'Registrasi gagal. Silakan coba lagi.';
      });
      if (mounted) showErrorToast(context, 'Registrasi gagal. Silakan coba lagi.');
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
      appBar: AppBar(title: const Text('Daftar')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              const Align(
                alignment: Alignment.centerLeft,
                child: Text('Pilih tipe akun dan jadi bagian dari gerakan panti berdaya.'),
              ),
              const SizedBox(height: 12),
              SegmentedButton<AuthAccountType>(
                segments: const [
                  ButtonSegment(value: AuthAccountType.donor, label: Text('Donatur')),
                  ButtonSegment(value: AuthAccountType.orphanageManager, label: Text('Pengelola Panti')),
                  ButtonSegment(value: AuthAccountType.volunteer, label: Text('Relawan')),
                ],
                selected: {_accountType},
                onSelectionChanged: (selection) => setState(() => _accountType = selection.first),
              ),
              const SizedBox(height: 12),
              if (_accountType != AuthAccountType.orphanageManager)
                TextFormField(
                  controller: _nameCtrl,
                  decoration: const InputDecoration(labelText: 'Nama'),
                  validator: (value) {
                    if (value == null || value.trim().isEmpty) return 'Nama wajib diisi.';
                    if (value.trim().length < 2) return 'Nama minimal 2 karakter.';
                    return null;
                  },
                ),
              if (_accountType == AuthAccountType.orphanageManager) ...[
                TextFormField(
                  controller: _managerNameCtrl,
                  decoration: const InputDecoration(labelText: 'Nama Pengelola'),
                  validator: (value) => (value == null || value.trim().length < 2) ? 'Nama pengelola wajib diisi.' : null,
                ),
                TextFormField(
                  controller: _phoneCtrl,
                  decoration: const InputDecoration(labelText: 'Nomor Telepon Pengelola'),
                  validator: (value) => (value == null || value.trim().length < 6) ? 'Nomor telepon wajib diisi.' : null,
                ),
                TextFormField(
                  controller: _orphanageNameCtrl,
                  decoration: const InputDecoration(labelText: 'Nama Panti'),
                  validator: (value) => (value == null || value.trim().length < 2) ? 'Nama panti wajib diisi.' : null,
                ),
                TextFormField(
                  controller: _addressCtrl,
                  decoration: const InputDecoration(labelText: 'Alamat'),
                  validator: (value) => (value == null || value.trim().length < 5) ? 'Alamat wajib diisi.' : null,
                ),
                TextFormField(
                  controller: _cityCtrl,
                  decoration: const InputDecoration(labelText: 'Kota'),
                  validator: (value) => (value == null || value.trim().length < 2) ? 'Kota wajib diisi.' : null,
                ),
                TextFormField(
                  controller: _provinceCtrl,
                  decoration: const InputDecoration(labelText: 'Provinsi'),
                  validator: (value) => (value == null || value.trim().length < 2) ? 'Provinsi wajib diisi.' : null,
                ),
                TextFormField(
                  controller: _contactPhoneCtrl,
                  decoration: const InputDecoration(labelText: 'Kontak Panti'),
                  validator: (value) => (value == null || value.trim().length < 6) ? 'Kontak panti wajib diisi.' : null,
                ),
                TextFormField(
                  controller: _estimatedChildrenCtrl,
                  decoration: const InputDecoration(labelText: 'Estimasi Jumlah Anak'),
                  keyboardType: TextInputType.number,
                  validator: (value) => ((int.tryParse(value ?? '') ?? 0) <= 0) ? 'Estimasi jumlah anak wajib diisi.' : null,
                ),
              ],
              if (_accountType == AuthAccountType.donor)
                TextFormField(
                  controller: _phoneCtrl,
                  decoration: const InputDecoration(labelText: 'Nomor Telepon (Opsional)'),
                ),
              if (_accountType == AuthAccountType.volunteer) ...[
                TextFormField(
                  controller: _phoneCtrl,
                  decoration: const InputDecoration(labelText: 'Nomor Telepon (Opsional)'),
                ),
                TextFormField(
                  controller: _skillsCtrl,
                  decoration: const InputDecoration(labelText: 'Keahlian (Opsional)'),
                ),
                TextFormField(
                  controller: _cityCtrl,
                  decoration: const InputDecoration(labelText: 'Kota (Opsional)'),
                ),
              ],
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
                label: _isLoading ? 'Memproses...' : 'Daftar',
                onPressed: _isLoading ? () {} : _submit,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
