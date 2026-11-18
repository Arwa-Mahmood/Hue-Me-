from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .database import get_db_connection

app = FastAPI(title="Hue&Me Admin API")

# --- SCHEMAS ---
class ShadeCreate(BaseModel):
    shade_name: str
    shade_hex: str
    lab_l: float
    lab_a: float
    lab_b: float
    undertone: str | None = None

class ProductCreate(BaseModel):
    brand: str
    name: str
    category: str
    product_type: str
    buy_link: str | None = None
    shades: list[ShadeCreate]

# --- ROUTES ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Hue&Me Admin API"}

@app.post("/admin/products", status_code=201)
def add_product(product: ProductCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # 1. Insert Product
        cursor.execute(
            """INSERT INTO products (brand, name, category, product_type, buy_link) 
               VALUES (%s, %s, %s, %s, %s) RETURNING product_id;""",
            (product.brand, product.name, product.category, product.product_type, product.buy_link)
        )
        product_id = cursor.fetchone()[0]
        
        # 2. Insert Shades
        for shade in product.shades:
            cursor.execute(
                """INSERT INTO product_shades 
                   (product_id, shade_name, shade_hex, lab_l, lab_a, lab_b, undertone) 
                   VALUES (%s, %s, %s, %s, %s, %s, %s);""",
                (product_id, shade.shade_name, shade.shade_hex, shade.lab_l, shade.lab_a, shade.lab_b, shade.undertone)
            )
            
        conn.commit()
        return {"message": "Product added successfully", "product_id": product_id}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()