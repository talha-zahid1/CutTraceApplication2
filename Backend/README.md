# CutTrace Backend

The backend is a Django 5.2 REST API. The Django project is `config`, and the main application, models, serializers, migrations, and API views live in `app1`.

## Requirements

- Python 3.10 or newer
- Dependencies listed in `requirements.txt`

## Local setup

From the `Backend/` directory:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The development API runs at `http://127.0.0.1:8000/`. Django admin is at `/admin/`. Create an admin account with `python manage.py createsuperuser` if needed.

## Main data areas

- User profiles and roles
- Fabric quality and fabric intake
- Production batches and fabric-to-batch usage
- Ready-to-manufacture assignments and manufactured products
- Production standards and suspicious-product investigations
- Ready-to-deliver records and delivered products

Models are in `app1/models.py`; schema changes are represented by `app1/migrations/`.

## API routes

Routes are registered in `app1/urls.py` and included at the project root by `config/urls.py`.

| Area | Routes |
| --- | --- |
| Authentication and profile | `api/token/`, `api/token/refresh/`, `register/`, `logout/`, `profile_api/`, `update_profile_api/` |
| Fabric and batches | `fabric_in_api/`, `product_batches_api/`, `batch_entries_api/`, `batch_quantities_api/` |
| Production | `ready_to_manufacture_api/`, `manufacturing_api/`, `testing_api/`, `production_standards_api/` |
| Quality and delivery | `suspicious_products_api/`, `ready_to_deliver_api/`, `delivered_products_api/` |
| Reports and inspection | `production_pipeline/`, `inspection_values_api/`, `fabric_quality_api/`, `suspicious_batches_satistics_api/`, `delivered_product_statistics_api/`, `overall_production_satistics_api/` |

Most data routes require a JWT bearer access token. Obtain token pairs with `POST /api/token/` and refresh access tokens with `POST /api/token/refresh/`. Registration is provided at `POST /register/`. Several write operations also check admin permissions; see the corresponding view in `app1/Views/` for method-level access rules.

## Configuration and database

`config/settings.py` currently configures SQLite (`db.sqlite3`), Django REST Framework JWT authentication, and CORS for `http://localhost:5173`. It loads `SECRET_KEY`, `DEBUG`, and `ALLOWED_HOSTS` from `Backend/.env` using `python-decouple`; environment variables supplied by the hosting environment take precedence. Copy `.env.example` to `.env` and replace the placeholder secret for a new local setup. `DEBUG` is parsed as a boolean and comma-separated hosts are parsed as a list. Defaults remain available (`DEBUG=True`, hosts `127.0.0.1,localhost`) if those values are omitted. The frontend API base URL is configured separately as `VITE_API_URL` in `Frontend/.env`.

The backend `.env` is local configuration and is excluded from Git; `.env.example` is intended to be committed. Supply a strong unique `SECRET_KEY`, set `DEBUG=False`, and configure production hosts before deploying. Never use the development fallback key or `DEBUG=True` in production.

## Tests

Run the test suite from `Backend/` with:

```powershell
python manage.py test
```

## API contract reference

All routes below are mounted at the API root, so with the local server the full URL is `http://127.0.0.1:8000/<route>`. JSON is used for request and response bodies. Unless called out as public, send `Authorization: Bearer <access>` and `Content-Type: application/json`. IDs are integer primary keys. Model-backed `GET` responses serialize decimals as JSON strings and dates as ISO-8601 strings.

### Authentication and account

| Method and route | Request body | Successful response and behavior |
| --- | --- | --- |
| `POST /api/token/` | `{ "username": "...", "password": "..." }` | SimpleJWT returns `{ "refresh": "...", "access": "..." }`. Credentials are Django username/password. |
| `POST /api/token/refresh/` | `{ "refresh": "..." }` | `{ "access": "..." }`; refresh token lifetime is 7 days and access lifetime is 30 minutes. |
| `POST /register/` (public) | `{ "username": "...", "email": "name@example.com", "password": "...", "mobile_no": "..." }` | `{ "status": true, "message": "User Rigestered", "data": { "user_id": 1, "username": "...", "email": "...", "access_token": "...", "refresh_token": "..." } }`. Duplicate username returns 400. Serializer requires username, valid email, password; profile creation also expects `mobile_no`. Registration does not expose a role field. |
| `GET /profile_api/` | None | `{ "status": true, "message": "Profile retrieved successfully", "data": { "id": 1, "full_name": "...", "email": "...", "phone": "...", "role": "normal_user" } }`. |
| `PATCH /update_profile_api/` | Any subset of `{ "full_name": "...", "email": "...", "phone": "...", "role": "normal_user|admin|owner" }` | `{ "status": true, "message": "Profile updated successfully", "data": { "id", "full_name", "email", "phone", "role" } }`. `role` is intended to be owner-only; serializer rejects it for other roles. `full_name` updates `User.username`; `phone` maps to profile mobile number. |
| `POST /logout/` | `{ "refresh": "..." }` | `{ "message": "Logout successful" }`; the refresh token is blacklisted. Missing/invalid refresh returns 400. |

Registration uses `user_serializer` for the account fields and `UserProfile` for `mobile_no` (maximum 11 characters). The model declares roles `normal_user`, `admin`, and `owner`. Django password validators are configured in settings, but the registration serializer does not explicitly invoke password validation, so do not assume the UI's password rules are server-enforced.

### Fabric intake and batches

| Method and route | Request body | Successful response and behavior |
| --- | --- | --- |
| `GET /fabric_in_api/` | None | `{ "status": true, "message": "success", "data": [FabricIn] }`, newest ID first. `FabricIn` fields: `fabric_in_id`, `supplier_name`, `receiver_name`, `quantity_kg`, `fabric_quality` (quality name string), `total_cost`, `price_per_kg`, `color`, `received_at`, `notes`. |
| `GET /fabric_in_api/<id>/` | None | The route parameter is named `fabric_in_id`, but the view mistakenly interprets it as a **batch ID** and serializes that batch's related fabric. Do not use this as a fabric detail lookup; use the list endpoint until the route implementation is corrected. |
| `POST /fabric_in_api/` | `{ "supplier_name": "...", "receiver_name": "...", "quantity_kg": "12.50", "fabric_quality": "Cotton", "total_cost": "500", "price_per_kg": "40", "color": "Blue", "notes": "optional" }` | `{ "status": true, "message": "Successfull" }`. A new quality row is created when the supplied name does not match one case-insensitively. Required fields follow the model; `notes` alone is optional/blankable. |
| `PUT /fabric_in_api/<fabric_in_id>/` | Full FabricIn writable fields as above | `{ "status": true, "message": "entry Updated" }`. This is a full update, not partial. |
| `DELETE /fabric_in_api/<fabric_in_id>/` | None | `{ "status": true, "message": "Entry Deleted Successfully" }`. |
| `GET /product_batches_api/` | None | `{ "status": true, "data": [Batch] }`. Each object includes `batch_id`, `current_stage`, `current_status`, `created_at`, `updated_at`, and computed `fabric_in_ids: [{ "fabric_in_id": 1, "quantity_used": "..." }]`. |
| `GET /product_batches_api/<batch_id>/` | None | `{ "status": true, "data": Batch }`; missing batch is 404. |
| `POST /product_batches_api/` | `{ "current_stage": "...", "current_status": "...", "fabric_in_ids": [{ "fabric_in_id": 1, "quantity_used": "10.00" }] }` | `{ "status": true, "message": "Batch Added" }`. At least one fabric entry is required. The nested entries require valid existing fabric and batch foreign keys plus `quantity_used`. |
| `PUT /product_batches_api/<batch_id>/` | Same full shape as POST | `{ "status": true, "message": "Batch Updated" }`. Requires at least one entry and replaces all existing fabric links. |
| `DELETE /product_batches_api/<batch_id>/` | None | `{ "status": true, "message": "Batch Deleted" }`; cascade rules remove linked batch-fabric and production records where configured. |
| `GET /batch_entries_api/` | None | `{ "status": true, "data": [{ "batch_id": 1, "total_quantity_kg": "..." }] }`; authenticated aggregate of fabric quantity used per batch. |
| `GET /batch_quantities_api/` | None | Same aggregate data shape as `/batch_entries_api/`; this alias is implemented in `BatcFabricIn_api.py`. |

Fabric intake model limits: supplier and receiver names 50 characters, quantity/cost/price decimal fields 2 places, color 50 characters, notes unrestricted text. Batch stage and status are 20-character strings. `quantity_used` is a decimal with 2 places. These fields have no explicit minimum/positive validators in the model, so nonnegative business constraints are not guaranteed by this API.

### Manufacturing, quality control, and delivery

| Method and route | Request body | Successful response and behavior |
| --- | --- | --- |
| `GET /ready_to_manufacture_api/` and `GET /ready_to_manufacture_api/<id>/` | None | `{ "status": true, "data": [ReadyManufacture] }` or one object. Object fields are `ready_manufacture_id`, `batch_id`, `master_name`, `tailor_name`, `delivery_boy_name`, `final_product_name`, `fabric_quantity_kg`, `fabric_quality`, `color`, `assigned_at`, `updated_at`, `status`, `notes`. |
| `POST /ready_to_manufacture_api/` | All writable fields above, excluding generated ID and timestamps | `{ "status": true, "message": <serialized record> }`. Required values follow model fields, including existing batch and fabric-quality IDs. |
| `PUT /ready_to_manufacture_api/<id>/` | Full writable record | `{ "status": true, "message": "product <id> Updated" }`; only records whose status is `pending` (case-insensitive) may be changed. |
| `DELETE /ready_to_manufacture_api/<id>/` | None | Soft-cancels a pending assignment by setting `status` to `Cancelled`; it does not delete the row. |
| `GET /manufacturing_api/` and `GET /manufacturing_api/<id>/` | None | `{ "status": true, "data": [ManufacturedProduct] }` or a single object. Fields: `manufactured_id`, `batch_id`, `ready_to_manufacture_id`, `master_name`, `tailor_name`, `receiver_name`, `original_quantity_kg`, `fabric_quality`, `wastage_kg`, computed `wastage_percentage`, `final_product_name`, `final_product_quantity`, computed `final_product_percentage`, `manufactured_at`, `status`, `notes`. |
| `POST /manufacturing_api/` | Writable fields above, excluding ID, timestamp, and computed percentages; `status` is optional | `{ "status": true, "message": "success", "data": <serialized record> }`. Percentages are calculated as wastage/original input and final output/original input, rounded to 2 places. Missing status defaults to `pending`. |
| `PUT /manufacturing_api/<id>/` | Full writable record | `{ "status": true, "message": "Product Updated" }`; percentages are recalculated. |
| `DELETE /manufacturing_api/<id>/` | None | Soft-cancels only a pending item (`status` becomes `cancelled`). Other statuses return 400. |
| `POST /testing_api/` | `{ "manufactured_id": 1 }` | Pass returns `{ "status": true, "message": "Testing Successful", "data": { "tested_product_quantity": ..., "tested_wastage_kg": ..., "actual_product_quantity": ..., "actual_wastage_kg": ... } }` and creates a ready-to-deliver record. Fail returns `{ "status": true, "message": "Product flagged as suspicious" }` and creates a suspicious record. Missing product, standards, or ID returns 400. Testing compares actual output and wastage to standard-scaled expected values using a fixed +/- 5 kg window. |
| `GET /suspicious_products_api/` and `GET /suspicious_products_api/<id>/` | None | `{ "status": true, "data": [SuspiciousProduct] }` or a single object. Fields are defined by `suspicious_products` in `models.py`: IDs, actual/expected quantities and percentages, `reason`, `detected_at`, `investigation_status`, and `remarks`. |
| `PUT /suspicious_products_api/<id>/` | Any partial subset of writable suspicious fields | `{ "status": true, "message": "suspicious product updated", "data": <record> }`. Updates are refused after status becomes `Rejected`, `Resolved`, or `Confirmed` (case-insensitive). |
| `GET /ready_to_deliver_api/` and `GET /ready_to_deliver_api/<id>/` | None | `{ "status": true, "message": "success", "data": [ReadyToDeliver] }` or a single object. Fields: `ready_to_deliver_id`, `manufactured_id`, `batch_id`, `final_product_name`, `quantity`, `fabric_quality`, `final_product_percentage`, `wastage_kg`, `wastage_percentage`, `prepared_at`, `status`, `notes`. |
| `PUT /ready_to_deliver_api/<id>/` | Partial ReadyToDeliver fields | `{ "status": true, "message": "success", "data": <record> }`. There is no POST or DELETE handler on this route; passing quality testing creates the record. |
| `GET /delivered_products_api/` | None | `{ "status": true, "message": "Success", "data": [Delivery] }`; returns only the latest five. Empty response currently uses a string in `data`. |
| `GET /delivered_products_api/<delivery_id>/` | None | `{ "status": true, "message": "Success", "data": <Delivery> }`. |
| `POST /delivered_products_api/` | `{ "ready_to_deliver_id": 1, "delivery_boy_name": "...", "purchaser_name": "...", "total_sale_price": "...", "price_per_item": "...", "original_cost": "...", "other_expenses": "...", "notes": "..." }` | `{ "status": true, "message": "The product is delivered" }`. Batch, quantity, item name, quality, and ready ID are taken from the ready-to-deliver record. The record must have status `Ready`. `total_cost` and `net_profit` are computed; caller-supplied values are ignored/read-only. |
| `PUT /delivered_products_api/<delivery_id>/` | Partial delivery fields | `{ "status": true, "message": "Product Updated" }`; costs/profit are recomputed from original cost, expenses, and sale price. |
| `DELETE /delivered_products_api/<delivery_id>/` | None | `{ "status": true, "message": "entry deleted" }`. |

The manufacturing and delivery model decimal precision and maximum lengths are declared in `app1/models.py`. In particular, ready-to-deliver and delivered quantities and percentages use 2 decimal places with `max_digits=5`; larger values can fail serializer validation. Most free-text notes and names are required unless the serializer marks them optional. Related IDs must reference existing rows.

### Standards, lookups, and reports

| Method and route | Request body | Response |
| --- | --- | --- |
| `GET /production_standards_api/` | None | `{ "status": true, "data": [Standard] }`; Standard fields: `standard_id`, `fabric_quality`, `final_product_name`, `standard_total_weight`, `standard_final_product_quantity`, `standard_wastage_quantity`, timestamps. |
| `POST /production_standards_api/` | `{ "fabric_quality": 1, "final_product_name": "Shirt", "standard_total_weight": "10.000", "standard_final_product_quantity": "8.000", "standard_wastage_quantity": "2.000" }` | `{ "status": true, "message": "success", "data": <standard> }`. Values are decimal fields with 3 places and 5 digits maximum. |
| `PUT /production_standards_api/<id>/` | Full Standard writable fields | `{ "status": true, "message": "standard updated" }`. |
| `DELETE /production_standards_api/<id>/` | None | `{ "status": true, "message": "Standard deleted" }`. |
| `GET /fabric_quality_api/` | None | `{ "status": true, "data": [{ "quality_id": 1, "name": "Cotton" }] }`; each name is unique and max 100 chars. There is no public create route; intake can create a quality by name. |
| `GET /production_pipeline/` | None | `{ "status": true, "message": "success", "data": { "total_fabric_inkg", "batches_in", "ready_to_manufacture_batches", "manufactured_count", "manufactured_quantity", "testing_suspicious_count", "testing_passed_count", "testing_count", "ready_to_deliver_count", "ready_to_deliver_quantity", "delivered_count", "delivered_quantity" } }`. |
| `GET /inspection_values_api/` | None | `{ "status": true, "data": [{ "fabric_quality__name", "expected_wastage_percentage", "actual_wastage_percentage", "expected_final_product_quantity", "actual_final_product_quantity" }] }`; values are averages grouped by quality for suspicious records. |
| `GET /suspicious_batches_satistics_api/` | None | `{ "status": true, "data": { "total_suspicious_batches", "total_mismatched_percentage", "rejected_products", "resolved_products", "total_mismatched_products", "suspicious_batches_by_quality", "suspicious_batches_by_name" } }`. |
| `GET /delivered_product_statistics_api/` | None | `{ "status": true, "data": { "total_products_delivered", "total_sales", "total_cost", "total_expenses", "total_profit", "total_delivery_by_purchaser", "delivery_by_status" } }`. |
| `GET /overall_production_satistics_api/` | None | `{ "status": true, "message": "success", "data": { "total_fabric_received", "fabric_used", "total_products_manufactured", "total_wastage", "total_wastage_percentage", "total_passed", "total_failed", "products_by_name", "products_by_quality", "production_effeciency", "production_status", "passing_percentage" } }`. Field spellings shown are the wire names. |

All lookup and report endpoints above are GET-only and require authentication. Aggregate numeric values may be integers, floating point numbers, or decimal strings depending on the database aggregation; consumers should parse them as numbers where charting is needed.

### Constraints, permissions, and known behavior

- The API does not define pagination, filtering, or ordering query parameters; list endpoints return their full queryset except delivered-products, which returns five newest rows.
- Validation is primarily Django REST Framework `ModelSerializer` validation against model field types, `max_length`, decimal precision, required fields, foreign keys, and unique constraints. There are no general business-rule validators for positive quantities or costs.
- Authenticated reads use JWT. Several write views return `IsAdmin()` for non-GET methods. The current custom permission class implements `has_perm()` rather than DRF's `has_permission()`, so its intended admin restriction is not actually enforced by DRF. Fix this before relying on server-side role-based write access.
- Some missing-record branches return HTTP 200 with `status: false` or `status: true`; callers must inspect both HTTP status and the response body's `status`/`message`. Serializer validation generally returns HTTP 400 with field-keyed `error` or `errors`.
- Endpoint spellings contain legacy typos (`satistics`, `effeciency`, `total_fabric_inkg`) and are part of the current API contract.
- JWT blacklist support is installed and logout blacklists refresh tokens. The frontend keeps access and refresh tokens in `localStorage`.
