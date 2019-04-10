from django.contrib.auth.models import User, Group
from .models import Post, Comment, File, CustomUser
from rest_framework import serializers

# For user registration
from allauth.account import app_settings as allauth_settings
from allauth.utils import email_address_exists
from allauth.account.adapter import get_adapter
from allauth.account.utils import setup_user_email

class UserSerializer(serializers.ModelSerializer):
    class Meta:
       	# model = User
       	model = CustomUser
        fields = ('url', 'username', 'userID', 'email', 'groups', 'password', 'createdOn')

class RegisterSerializer(serializers.Serializer):
    # password2 = serializers.CharField(required=True, write_only=True)
    print("REGISTER SERIALIZER:..:");
    class Meta:
       	# model = User
       	#model = CustomUser
        fields = ('url', 'username', 'userID', 'email', 'groups', 'password', 'createdOn')

    def validate_email(self, email):
        email = get_adapter().clean_email(email)
        if allauth_settings.UNIQUE_EMAIL:
            if email and email_address_exists(email):
                raise serializers.ValidationError(
                    _("A user is already registered with this e-mail address."))
        return email

    def validate_password1(self, password):
        return get_adapter().clean_password(password)

    def validate(self, data):
        if data['password1'] != data['password2']:
            raise serializers.ValidationError(
                _("The two password fields didn't match."))
        return data

    def get_cleaned_data(self):
        super(RegisterSerializer, self).get_cleaned_data()
        
        class Meta:
            model = CustomUser
            fields = '__all__'

        return {
            'username': self.validated_data.get('username', ''),
            'password': self.validated_data.get('password', ''),
            'email': self.validated_data.get('email', ''),
        }

class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ('url', 'name')


class PostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Post
        fields = ('postID', 'userID', 'customTitle', 'imgUrl', 'description', 'numberLikes', 'createdOn', 'showComments')


class CommentSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Comment
        fields = ('commentID', 'postID', 'userID', 'content', 'createdOn')


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = "__all__"