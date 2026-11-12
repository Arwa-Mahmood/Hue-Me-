## Context

`openspec/contracts/cv.md` already fixes the formulas, types, error behaviour and CSV rules. This design only covers how P1 organises the code and what is still open.

## Goals / Non-Goals

**Goals**
- Pure, deterministic functions with no I/O, so they are trivial to test and to import from the backend.
- A CLI that is safe to run on a shared dataset (all-or-nothing output).

**Non-Goals**
- Anything in the proposal's Non-goals list.

## Decisions

- **Layout (proposed):**
  - `cv/types.py`: `Lab`, `ItaResult`, `Depth` (frozen dataclasses and an enum)
  - `cv/color.py`: `hex_to_lab`
  - `cv/ita.py`: `calculate_ita`
  - `cv/season.py`: `classify_undertone`, `map_season`
  - `cv/distance.py`: `delta_e`
  - `cv/__init__.py`: re-exports the five functions and the types
  - `cv/bulk.py`: CSV enrichment, run with `python -m cv.bulk in.csv out.csv`
  - `tests/`: pytest unit tests
- **No dependencies** beyond the standard library for the core (`math`, `csv`, `dataclasses`, `enum`). `pytest` for tests only. Implementing the formulas directly keeps the contract exact and the package light.
- **Undertone and season rules** are plain data (a version identifier plus thresholds and a table) kept in one module, so approved Day 1 values change in one place with the tests.
- **CSV safety:** validate everything first, write to a temp file next to the target, then atomically replace. Details are in `cv.md` section 7.

## Risks / Trade-offs

- **Undertone thresholds are not scientifically established.** Mitigation: label them as a team heuristic, store the version, and keep fixtures as agreed examples. Risk is a late change; the data-driven layout limits the cost.
- **Season table is a draft.** Same mitigation.
- **Exact-zero ITA cases** are conventions, documented in the contract and tested with constructed Lab values.
- **P3 starts before the rules are approved.** Mitigation: P3 uses a dummy with the same signature; the signatures never depend on the rule values.

## Migration Plan

New code, nothing to migrate. Once approved, replace `undertone-v1-pending` and `season-v1-draft` in `cv.md` with the final identifiers.

## Open Questions

- Undertone thresholds and fixtures (Day 1, blocking).
- Season table cells (Day 1).
- Python version to target (proposal: 3.11+).
