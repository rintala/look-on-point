"""LookOnPoint URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from quickstart import views

from django.conf.urls import url

#For images
from django.conf.urls.static import static
from django.conf import settings

# Define router
router = routers.DefaultRouter()


# Register views on the router
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'comments', views.CommentViewSet)
router.register(r'posts', views.PostViewSet)

# Add the urls registered on the router to our URL:s
urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('upload/', views.FileUploadView.as_view()),
    #url(r'api/', include('api.urls')),
    #path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]

if settings.DEBUG:
  urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)