import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["caffee_db"]
products_collection = db["products"]

# The hardcoded items from MenuPreview.jsx
allMenuItems = [
  { "id": 1, "name": "Aether Signature Blend", "price": 450.00, "desc": "Notes of dark cocoa, toasted nuts, and a subtle berry finish.", "image": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=600&auto=format&fit=crop", "category": "Coffee At Home" },
  { "id": 2, "name": "Velvet Flat White", "price": 500.00, "desc": "Silky micro-foam poured over a double shot of our espresso.", "image": "/velvet_flat_white.png", "category": "Drinks,Bestseller" },
  { "id": 3, "name": "Midnight Cold Brew", "price": 550.00, "desc": "Steeped for 18 hours for maximum smoothness and caffeine.", "image": "/midnight_cold_brew.png", "category": "Drinks" },
  { "id": 4, "name": "Almond Butter Croissant", "price": 350.00, "desc": "Flaky, buttery pastry filled with sweet almond cream.", "image": "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=600&auto=format&fit=crop", "category": "Food" },
  { "id": 5, "name": "Artisan Avocado Toast", "price": 650.00, "desc": "Fresh avocado, cherry tomatoes, and microgreens on sourdough.", "image": "/artisan_avocado_toast.png", "category": "Food" },
  { "id": 6, "name": "Matcha Green Tea Latte", "price": 425.00, "desc": "Premium ceremonial grade matcha with steamed oat milk.", "image": "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?q=80&w=600&auto=format&fit=crop", "category": "Drinks" },
  { "id": 7, "name": "Caramel Macchiato", "price": 475.00, "desc": "Freshly steamed milk with vanilla-flavored syrup marked with espresso.", "image": "/caramel_macchiato.png", "category": "Drinks,Bestseller" },
  { "id": 8, "name": "Mocha Truffle Cake", "price": 550.00, "desc": "Dense chocolate cake topped with espresso ganache.", "image": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=600&auto=format&fit=crop", "category": "Cake" },
  { "id": 10, "name": "Grilled Cheese Panini", "price": 600.00, "desc": "Aged cheddar and gruyere perfectly melted on rustic artisanal bread.", "image": "https://images.unsplash.com/photo-1475090169767-40ed8d18f67d?q=80&w=600&auto=format&fit=crop", "category": "Food" },
  { "id": 11, "name": "Hazelnut Cortado", "price": 350.00, "desc": "Equal parts espresso and warm milk with a hint of roasted hazelnut.", "image": "/hazelnut_cortado.png", "category": "Drinks" },
  { "id": 12, "name": "Lemon Blueberry Muffin", "price": 250.00, "desc": "Zesty lemon batter folded with fresh wild blueberries.", "image": "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?q=80&w=600&auto=format&fit=crop", "category": "Food" },
  { "id": 13, "name": "Aether Ceramic Mug", "price": 850.00, "desc": "Minimalist matte black ceramic mug with engraved logo.", "image": "https://images.unsplash.com/photo-1577937932623-fa6c771aa1e2?q=80&w=600&auto=format&fit=crop", "category": "Merchandise" },
  { "id": 14, "name": "Single Origin Beans (Ethiopia)", "price": 1200.00, "desc": "250g of freshly roasted whole beans with floral notes.", "image": "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=600&auto=format&fit=crop", "category": "Coffee At Home" },
  { "id": 15, "name": "Cappuccino", "price": 400.00, "desc": "A perfect balance of espresso, steamed milk and frothy foam.", "image": "/cappuccino.png", "category": "Bestseller,Drinks" },
  { "id": 16, "name": "Double Chocolate Chip Frappuccino", "price": 550.00, "desc": "Mocha flavored sauce, chocolaty chips, milk and ice topped with whipped cream.", "image": "/double_choco_frappuccino.png", "category": "Bestseller,Drinks" },
  { "id": 17, "name": "Caffe Americano", "price": 350.00, "desc": "Espresso shots topped with hot water create a light layer of crema.", "image": "/caffe_americano.png", "category": "Bestseller,Drinks" },
  { "id": 18, "name": "Java Chip Frappuccino", "price": 500.00, "desc": "Mocha sauce and Frappuccino chips blended with milk and ice.", "image": "/java_chip_frappuccino.png", "category": "Bestseller,Drinks" },
  { "id": 19, "name": "Cold Coffee", "price": 400.00, "desc": "A classic rich espresso blended with ice and cold creamy milk.", "image": "/cold_coffee.png", "category": "Bestseller,Drinks" },
  { "id": 20, "name": "Hazelnut Oat Iced Shaken Espresso", "price": 450.00, "desc": "Espresso shaken with hazelnut syrup and ice, topped with creamy oat milk.", "image": "/hazelnut_oat_iced_shaken_espresso.png", "category": "Drinks" },
  { "id": 21, "name": "Brown Sugar Cinnamon Iced Shaken Espresso", "price": 450.00, "desc": "Espresso shaken with brown sugar and cinnamon, topped with oat milk.", "image": "/cold_coffee.png", "category": "Drinks" },
  { "id": 22, "name": "Honey Almond Flat White", "price": 420.00, "desc": "Bold espresso with steamed almond milk and a touch of sweet honey.", "image": "/honey_almond_flat_white.png", "category": "Drinks" },
  { "id": 23, "name": "Honey Oat Flat White", "price": 420.00, "desc": "Bold espresso perfectly balanced with steamed oat milk and honey.", "image": "/velvet_flat_white.png", "category": "Drinks" },
  { "id": 24, "name": "Blonde Almond Latte", "price": 400.00, "desc": "Smooth blonde espresso lightly sweetened and paired with almond milk.", "image": "/blonde_almond_latte.png", "category": "Drinks" },
  { "id": 25, "name": "Hazelnut Oat Cortado", "price": 380.00, "desc": "Equal parts espresso and oat milk with a rich roasted hazelnut finish.", "image": "/hazelnut_oat_cortado.png", "category": "Drinks" },
  { "id": 26, "name": "Doppio Espresso", "price": 250.00, "desc": "Two shots of our signature rich, dark espresso.", "image": "/doppio_espresso.png", "category": "Drinks" },
  { "id": 27, "name": "Flat White", "price": 400.00, "desc": "Smooth ristretto shots of espresso poured with velvety steamed milk.", "image": "/velvet_flat_white.png", "category": "Drinks" },
  { "id": 28, "name": "Iced Caffè Americano", "price": 300.00, "desc": "Espresso shots topped with water and poured over ice.", "image": "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=600&auto=format&fit=crop", "category": "Drinks" },
  { "id": 29, "name": "Iced Caffè Latte", "price": 380.00, "desc": "Dark espresso balanced with cold milk and severed over ice.", "image": "https://images.unsplash.com/photo-1579992357154-faf4bde95b3d?q=80&w=600&auto=format&fit=crop", "category": "Drinks" },
  { "id": 30, "name": "Iced Caffè Mocha", "price": 450.00, "desc": "Espresso mixed with mocha sauce and milk over ice, topped with whipped cream.", "image": "/double_choco_frappuccino.png", "category": "Drinks" },
  { "id": 31, "name": "Iced Cappuccino", "price": 420.00, "desc": "Signature espresso and cold milk layered with a thick cap of foam.", "image": "/cold_coffee.png", "category": "Drinks" },
  { "id": 32, "name": "Vanilla Cortado", "price": 350.00, "desc": "Equal parts espresso and warm milk with a hint of natural vanilla.", "image": "/velvet_flat_white.png", "category": "Drinks" },
  { "id": 33, "name": "Velvet Vanilla Latte", "price": 420.00, "desc": "Rich espresso blended with vanilla syrup and velvety steamed milk.", "image": "/velvet_vanilla_latte.png", "category": "Drinks" },
  { "id": 34, "name": "Iced Vanilla Hazelnut Latte", "price": 450.00, "desc": "Iced latte infused with classic vanilla and roasted hazelnut.", "image": "/iced_vanilla_hazelnut_latte.png", "category": "Drinks" },
  { "id": 35, "name": "Caffe Latte", "price": 350.00, "desc": "Our dark, rich espresso balanced with steamed milk and a light layer of foam.", "image": "/cappuccino.png", "category": "Drinks" },
  { "id": 36, "name": "Classic Butter Croissant", "price": 300.00, "desc": "A rich, buttery, and flaky classic French croissant.", "image": "/classic_butter_croissant.png", "category": "Food,Bestseller" },
  { "id": 37, "name": "Smoked Turkey & Cheese Bagel", "price": 750.00, "desc": "Sliced smoked turkey, Swiss cheese, and fresh greens on a toasted bagel.", "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop", "category": "Food" },
  { "id": 38, "name": "Blueberry Chia Seed Pudding", "price": 450.00, "desc": "Healthy chia pudding made with oat milk, topped with fresh blueberries.", "image": "/blueberry_chia_pudding.png", "category": "Food" },
  { "id": 39, "name": "Spinach & Feta Wrap", "price": 650.00, "desc": "A warm whole wheat wrap packed with sautéed spinach and tangy feta.", "image": "/spinach_feta_wrap.png", "category": "Food" },
  { "id": 40, "name": "Dark Chocolate Brownie", "price": 350.00, "desc": "Fudgy, dense brownie made with premium 70% dark Belgian chocolate.", "image": "https://images.unsplash.com/photo-1564355808539-22fda35bcd36?q=80&w=600&auto=format&fit=crop", "category": "Food" },
  { "id": 41, "name": "Vegan Banana Bread", "price": 400.00, "desc": "Moist and sweet banana bread baked daily without dairy or eggs.", "image": "/vegan_banana_bread.png", "category": "Food" },
  { "id": 42, "name": "Classic New York Cheesecake", "price": 550.00, "desc": "Rich, dense, and creamy slice of traditional New York style cheesecake.", "image": "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=600&auto=format&fit=crop", "category": "Cake" },
  { "id": 43, "name": "Red Velvet Bliss Cake", "price": 600.00, "desc": "Moist red velvet sponge layered with smooth cream cheese frosting.", "image": "https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=600&auto=format&fit=crop", "category": "Cake" },
  { "id": 44, "name": "Caramel Pecan Carrot Cake", "price": 500.00, "desc": "Spiced carrot cake packed with walnuts and topped with caramel drizzle.", "image": "https://images.unsplash.com/photo-1542826438-bd32f43d626f?q=80&w=600&auto=format&fit=crop", "category": "Cake" },
  { "id": 45, "name": "Red Velvet Cake", "price": 580.00, "desc": "Classic red velvet layers with cream cheese frosting.", "image": "/red_velvet_cake.png", "category": "Cake" },
  { "id": 46, "name": "Black Forest Cake", "price": 600.00, "desc": "Layers of chocolate sponge, cherry filling, and whipped cream.", "image": "/black_forest_cake.png", "category": "Cake" },
  { "id": 47, "name": "Carrot Cake", "price": 520.00, "desc": "Spiced cake loaded with carrots, walnuts, and cream cheese icing.", "image": "https://images.unsplash.com/photo-1536511132770-e5066914757c?q=80&w=600&auto=format&fit=crop", "category": "Cake" },
  { "id": 48, "name": "Pineapple Upside-Down Cake", "price": 480.00, "desc": "Sweet pineapple rings and cherries over a fluffy sponge cake.", "image": "/pineapple_cake.png", "category": "Cake" },
  { "id": 49, "name": "Opera Cake", "price": 650.00, "desc": "Exquisite French layer cake with almond sponge, coffee syrup, and chocolate ganache.", "image": "https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=600&auto=format&fit=crop", "category": "Cake" },
  { "id": 50, "name": "Chiffon Cake", "price": 450.00, "desc": "Light and airy sponge cake with a delicate texture.", "image": "/chiffon_cake.png", "category": "Cake" },
  { "id": 51, "name": "Rainbow Cake", "price": 600.00, "desc": "Colorful, vibrant layers of vanilla cake with buttercream frosting.", "image": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?q=80&w=600&auto=format&fit=crop", "category": "Cake" },
  { "id": 52, "name": "Unicorn Cake", "price": 700.00, "desc": "Magical pastel-colored cake with fun sprinkles and edible decorations.", "image": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?q=80&w=800&auto=format&fit=crop", "category": "Cake" },
  { "id": 53, "name": "Fruit Cake", "price": 550.00, "desc": "Traditional cake loaded with dried fruits, nuts, and spices.", "image": "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?q=80&w=800&auto=format&fit=crop", "category": "Cake" },
  { "id": 54, "name": "Butter Cake", "price": 400.00, "desc": "Classic, rich, and moist buttery vanilla cake.", "image": "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?q=80&w=800&auto=format&fit=crop", "category": "Cake" }
]

def seed():
    products_collection.delete_many({})
    products_collection.insert_many(allMenuItems)
    print(f"Successfully added {len(allMenuItems)} products to the MongoDB database.")

if __name__ == '__main__':
    seed()
