from django.contrib import admin
from django.urls import include, path

from farmers import views as farmer_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', farmer_views.home, name='home'),
    path('accounts/', include('accounts.urls')),
    path('accounts/social/', include('allauth.urls')),
    path('farmers/', include('farmers.urls')),
]
