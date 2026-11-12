## ADDED Requirements

### Requirement: Admin product management
The system SHALL let an admin add, edit and remove products with brand, product name and category (`foundation`, `concealer`, `lipstick` or `blush`), and SHALL refuse these actions for anyone else.

#### Scenario: Admin creates a product
- **WHEN** an admin posts a valid product
- **THEN** the response is 201 with the product

#### Scenario: Non-admin refused
- **WHEN** a non-admin calls an admin route
- **THEN** the response is 403, or 401 if unauthenticated

#### Scenario: Invalid category
- **WHEN** the category is not one of the four allowed values
- **THEN** the response is 422 and nothing is saved

#### Scenario: Duplicate product
- **WHEN** a product with the same brand, name and category exists
- **THEN** the response is 409

#### Scenario: Delete cascades
- **WHEN** an admin deletes a product
- **THEN** its shades are also removed

### Requirement: Admin shade management
The system SHALL let an admin add, edit and remove shades with shade name, hex and buy link, SHALL store hex as uppercase `#RRGGBB`, and SHALL compute LAB on the server.

#### Scenario: Shade added with LAB
- **WHEN** an admin adds a shade with a valid hex
- **THEN** the stored shade has a LAB value computed by the server and any client-sent LAB is ignored

#### Scenario: Hex edit recomputes LAB
- **WHEN** an admin changes a shade's hex
- **THEN** the LAB value is recomputed

#### Scenario: Invalid hex or link
- **WHEN** the hex is malformed or the buy link is not an http or https URL
- **THEN** the response is 422

### Requirement: Product listing
The system SHALL list products with their shades, filterable by category, brand and text search, with pagination.

#### Scenario: Filter by category
- **WHEN** a client requests `category=lipstick`
- **THEN** only lipstick products are returned and `total` matches

#### Scenario: Unknown product
- **WHEN** a client requests an id that does not exist
- **THEN** the response is 404

### Requirement: CSV import
The system SHALL import products and shades from a CSV with columns `brand,product_name,category,shade_name,hex,buy_link` through an admin endpoint and a script sharing one implementation, and SHALL import nothing if any row is invalid.

#### Scenario: Valid import
- **WHEN** an admin uploads a valid CSV
- **THEN** products and shades are created and the counts are returned

#### Scenario: Re-import
- **WHEN** the same file is imported again
- **THEN** no duplicates are created and the skipped count is reported

#### Scenario: Invalid row
- **WHEN** any row is invalid
- **THEN** the response is 422 listing each row error and nothing is imported

#### Scenario: Enriched file
- **WHEN** the file includes P1's `lab_l,lab_a,lab_b` columns
- **THEN** the server recomputes LAB and warns if values differ by more than 0.05

### Requirement: Development identity is restricted
The system SHALL accept the `X-Dev-User-Id` header only when `AUTH_MODE=mock` and the environment is development or test, and SHALL never fall back to it when a real token is invalid.

#### Scenario: Header outside development
- **WHEN** the environment is not development or test and the header is sent
- **THEN** the request is treated as unauthenticated

#### Scenario: Mock mode refused in production
- **WHEN** the service starts with `AUTH_MODE=mock` in another environment
- **THEN** it refuses to start
