from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.views.static import serve

urlpatterns = [
    path('backend/admin/', admin.site.urls),
    path('backend/api/', include('api.urls')),
    re_path(r'^backend/static/(?P<path>.*)$', serve, {'document_root': settings.STATIC_ROOT}),
    re_path(r'^backend/media/(?P<path>.*)$', serve, {'document_root': settings.MEDIA_ROOT}),
]
