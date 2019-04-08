from django.db import models
from django.conf import settings

# For CustomUser creation
from django.contrib.auth.models import AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
	# Additional fields, except ones inherited from AbstractUser
 	createdOn = models.DateTimeField(auto_now_add=True)
 	username = models.TextField(unique=True)
 	userID = models.AutoField(primary_key=True)

class Post(models.Model):
	postID = models.AutoField(primary_key=True)
	userID = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	#Source: https://stackoverflow.com/questions/34305805/django-foreignkeyuser-in-models
	
	imgUrl = models.TextField()
	description = models.TextField()
	numberLikes = models.PositiveSmallIntegerField(default=0)
	createdOn = models.DateTimeField(auto_now_add=True)
	showComments = models.BooleanField(default=False)

class Comment(models.Model):
    commentID = models.AutoField(primary_key=True)
    postID =  models.ForeignKey('quickstart.Post',on_delete=models.CASCADE)
    userID = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    createdOn = models.DateTimeField(auto_now_add=True)


# will use MEDIA path defined in settings.py to store image - i.e. not in DB
class File(models.Model):
    file = models.FileField(blank=False, null=False)
    def __str__(self):
        return self.file.name