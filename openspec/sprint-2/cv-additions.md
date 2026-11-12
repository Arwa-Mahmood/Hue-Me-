# CV additions for Sprint 2 (parked from Sprint 1)

Owner: P1 (Arwa). Moved out of `contracts/cv.md` so Sprint 1 covers only US1-US10. These support Sprint 2 shade matching (SRS US11-US13, close match at delta E <= 3.0). Section numbers below are from the old contract.

## 6. CIE76 distance

`delta_e(lab1, lab2) = sqrt((l1-l2)^2 + (a1-a2)^2 + (b1-b2)^2)`.

Use a numerically stable Euclidean norm as needed. The result is nonnegative, symmetric, and zero for identical values. Reject nonfinite inputs and a distance that cannot be represented as a finite float. Do not implement CIE94, CIEDE2000, palette ranking, matching, or a recommendation service in this sprint.

Planned evidence: identity; symmetry; `(50,0,0)` versus `(53,4,0)` equals `5.0` within `1e-12`; invalid inputs. Sprint 2 receives this primitive and contract, not a completed matching feature. (SRS DR2: Sprint 2 treats `delta_e <= 3.0` as a "close match".)

## 7. CSV enrichment boundary

A future CLI entrypoint will wrap `hex_to_lab`; **no CLI implementation exists or is added by this planning change**. P1 will implement and document a Windows-compatible invocation during implementation. This is I/O orchestration, not an additional public function. It supports the Sprint 2 shade database.

Canonical required input columns, in order: `brand,product_name,category,shade_name,hex,buy_link`.

- Every required field must be present and nonempty. Categories are exactly `foundation`, `concealer`, `lipstick`, `blush`; reject other spellings/case rather than silently rewriting them. `buy_link` is preserved text; do not fetch URLs or require network access.
- Preserve all input rows, row order, original column order, original field values (including the source `hex` spelling), and any additional source columns. The six canonical columns must occupy the leading positions in the stated order. Do not normalize or overwrite the source CSV hex; normalization applies at analysis/profile boundaries.
- Append exactly `lab_l,lab_a,lab_b`. Reject an input header already containing any of those output columns, duplicate headers, malformed row widths/CSV, or missing/out-of-order canonical columns. Do not overwrite or duplicate a source column.
- Use UTF-8 CSV, standard quoted-field escaping, newline-safe handling on Windows, and a stable locale-independent float serialization. Source preservation is at parsed field level, not byte-for-byte preservation of quoting or line endings. Repeated successful runs on identical input under the same implementation must produce identical output bytes, without timestamps or random ordering.
- Validate the complete batch before publishing an output. Report all identifiable row errors in deterministic input order with record number, field, and reason; the header is record 1 and the first data record is 2, including when a quoted field contains a newline. For unrecoverable CSV syntax, report the parse location/reason without inventing subsequent records.
- On any validation/conversion/write failure, exit nonzero and publish no partial result; leave an existing destination unchanged. Write via a temporary sibling followed by atomic replacement only after success; remove temporary output on failure. Reject identical input/output paths before writing. Diagnostics go to stderr; do not silently skip rows. A valid header-only input may produce an output header with the three appended columns.
- Batch acceptance evidence includes every allowed category, extra source columns and quoted text, normalization without source mutation, deterministic repeat runs, multiple bad rows, malformed headers/CSV, preexisting destination preservation, and simulated write failure.

