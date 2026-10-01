namespace TodoApi.Models;

public class Todo
{
    public const int TitleMaxLength = 200;
    public const int DescriptionMaxLength = 1000;

    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool Done { get; set; }

    // DateTimeOffset keeps the UTC offset, so the JSON sent to the browser
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}
