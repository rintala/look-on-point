from django.db import models
from django.conf import settings

# Create your models here.
class Post(models.Model):
	postID = models.AutoField(primary_key=True)
	userID = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	#Source: https://stackoverflow.com/questions/34305805/django-foreignkeyuser-in-models
	
	imgUrl = models.TextField()
	description = models.TextField()
	numberLikes = models.PositiveSmallIntegerField(default=0)
	createdOn = models.DateTimeField(auto_now_add=True)

class Comment(models.Model):
    commentID = models.AutoField(primary_key=True)
    postID =  models.ForeignKey('quickstart.Post',on_delete=models.CASCADE)
    userID = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    createdOn = models.DateTimeField(auto_now_add=True)