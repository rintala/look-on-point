from django.shortcuts import render
from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from quickstart.serializers import UserSerializer, GroupSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.request import Request
from django.contrib import messages
# SOURCE: https://www.django-rest-framework.org/tutorial/quickstart/

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    @action(detail=True, methods=['post'])
    def post(self, request, pk=None):
        print("POSTED")
        
        serializer_context = {
            'request': request,
        }

        serializer = UserSerializer(data=request.data, context=serializer_context)
        print("P",serializer.is_valid())
        if serializer.is_valid() == True:
            print("sucessful backend")
            instance = serializer.save()
            messages.success(request._request, 'Success')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer