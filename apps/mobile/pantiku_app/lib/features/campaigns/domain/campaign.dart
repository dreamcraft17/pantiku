class Campaign {
  Campaign({
    required this.id,
    required this.title,
    required this.orphanage,
    required this.collected,
    required this.goal,
  });

  final String id;
  final String title;
  final String orphanage;
  final int collected;
  final int goal;
}
