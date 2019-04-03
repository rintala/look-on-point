from django.contrib.auth.models import User, Group
from .models import Post, Comment, File
from rest_framework import serializers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'username', 'email', 'groups', 'password')


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = ('postID', 'userID', 'imgUrl', 'description', 'numberLikes', 'createdOn', 'showComments')


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = ('commentID', 'postID', 'userID', 'content', 'createdOn')


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"