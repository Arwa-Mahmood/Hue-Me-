# CSV bulk script (later)import csv
import sys
from color import hex_to_lab

def add_lab(src, dst):
    with open(src, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fields = list(reader.fieldnames) + ["L", "a", "b"]
        rows = list(reader)

    good, bad = [], []
    for line, row in enumerate(rows, start=2):
        try:
            L, a, b = hex_to_lab(row["hex"])
            row["L"], row["a"], row["b"] = round(L, 2), round(a, 2), round(b, 2)
            good.append(row)
        except (ValueError, KeyError):
            bad.append(line)

    with open(dst, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        writer.writerows(good)

    print(f"Done: {len(good)} rows written, {len(bad)} bad rows")
    if bad:
        print("Fix these CSV lines:", bad)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 add_lab.py input.csv output.csv")
        sys.exit(1)
    add_lab(sys.argv[1], sys.argv[2])