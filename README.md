# CutTrace

**Garment Factory Production Tracking and Fraud Prevention Application**

CutTrace is a full-stack web application (Django REST Framework + React) that helps garment factory owners track fabric and production from intake through delivery, surfacing discrepancies before they turn into real losses.

A recurring fraud pattern in garment manufacturing involves substituting lower-value products for higher-value ones while still billing at the original price. Without a reliable way to trace fabric usage end to end, these substitutions typically go undetected. CutTrace addresses this by following every batch of fabric through its full production lifecycle — **Fabric In → Production Batch → Ready to Manufacture → Manufacturing → Testing → Ready to Deliver → Delivered** — and automatically comparing actual output and wastage against configured production standards at the testing stage. Any result that falls outside the acceptable range is automatically flagged as **suspicious** for investigation, removing the need for manual, day-to-day spot checks.

The system enforces three role levels to keep production data accurate and accountable:

- **Owner** — Has full visibility across all modules and is the only role authorized to assign or revoke Admin privileges. Owners can also investigate, edit, and resolve entries in the Suspicious Products module; all other modules are view-only for this role.
- **Admin** — Has full create, read, update, and delete (CRUD) access across all operational modules, including fabric intake, production batches, manufacturing, testing, deliveries, and standards.
- **User** — Has read-only access across all modules, allowing visibility into production activity without the ability to modify records.

Dashboards and reports give the Owner a real-time view of fabric usage, wastage, testing outcomes, deliveries, and profitability — without requiring a physical visit to the factory floor.

## Project Structure

```text
CutTraceApplication2/
├── Backend/     Django REST API, data models, and migrations
└── Frontend/    React single-page application built with Vite
```

For setup instructions and further detail, see:

- [Frontend guide](Frontend/README.md)
- [Backend guide](Backend/README.md)

## Requirements

- Python 3.10 or newer
- Node.js and npm

## Running Locally

**1. Start the API** (in one terminal):

```powershell
cd Backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**2. Start the web app** (in a second terminal):

```powershell
cd Frontend
npm install
npm run dev
```

Open the URL Vite prints in the terminal (typically `http://localhost:5173`). The frontend reads its API base URL from `VITE_API_URL` — set this to `http://127.0.0.1:8000` in `Frontend/.env` for local development, and restart Vite after any change to this file.

## Application Flow

The system records fabric intake and quality, groups incoming fabric into production batches, and tracks each batch through manufacturing and testing. Production results are automatically validated against configured standards, with mismatches routed to the Suspicious Products module for investigation. Products that pass testing proceed to Ready to Deliver and, ultimately, Delivered. Dashboard and report pages summarize production, suspicious activity, and delivery performance across the system.

## Data and Configuration

The project currently uses SQLite (`Backend/db.sqlite3`) for local development, with JWT-based authentication via Django REST Framework and CORS configured for the local Vite origin. Django reads `SECRET_KEY`, `DEBUG`, and `ALLOWED_HOSTS` from `Backend/.env`; copy `Backend/.env.example` as a starting point and set a unique secret. Vite reads its API URL from `Frontend/.env`. Both local env files are ignored by Git, while the examples remain trackable. Configure a secure secret, `DEBUG=False`, and production hosts before deployment. The schema is defined through Django migrations, and the checked-in SQLite file holds local development data only.

## Development Commands

| Context  | Command             | Description            |
|----------|---------------------|-------------------------|
| Backend  | `python manage.py runserver` | Start the API server |
| Backend  | `python manage.py migrate`   | Apply database migrations |
| Backend  | `python manage.py test`      | Run backend test suite |
| Frontend | `npm run dev`                | Start the development server |
| Frontend | `npm run build`              | Build for production |
| Frontend | `npm run lint`                | Run linter |
| Frontend | `npm run preview`            | Preview a production build |

Run backend commands from `Backend/` and frontend commands from `Frontend/`.
## Author

**Muhammad Talha**
Software Engineering Student, UBIT — University of Karachi
