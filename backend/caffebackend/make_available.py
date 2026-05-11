import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["caffee_db"]
products_collection = db["products"]

product_names = [
    "Classic Butter Croissant",
    "Pineapple Upside-Down Cake",
    "Rainbow Cake"
]

for name in product_names:
    result = products_collection.update_one(
        {"name": name},
        {"$set": {"is_available": True}}
    )
    if result.matched_count > 0:
        print(f"Set to AVAILABLE: {name}")
    else:
        print(f"Product not found: {name}")

print("Update complete!")
