# TODO App – Frontend (React)

React app for managing TODOs, built with React 19 and Vite. It talks to the ASP.NET Core API in ../server over HTTP.

Features: view, add, edit, mark done/undone and delete TODOs. Completed TODOs are faded with a strikethrough. Includes form validation, loading and error states, and optimistic updates for toggle and delete.
Setup and run

Prerequisites:

Node.js 20.19+ or 22.12+ (node --version)
The backend API running on http://localhost:5167 (see ../server/README.md)

From the repository root:

bash
# Terminal 1: start the API
dotnet run --project server/TodoApi

# Terminal 2: install and start the frontend
cd client
npm install
npm run dev

Open http://localhost:5173.

Other scripts: npm run build (production build), npm run preview (serve the build), npm run lint.

API address: defaults to http://localhost:5167. To change it, copy .env.example to .env, set VITE_API_URL, and restart npm run dev.

Assumptions
Single user, no login, since the brief doesn't mention authentication.
The app runs on port 5173 (fixed), because the API's CORS setting only allows that origin.

Validation matches the API: title required (max 200 characters), description optional (max 1000). The API remains the source of truth.

Toggle and delete update the screen immediately and roll back if the API call fails. Create and edit wait for the API, since the server assigns the id.
Marking done/undone counts as an update and changes the "Updated" date.
Limitations
No confirmation before deleting.
No real-time sync: changes made elsewhere appear only after a page refresh.
No pagination, search or filtering.
No automated tests; tested manually in the browser.
Development setup only, with no deployment configuration.
In development, React StrictMode loads the list twice, so you'll see two GET /api/todos requests. This doesn't happen in a production build.
