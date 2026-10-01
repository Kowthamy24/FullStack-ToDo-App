using Microsoft.EntityFrameworkCore;
using TodoApi.Data;

var builder = WebApplication.CreateBuilder(args);

// ---- Services (dependency injection registrations) ----

builder.Services.AddControllers();

// Errors (404s, unhandled exceptions) are returned as standard
// ProblemDetails JSON, so the React app can always read a message.
builder.Services.AddProblemDetails();

// EF Core with SQLite. The connection string lives in appsettings.json.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("TodoDb")));

// CORS: the React dev server runs on a different port, and browsers block
// cross-origin requests unless the API explicitly allows that origin.
const string ClientCorsPolicy = "Client";
var clientOrigin = builder.Configuration["ClientOrigin"] ?? "http://localhost:5173";
builder.Services.AddCors(options =>
    options.AddPolicy(ClientCorsPolicy, policy =>
        policy.WithOrigins(clientOrigin).AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

// ---- Database ----

// Apply any pending EF Core migrations on startup. This creates the SQLite
// file and the Todos table the first time the app runs, so no manual
// database setup is needed.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// ---- HTTP request pipeline ----

app.UseExceptionHandler();
app.UseCors(ClientCorsPolicy);
app.MapControllers();

app.Run();
