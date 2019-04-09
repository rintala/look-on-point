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

import json

# For get users by username
from rest_framework.decorators import list_route
from django.shortcuts import get_list_or_404, get_object_or_404
# SOURCE: https://www.django-rest-framework.org/tutorial/quickstart/

# For file upload
from rest_framework.parsers import FileUploadParser
from .serializers import FileSerializer

# Import lib for hashing passwords - update: use built in django user management - takes care of passwords
# from passlib.hash import pbkdf2_sha256
from .forms import CustomUserCreationForm
from django.contrib.auth import get_user_model

User = get_user_model()

from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from rest_framework_jwt.serializers import VerifyJSONWebTokenSerializer

# Create your views here.

from rest_auth.registration.views import RegisterView


class CustomRegisterView(RegisterView):
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        custom_data = {"message": "some message", "status": "ok"}
        response.data.update(custom_data)
        return response


# Create your views here.
class CustomUserView(APIView):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    @action(detail=True, methods=['post'])
    def post(self, request, pk=None):
        print("POSTED")
        
        form = CustomUserCreationForm(request.POST)
        
        if form.is_valid():
            user = form.save()
            return Response(form.data, status=status.HTTP_201_CREATED)
        else:
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer

    @action(detail=True, methods=['post'])
    def post(self, request, pk=None):
        print("POSTED")
        
        form = CustomUserCreationForm()

        if form.is_valid():
            user = form.save()
            # redirect.. 
        # print("FORM POSTED...")

        return render(request, 'home.html', {
            'form': form
        })
        '''serializer_context = {
            'request': request,
        }
        print("REQUEST DATA: ", request.data)

        serializer = UserSerializer(data=request.data, context=serializer_context)
        print("P",serializer.is_valid())
        if serializer.is_valid() == True and CustomUserCreationForm.is_valid():
            print("sucessful backend")
            instance = serializer.save()
            messages.success(request._request, 'Success')
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        '''

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


class SubmitPostView(APIView):
    permission_classes = (IsAuthenticated,)
    #authentication_classes = (TokenAuthentication)

    @action(detail=True, methods=['post'])

    def post(self, request, pk=None):
    
        serializer_context = {
            'request': request,
        }

        serializer = PostSerializer(data=request.data, context=serializer_context)
        print("P",serializer.is_valid())
        if serializer.is_valid() == True:
            print("sucessful backend")

            # Compare the userID from request with userID from provided token
            userIDFromRequest = serializer.validated_data['userID']
            userIDFromToken = request.user

            if(userIDFromRequest == userIDFromToken):
                instance = serializer.save()
                messages.success(request._request, 'Success')
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                raise ValidationError("Sorry, you are trying to post as another user which is forbidden..")
        
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Create your views here.
class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    # permission_classes = (IsAuthenticated,)
    permission_classes = (AllowAny,)

    queryset = Post.objects.all().order_by('-createdOn')
    serializer_class = PostSerializer

        
    '''def get_queryset(self):
        if self.request.user.is_superuser:
            return User.objects.all()
        else:
            print("REQ: ", self.request.user)
            return User.objects.filter(id=self.request.user.pk)'''

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
