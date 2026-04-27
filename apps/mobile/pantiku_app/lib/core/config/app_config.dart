class AppConfig {
  const AppConfig({required this.useMockData});
  final bool useMockData;
}

const appConfig = AppConfig(useMockData: true);
