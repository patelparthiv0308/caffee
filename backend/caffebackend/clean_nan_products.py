import pymongo
import math

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["caffee_db"]
products_collection = db["products"]

# Find products where price is NaN or null
products = list(products_collection.find())
to_delete = []

for p in products:
    name = p.get('name', 'Unnamed')
    price = p.get('price')
    
    # Check if price is NaN
    is_nan = False
    try:
        if price is None or (isinstance(price, float) and math.isnan(price)):
            is_nan = True
    except:
        pass
        
    if is_nan or name == 'nan' or name is None:
        to_delete.append(p['_id'])
        print(f"Marked for deletion: {name} (Price: {price})")

if to_delete:
    result = products_collection.delete_many({"_id": {"$in": to_delete}})
    print(f"Successfully deleted {result.deleted_count} invalid products.")
else:
    print("No products with NaN values found.")
