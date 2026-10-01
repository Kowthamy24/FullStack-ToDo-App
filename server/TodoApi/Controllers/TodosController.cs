using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.Dtos;
using TodoApi.Models;

namespace TodoApi.Controllers;

// [ApiController] 
[ApiController]
[Route("api/todos")]
public class TodosController : ControllerBase
{
    private readonly AppDbContext _db;

    // AppDbContext is supplied by dependency injection (registered in Program.cs).
    public TodosController(AppDbContext db)
    {
        _db = db;
    }

    // GET /api/todos
    [HttpGet]
    public async Task<ActionResult<List<Todo>>> GetAll()
    {
        // ordering by Id descending shows the newest first.
        var todos = await _db.Todos
            .AsNoTracking()
            .OrderByDescending(t => t.Id)
            .ToListAsync();

        return todos;
    }

    // POST /api/todos
    [HttpPost]
    public async Task<ActionResult<Todo>> Create(TodoRequest request)
    {
        var now = DateTimeOffset.UtcNow;
        var todo = new Todo
        {
            Title = request.Title.Trim(),
            Description = CleanDescription(request.Description),
            Done = false,
            CreatedAt = now,
            UpdatedAt = now,
        };

        _db.Todos.Add(todo);
        await _db.SaveChangesAsync();

        return StatusCode(StatusCodes.Status201Created, todo);
    }

    // PUT /api/todos/5
    [HttpPut("{id:int}")]
    public async Task<ActionResult<Todo>> Update(int id, TodoRequest request)
    {
        var todo = await _db.Todos.FindAsync(id);
        if (todo is null)
        {
            return NotFound();
        }

        todo.Title = request.Title.Trim();
        todo.Description = CleanDescription(request.Description);
        todo.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();

        return todo;
    }

    // PATCH /api/todos/5/done  (no body: the server flips the current value)
    [HttpPatch("{id:int}/done")]
    public async Task<ActionResult<Todo>> ToggleDone(int id)
    {
        var todo = await _db.Todos.FindAsync(id);
        if (todo is null)
        {
            return NotFound();
        }

        todo.Done = !todo.Done;
        todo.UpdatedAt = DateTimeOffset.UtcNow;
        await _db.SaveChangesAsync();

        return todo;
    }

    // DELETE /api/todos/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var todo = await _db.Todos.FindAsync(id);
        if (todo is null)
        {
            return NotFound();
        }

        _db.Todos.Remove(todo);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    // Store a blank description as null so "no description" has one representation.
    private static string? CleanDescription(string? description) =>
        string.IsNullOrWhiteSpace(description) ? null : description.Trim();
}
