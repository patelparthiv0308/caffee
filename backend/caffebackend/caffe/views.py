from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render, redirect
from django.views import View
from .mongodb import products_collection, orders_collection, settings_collection
from bson import ObjectId
from datetime import datetime
import base64
from django.http import HttpResponse

class BasicAuthMixin:
    def dispatch(self, request, *args, **kwargs):
        if 'HTTP_AUTHORIZATION' in request.META:
            auth = request.META['HTTP_AUTHORIZATION'].split()
            if len(auth) == 2 and auth[0].lower() == "basic":
                try:
                    username, password = base64.b64decode(auth[1]).decode('utf-8').split(':')
                    if username == 'admin' and password == 'admin123':
                        return super().dispatch(request, *args, **kwargs)
                except Exception:
                    pass
        
        response = HttpResponse('Unauthorized', status=401)
        response['WWW-Authenticate'] = 'Basic realm="Aether Admin"'
        return response

class ProductListCreateAPIView(APIView):
    def get(self, request):
        products = list(products_collection.find())
        for p in products:
            p['id'] = str(p.pop('_id'))
            if 'is_available' not in p:
                p['is_available'] = True
        return Response(products, status=status.HTTP_200_OK)

    def post(self, request):
        # Convert to mutable dict
        if hasattr(request.data, 'dict'):
            data = request.data.dict()
        else:
            data = dict(request.data)
            
        data['created_at'] = datetime.now().isoformat()
        data['is_available'] = True
        
        result = products_collection.insert_one(data)
        data['id'] = str(result.inserted_id)
        if '_id' in data:
            del data['_id']
        return Response(data, status=status.HTTP_201_CREATED)

class ProductDeleteAPIView(APIView):
    def delete(self, request, pk):
        try:
            result = products_collection.delete_one({"_id": ObjectId(pk)})
            if result.deleted_count == 1:
                return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception:
            # Handle case where pk is not a valid ObjectId (e.g., from old SQLite data)
            if str(pk).isdigit():
                result = products_collection.delete_one({"id": int(pk)})
                if result.deleted_count == 1:
                    return Response(status=status.HTTP_204_NO_CONTENT)
            return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)

class OrderCreateAPIView(APIView):
    def post(self, request):
        # Convert to mutable dict
        if hasattr(request.data, 'dict'):
            data = request.data.dict()
        else:
            data = dict(request.data)
            
        data['created_at'] = datetime.now().isoformat()
        data['status'] = 'Pending'  # Default status
        result = orders_collection.insert_one(data)
        data['id'] = str(result.inserted_id)
        if '_id' in data:
            del data['_id']
        return Response(data, status=status.HTTP_201_CREATED)

class OrderUpdateStatusAPIView(APIView):
    def patch(self, request, pk):
        status_value = request.data.get('status')
        if not status_value:
            return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            result = orders_collection.update_one(
                {"_id": ObjectId(pk)},
                {"$set": {"status": status_value}}
            )
            if result.matched_count == 0:
                return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"status": status_value}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid ID format"}, status=status.HTTP_400_BAD_REQUEST)


# --- CUSTOM HTML ADMIN VIEWS ---

class AdminDashboardView(BasicAuthMixin, View):
    def get(self, request):
        # Fetch products (newest first)
        products_cursor = products_collection.find().sort('_id', -1)
        products = []
        for p in products_cursor:
            p['id'] = str(p.pop('_id'))
            if 'is_available' not in p:
                p['is_available'] = True
            products.append(p)
        
        # Fetch orders
        orders_cursor = orders_collection.find().sort('_id', -1)
        active_orders = []
        cancelled_orders = []
        for o in orders_cursor:
            o['id'] = str(o.pop('_id'))
            # Convert ISO string back to friendly format if possible
            try:
                dt = datetime.fromisoformat(o.get('created_at', ''))
                o['created_at'] = dt.strftime('%B %d, %Y, %I:%M %p')
            except:
                pass
            
            if o.get('status') == 'Cancelled':
                cancelled_orders.append(o)
            else:
                active_orders.append(o)
            
        # Fetch Store Status
        store_settings = settings_collection.find_one({"key": "store_status"})
        is_open = store_settings.get("is_open", True) if store_settings else True

        return render(request, 'caffe/admin_dashboard.html', {
            'products': products, 
            'active_orders': active_orders,
            'cancelled_orders': cancelled_orders,
            'is_open': is_open
        })

class AdminAddProductView(BasicAuthMixin, View):
    def post(self, request):
        data = {
            "name": request.POST.get('name'),
            "price": float(request.POST.get('price')),
            "category": request.POST.get('category'),
            "image": request.POST.get('image'),
            "desc": request.POST.get('desc'),
            "is_available": True  # New field
        }
        # Get max ID
        last_product = products_collection.find_one(sort=[("id", -1)])
        new_id = (last_product.get('id', 0) + 1) if last_product and 'id' in last_product else 1
        data["id"] = new_id
        products_collection.insert_one(data)
        return redirect('/api/custom-admin/')

class AdminDeleteProductView(BasicAuthMixin, View):
    def post(self, request, pk):
        try:
            products_collection.delete_one({"_id": ObjectId(pk)})
        except Exception:
            if str(pk).isdigit():
                products_collection.delete_one({"id": int(pk)})
        return redirect('/api/custom-admin/')

class AdminDeleteOrderView(BasicAuthMixin, View):
    def post(self, request, pk):
        try:
            orders_collection.delete_one({"_id": ObjectId(pk)})
        except Exception:
            pass
        return redirect('/api/custom-admin/')

class AdminToggleProductStockView(BasicAuthMixin, View):
    def post(self, request, pk):
        try:
            product = products_collection.find_one({"_id": ObjectId(pk)})
            if product:
                new_status = not product.get("is_available", True)
                products_collection.update_one({"_id": ObjectId(pk)}, {"$set": {"is_available": new_status}})
        except:
            pass
        return redirect('/api/custom-admin/')

class AdminToggleStoreStatusView(BasicAuthMixin, View):
    def post(self, request):
        store_settings = settings_collection.find_one({"key": "store_status"})
        if store_settings:
            new_status = not store_settings.get("is_open", True)
            settings_collection.update_one({"key": "store_status"}, {"$set": {"is_open": new_status}})
        else:
            settings_collection.insert_one({"key": "store_status", "is_open": False})
        return redirect('/api/custom-admin/')

class StoreStatusAPIView(APIView):
    def get(self, request):
        store_settings = settings_collection.find_one({"key": "store_status"})
        is_open = store_settings.get("is_open", True) if store_settings else True
        return Response({"is_open": is_open})

