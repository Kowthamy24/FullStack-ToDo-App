TODO App – Backend

REST API for the TODO app, built with ASP.NET Core 10, Entity Framework Core and SQLite. The React frontend is in ../client.

The brief prefers Express + MongoDB but allows any backend and database. I chose ASP.NET Core because it's the stack I know best; the API contract matches the brief exactly. SQLite needs no database server, so the project runs with only the .NET SDK installed.

Setup and run

Prerequisite: .NET 10 SDK (dotnet --version should print 10.x).

From the repository root:

bash
dotnet run --project server/TodoApi

Wait for Now listening on: http://localhost:5167, then open http://localhost:5167/api/todos. You should see []. Press Ctrl+C to stop.

To test the endpoints, use TodoApi/TodoApi.http (VS Code REST Client extension, Visual Studio or Rider) or Postman.

Database connection notes (SQLite instead of MongoDB)
No setup needed. On startup, the API runs EF Core migrations, which create the database file and the Todos table automatically.
Location: server/TodoApi/todos.db (excluded from Git).
Connection string: appsettings.json → ConnectionStrings:TodoDb (default Data Source=todos.db). Override it with the environment variable ConnectionStrings__TodoDb.
Reset data: stop the API, delete todos.db*, and start it again.
Switching to SQL Server: add the Microsoft.EntityFrameworkCore.SqlServer package, replace UseSqlite with UseSqlServer in Program.cs, update the connection string and regenerate the migration. The model and controller stay the same.
API endpoints
Method	Endpoint	Description
GET	/api/todos	Get all TODOs (newest first)
POST	/api/todos	Create a TODO: { "title", "description"? }
PUT	/api/todos/{id}	Update title and description
PATCH	/api/todos/{id}/done	Toggle done status (no body)
DELETE	/api/todos/{id}	Delete a TODO

Validation: title is required (max 200 characters), description is optional (max 1000). Errors return 400 or 404 as standard ProblemDetails JSON.

Assumptions
Single user, no login, since the brief doesn't mention users.
PUT replaces both title and description; leaving out the description clears it.
PATCH toggles the status on the server and updates updatedAt.
Ids are auto-increment integers instead of MongoDB string _ids.
Limitations
No authentication, pagination or automated tests (tested manually with the .http file).
HTTP only, for local development.
CORS allows only http://localhost:5173 (configurable via ClientOrigin in appsettings.json).
SQLite suits a single-server, low-traffic app; use SQL Server or PostgreSQL for production scale.