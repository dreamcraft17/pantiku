enum AnalyticsEvent {
  viewCampaign,
  clickDonate,
  completeDonation,
  viewProduct,
  buyProduct,
  register,
  login,
}

abstract class AnalyticsService {
  Future<void> track(AnalyticsEvent event, {Map<String, dynamic>? payload});
}

class MockAnalyticsService implements AnalyticsService {
  @override
  Future<void> track(AnalyticsEvent event, {Map<String, dynamic>? payload}) async {
    // Vendor-agnostic abstraction, replace with GA/PostHog/Mixpanel later.
    // ignore: avoid_print
    print('[analytics] ${event.name} ${payload ?? {}}');
  }
}
