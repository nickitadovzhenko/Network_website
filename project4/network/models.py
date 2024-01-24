from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    subscriptions = models.ManyToManyField(
        'self', symmetrical=False, blank=True, related_name='subscribers')

class Comments(models.Model):
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='comment_creator')
    comment = models.TextField(blank = False)

class Posts(models.Model):
    creator = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='creator')
    post_text = models.TextField(blank=False, null = True)
    date = models.DateTimeField()
    likes = models.IntegerField(default = 1)
    comments = models.ForeignKey(
        Comments, on_delete=models.CASCADE, related_name='comments', null = True, blank = True)
