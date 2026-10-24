# CutTrace Frontend

The frontend is a React 19 single-page application built and served with Vite. It uses React Router for navigation, Axios for API requests, Tailwind CSS for utility styling, and Lucide icons.

## Requirements

- Node.js and npm
- The CutTrace Django API running locally for authenticated and data-backed pages

## Local setup

From the `Frontend/` directory:

```powershell
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

Create or update `Frontend/.env` with the API server URL:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

Vite exposes only variables prefixed with `VITE_` to browser code. Restart the dev server after changing `.env`.

## Features and pages

- Login, registration, protected routes, and account profile
- Dashboard with production overview and analytics
- Fabric intake and production batch management
- Ready-to-manufacture assignments and manufacturing records
- Suspicious product review and investigation
- Ready-to-deliver and delivered product tracking
- Production standards and testing
- Overall production, suspicious products, and delivered products reports

Routes and page composition are defined in `src/App.jsx`; navigation items are configured in `src/components/sidebarConfig.js`.

## Source layout

```text
src/
|-- Cards/       Dashboard and inspection cards
|-- components/  Navigation and protected-route components
|-- Context/     Shared API and authentication state
|-- Models/      Create, edit, and confirmation dialogs
|-- Pages/       Routed screens and reports
|-- services/    Axios client and token handling
`-- Tables/      Data tables for production records
```

The Axios client is in `src/services/auth.js`. It uses `VITE_API_URL`, attaches the stored access token to requests, and attempts to refresh an expired token. The API context stores the access token in browser local storage.

## Available commands

Run from `Frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

The backend API and its routes are documented in [Backend/README.md](../Backend/README.md). For full application setup, see the [project README](../README.md).

## Screen routes and API mapping

These are client-side paths; they do not include the API host. The login screen is `/`, registration is `/signup`, and all other screens are rendered inside the protected application shell.

| Browser path | Screen purpose | Main API data sources |
| --- | --- | --- |
| `/dashboard` | Production summary, charts, inspection values | `production_pipeline/`, `overall_production_satistics_api/`, `inspection_values_api/`, statistics endpoints |
| `/fabricin` | Browse, add, edit, delete fabric receipts | `fabric_in_api/`, `fabric_quality_api/` where needed |
| `/productionbatches` | Create and manage batches and fabric allocations | `product_batches_api/`, `batch_quantities_api/` |
| `/ready-to-manufacture` | Assign batch work and cancel pending assignments | `ready_to_manufacture_api/`, `product_batches_api/`, `fabric_quality_api/`, `batch_quantities_api/` |
| `/manufacturing` | Record and manage manufactured outputs | `manufacturing_api/`, `fabric_quality_api/` |
| `/testing` | Run standard checks and inspect outcomes | `testing_api/`, `overall_production_satistics_api/`, `suspicious_batches_satistics_api/`, `ready_to_deliver_api/`, `suspicious_products_api/` |
| `/suspicious-products` | Review flagged production and update investigations | `suspicious_products_api/` |
| `/ready-to-deliver` | Review passed production and edit delivery notes | `ready_to_deliver_api/`, `fabric_quality_api/` |
| `/delivered-products` | Record, update, and delete deliveries | `delivered_products_api/` |
| `/standards` | Manage expected output standards | `production_standards_api/`, `fabric_quality_api/` |
| `/reports/overall-production` | Production totals and breakdowns | `overall_production_satistics_api/` |
| `/reports/suspicious-products` | Investigation aggregates and quality/name breakdowns | `suspicious_batches_satistics_api/` |
| `/reports/delivered-products` | Sales, costs, expenses, profit, purchaser breakdown | `delivered_product_statistics_api/` |
| `/profile` | View and edit user account profile | `profile_api/`, `update_profile_api/` |

`/testing` and the report pages are defined in `App.jsx`; some routes may not appear in the sidebar. `ProtectedRoute` only checks whether an access-token string exists in local storage/context. It does not validate token expiry or role before displaying a screen; API authorization remains the source of truth.

## API client and authentication behavior

`src/services/auth.js` creates one Axios instance with `baseURL: import.meta.env.VITE_API_URL` and `withCredentials: true`. Callers pass API paths relative to that base URL. The request interceptor sends `Authorization: Bearer <access>` when a token has been set. `ApiContext` restores the access token from `localStorage` on page load, writes/removes it when state changes, and fetches the profile to populate the role.

The login form sends `{ "username": "...", "password": "..." }` to `POST api/token/`, then stores response `access` and `refresh` values. Signup sends `{ "username", "email", "mobile_no", "password" }` to `POST register/`; the confirmation password is validated in the browser and is not sent. Registration returns `data.access_token` and `data.refresh_token`, which are stored in local storage.

On a 401 from a non-auth request, the Axios response interceptor reads `refresh_token`, posts `{ "refresh": "..." }` to `api/token/refresh/`, updates the access token, and retries the failed request once. If refresh fails, it clears both tokens and navigates to `/login`. The app's login route is `/`; `/login` falls through to the wildcard protected route, which redirects unauthenticated users to `/`. Logout posts the refresh token to `logout/`, then clears local storage and app token state.

## Frontend forms and payload expectations

Forms submit JSON through the API client. The server's authoritative field validation and response structures are listed in [Backend API contract reference](../Backend/README.md#api-contract-reference). IDs passed in relationship fields must already exist in the backend database.

| UI form or action | Payload sent by the frontend | Notes |
| --- | --- | --- |
| Fabric intake | supplier, receiver, quantity in kg, quality name, total cost, price/kg, color, notes | Quality is submitted by name; backend creates the quality record if it does not already exist. |
| Production batch | current stage, current status, `fabric_in_ids: [{ fabric_in_id, quantity_used }]` | At least one fabric allocation is required. Editing replaces the batch's full allocation list. |
| Ready to manufacture | batch, master/tailor/delivery names, product name, fabric quantity, quality ID, color, status, notes | Generated assignment dates are supplied by the server. Cancel action calls DELETE, which soft-cancels pending records. |
| Manufacturing record | batch and assignment IDs, operator names, original input quantity, quality ID, wastage, product name, final output quantity, status, notes | Server computes wastage/output percentages; forms should treat these response fields as derived. |
| Run quality test | `{ "manufactured_id": <id> }` | Server looks up matching quality/product standard; passing creates ready-to-deliver, failing creates a suspicious investigation. |
| Suspicious investigation | Partial investigation fields, typically `investigation_status` and `remarks` | Resolved/confirmed/rejected investigations are locked by the backend. |
| Ready-to-deliver notes | Partial ready-to-deliver fields such as status/notes | The ready record itself is created by a passing test, not by this screen. |
| Delivered product | Ready-to-deliver ID, delivery and purchaser names, sale amount, item price, original cost, other expenses, notes | Batch/item/quantity/quality come from the ready record; backend computes total cost and net profit. |
| Production standard | quality ID, product name, standard total weight, expected output quantity, expected wastage quantity | API decimal fields use three decimal places and max five digits. |
| Profile update | Partial `full_name`, `email`, `phone` values | Backend maps full name to username and phone to profile mobile number. Role is not part of normal profile editing. |

The UI generally displays server errors from `message`, `detail`, or `error` fields and uses field validation feedback where available. API list responses are typically wrapped in `{ status, data }`; record mutation endpoints often return `{ status, message }`. A few endpoints have inconsistent empty and error shapes, as detailed in the backend guide, so a screen should not assume every `data` value is always an array.

## Styling and assets

Global styles are in `src/index.css`, application styles in `src/App.css`, and most component styles use Tailwind classes through the Vite Tailwind plugin. Brand artwork is under `src/assets/`; static icons and favicon are under `public/`.
