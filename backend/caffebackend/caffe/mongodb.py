import os
import pymongo
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get("MONGODB_URI", "mongodb://localhost:27017/")
client = pymongo.MongoClient(MONGO_URI)
db = client["caffee_db"]
products_collection = db["products"]
orders_collection = db["orders"]
settings_collection = db["settings"]
