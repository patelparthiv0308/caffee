import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["caffee_db"]
products_collection = db["products"]
orders_collection = db["orders"]
settings_collection = db["settings"]

