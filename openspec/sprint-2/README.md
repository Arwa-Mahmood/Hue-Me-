# Sprint 2 (parked work)

Sprint 1 covers only SRS user stories US1-US10 (see `openspec/changes/sprint-1-*`). Everything here was planned earlier but belongs to Sprint 2 (SRS US11+). It is kept so the work is not lost, and it is **not** part of any Sprint 1 task list. At Sprint 2 planning, turn these into `openspec/changes/sprint-2-*` changes.

| Item | Owner (proposed) | File | Supports |
| --- | --- | --- | --- |
| Product and shade catalogue, admin CRUD, CSV import, public listing | P3 Ayesha | `products-catalog-contract.md`, `product-catalog-spec.md` | US11-US13 shade matching |
| `delta_e` (CIE76) and CSV LAB enrichment CLI | P1 Arwa | `cv-additions.md` | US11-US13 shade matching |
| Shared shade dataset | to assign | `shade-data.md` | US11-US13 shade matching |
| Fixed admin account (seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD`, never overwritten on restart, can use forgot/reset) and admin role checks | P2 Eshaal | this file | Admin product management, UC17 manage users |
| Admin screens (product, shade, CSV import, user management) and product browsing | P4 Momina | this file | Admin use cases |

## Notes carried over from Sprint 1 planning

- The `role` field (`user` / `admin`) already exists in Sprint 1's `users` table and JWT, so adding the admin account needs no schema change. In Sprint 1 every account has role `user`.
- Admin account requirement (draft): one admin whose email and initial password come from environment variables, not stored in the repository; the admin can use forgot-password and reset; a restart never overwrites a changed admin password; the admin account cannot be deleted through `DELETE /auth/me`.
- Dev-only identity header for admin testing: `X-Dev-Role: admin`, only with `AUTH_MODE=mock` in development or test.
- Test cases to write for Sprint 2 (removed from the Sprint 1 list): product/shade CRUD, admin 401/403, validation and duplicates, list filters and pagination, CSV import (valid, re-import, bad row), `delta_e` properties, CSV enrichment (valid, determinism, bad rows), catalogue and admin screens, admin login and admin password reset, admin imports a CSV produced by the enrichment script.
- Sprint 1 code lives in `/backend/profile`; the catalogue gets its own folder (proposal: `/backend/products`).
