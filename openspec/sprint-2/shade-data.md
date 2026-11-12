# Shared product database (Sprint 2)

Data for Sprint 2 shade matching (SRS US11-US13: foundation, concealer, lipstick and blush matched with delta E, close match at delta E <= 3.0). Not part of Sprint 1. Owner to be assigned at Sprint 2 planning: ____

## One CSV format

```
brand,product_name,category,shade_name,hex,buy_link
```

- `category`: `foundation`, `concealer`, `lipstick` or `blush`.
- `hex`: `#RRGGBB` or `RRGGBB`.
- One row per shade. File lives in `/data/shades.csv` (create the folder when you start).
- Do not add LAB by hand. P1's (Arwa's) bulk script appends `lab_l,lab_a,lab_b`. P3's (Ayesha's) importer loads the file.

## Scope

- 3 to 4 brands that people actually buy locally (SRS target audience: primarily South Asia).
- 8 to 10 shades for each of foundation, concealer, lipstick and blush, per brand where the brand sells it.

## Steps

1. Check what Makeup API and Open Beauty Facts (both free, no auth, named in the SRS) already provide before collecting anything by hand. Note licence terms and whether hex values exist.
2. Where the brand gives no hex, take it from the product swatch image with a colour picker. Sample the swatch centre, avoid highlights and shadows, and note the source.
3. Fill in the CSV and add a row to the source log below.
4. Run P1's (Arwa's) bulk script. Hand the enriched file to P3 (Ayesha) to import.
5. Spot-check ten shades: does the displayed LAB look right for the swatch?

## Source log

| Brand | Source (URL or "swatch image") | Licence or permission | Hex method | Collected by | Date |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Quality checks before import

- No empty fields. Valid hex. Allowed category only.
- No duplicate `(brand, product_name, category, shade_name)`.
- Buy links open.
