from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponseRedirect

def home(request):
    return HttpResponseRedirect('/api/custom-admin/')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('caffe.urls')),
    path('', home),  # ← ye line add karo
]