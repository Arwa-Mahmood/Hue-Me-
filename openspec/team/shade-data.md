# Shared product database (early-finisher task)

Whoever finishes their own tasks first picks this up. P1 will probably be first because the CV logic is small. Put your name here when you start: ____

## One CSV format

```
brand,product_name,category,shade_name,hex,buy_link
```

- `category`: `foundation`, `concealer`, `lipstick` or `blush`.
- `hex`: `#RRGGBB` or `RRGGBB`.
- One row per shade. File lives in `/data/shades.csv` (create the folder when you start).
- Do not add LAB by hand. P1's bulk script appends `lab_l,lab_a,lab_b`. P3's importer loads the file.

## Scope

- 3 to 4 brands that people actually buy locally.
- 8 to 10 shades for each of foundation, concealer, lipstick and blush, per brand where the brand sells it.

## Steps

1. Check what Makeup API and Open Beauty Facts already provide before collecting anything by hand. Note licence terms and whether hex values exist.
2. Where the brand gives no hex, take it from the product swatch image with a colour picker. Sample the swatch centre, avoid highlights and shadows, and note the source.
3. Fill in the CSV and add a row to the source log below.
4. Run P1's bulk script. Hand the enriched file to P3 to import.
5. Spot-check ten shades: does the displayed LAB look right for the swatch?

## Source log

| Brand | Source (URL or "swatch image") | Licence or permission | Hex method | Collected by | Date |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## Quality checks before import

- No empty fields. Valid hex. Allowed category only.
- No duplicate `(brand, product_name, category, shade_name)`.
- Buy links open.
