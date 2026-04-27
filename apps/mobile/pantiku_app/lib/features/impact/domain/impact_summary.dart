class ImpactSummary {
  ImpactSummary({
    required this.totalChildrenSupported,
    required this.totalOrphanages,
    required this.totalCampaigns,
    required this.totalProductsSold,
    required this.totalDonationsAmount,
    required this.growthTotalChildrenSupported,
    required this.growthTotalOrphanages,
    required this.growthTotalCampaigns,
    required this.growthTotalProductsSold,
    required this.growthTotalDonationsAmount,
  });

  final int totalChildrenSupported;
  final int totalOrphanages;
  final int totalCampaigns;
  final int totalProductsSold;
  final int totalDonationsAmount;
  final int growthTotalChildrenSupported;
  final int growthTotalOrphanages;
  final int growthTotalCampaigns;
  final int growthTotalProductsSold;
  final int growthTotalDonationsAmount;
}
