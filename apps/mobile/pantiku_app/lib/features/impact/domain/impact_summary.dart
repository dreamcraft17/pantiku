class ImpactSummary {
  ImpactSummary({
    required this.mode,
    required this.isDemo,
    required this.totalChildrenSupported,
    required this.totalOrphanages,
    required this.totalCampaigns,
    required this.totalProductsSold,
    required this.totalDonationsAmount,
    this.message,
  });

  final String mode;
  final bool isDemo;
  final int totalChildrenSupported;
  final int totalOrphanages;
  final int totalCampaigns;
  final int totalProductsSold;
  final int totalDonationsAmount;
  final String? message;
}
