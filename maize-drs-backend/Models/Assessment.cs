public class Assessment
{
    public int Id { get; set; }
    public string ImageName { get; set; } = string.Empty;
    public string Base64Image { get; set; } = string.Empty;
    public string CropStage { get; set; } = string.Empty;
    public string LeafFeeding { get; set; } = string.Empty;
    public string ShotHoles { get; set; } = string.Empty;
    public string Lesions { get; set; } = string.Empty;
    public int LarvaeCount { get; set; }
    public int Score { get; set; }
    public string Description { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}
