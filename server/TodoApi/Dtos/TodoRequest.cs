using System.ComponentModel.DataAnnotations;
using TodoApi.Models;

namespace TodoApi.Dtos;

public class TodoRequest
{
    // [Required] also rejects empty and whitespace-only strings.
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(Todo.TitleMaxLength, ErrorMessage = "Title must be 200 characters or fewer.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(Todo.DescriptionMaxLength, ErrorMessage = "Description must be 1000 characters or fewer.")]
    public string? Description { get; set; }
}
