from django.urls import path
from .views import (
    ProductListCreateAPIView, ProductDeleteAPIView, OrderCreateAPIView, OrderUpdateStatusAPIView,
    StoreStatusAPIView, AdminDashboardView, AdminAddProductView, AdminDeleteProductView, AdminDeleteOrderView,
    AdminToggleProductStockView, AdminToggleStoreStatusView
)

urlpatterns = [
    # API endpoints
    path('products/', ProductListCreateAPIView.as_view(), name='product-list-create'),
    path('products/<str:pk>/', ProductDeleteAPIView.as_view(), name='product-delete'),
    path('orders/', OrderCreateAPIView.as_view(), name='order-create'),
    path('orders/<str:pk>/status/', OrderUpdateStatusAPIView.as_view(), name='order-update-status'),
    path('store-status/', StoreStatusAPIView.as_view(), name='store-status'),
    
    # Custom HTML Admin endpoints
    path('custom-admin/', AdminDashboardView.as_view(), name='admin-dashboard'),
    path('custom-admin/add-product/', AdminAddProductView.as_view(), name='admin-add-product'),
    path('custom-admin/delete-product/<str:pk>/', AdminDeleteProductView.as_view(), name='admin-delete-product'),
    path('custom-admin/delete-order/<str:pk>/', AdminDeleteOrderView.as_view(), name='admin-delete-order'),
    path('custom-admin/toggle-stock/<str:pk>/', AdminToggleProductStockView.as_view(), name='admin-toggle-stock'),
    path('custom-admin/toggle-store/', AdminToggleStoreStatusView.as_view(), name='admin-toggle-store'),
]

