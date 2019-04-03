from django.shortcuts import render
from django.contrib.auth.models import User, Group
from .models import Post, Comment
from rest_framework import viewsets
from quickstart.serializers import UserSerializer, GroupSerializer, PostSerializer, CommentSerializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.request import Request
from django.contrib import messages

# For get users by username
from rest_framework.decorators import list_route
from django.shortcuts import get_list_or_404, get_object_or_404
# SOURCE: https://www.django-rest-framework.org/tutorial/quickstart/

# For file upload
from rest_framework.parsers import FileUploadParser
from .serializers import FileSerializer

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
    

    @list_route(methods=['get'], url_path='retrieve_by_username/(?P<username>\w+)')
    def getByUsername(self, request, username ):
        user = get_object_or_404(User, username=username)
        
        serializer_context = {
            'request': request,
        }

        return Response(UserSerializer(user, context=serializer_context).data, status=status.HTTP_200_OK)

class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


# Create your views here.
class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Post.objects.all().order_by('-createdOn')
    serializer_class = PostSerializer

    @action(detail=True, methods=['post'])
    def post(self, request, pk=None):
        print("POSTED")
        
        serializer_context = {
            'request': request,
        }

        serializer = PostSerializer(data=request.data, context=serializer_context)
        print("P",serializer.is_valid())
        if serializer.is_valid() == True:
            print("sucessful backend")
            instance = serializer.save()
            messages.success(request._request, 'Success')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


class CommentViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Comment.objects.all().order_by('-createdOn')
    serializer_class = CommentSerializer

    @action(detail=True, methods=['post'])
    def post(self, request, pk=None):
        print("POSTED")
        
        serializer_context = {
            'request': request,
        }

        serializer = CommentSerializer(data=request.data, context=serializer_context)
        print("P",serializer.is_valid())
        if serializer.is_valid() == True:
            print("sucessful backend")
            instance = serializer.save()
            messages.success(request._request, 'Success')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class FileUploadView(APIView):
    parser_class = (FileUploadParser,)

    def post(self, request, *args, **kwargs):

      file_serializer = FileSerializer(data=request.data)

      if file_serializer.is_valid():
          file_serializer.save()
          return Response(file_serializer.data, status=status.HTTP_201_CREATED)
      else:
          return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
