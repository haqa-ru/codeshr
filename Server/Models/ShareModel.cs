namespace Server.Models; 

public class ShareModel {
    public string Code { get; set; } = null!;
    public string Language { get; set; } = null!;
    public bool Secure { get; set; }
    public string? Id { get; set; }
    public string? Secret { get; set; }
    public DateTime? Date { get; set; }
}