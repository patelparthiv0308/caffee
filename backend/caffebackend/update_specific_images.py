import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["caffee_db"]
products_collection = db["products"]

updates = [
    {
        "name": "Aether Ceramic Mug",
        "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800"
    },
    {
        "name": "Dark Chocolate Brownie",
        "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800"
    },
    {
        "name": "Carrot Cake",
        "image": "https://images.unsplash.com/photo-1607330289024-1535c6b4e1c1?q=80&w=800"
    }
]

for update in updates:
    result = products_collection.update_one(
        {"name": update["name"]},
        {"$set": {"image": update["image"]}}
    )
    if result.matched_count > 0:
        print(f"Updated image for: {update['name']}")
    else:
        print(f"Product not found: {update['name']}")

print("Update complete!")
