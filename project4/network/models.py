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
    post_text = models.TextField(blank=False, null=True)
    date = models.DateTimeField()
    comments = models.ForeignKey(
        Comments, on_delete=models.CASCADE, related_name='comments', null=True, blank=True)
    liked_by_users = models.ManyToManyField(
        User, blank=True, related_name='liked_posts')

    def __str__(self):
        return f"{self.creator.username}'s Post"

    def like_post(self, user):
        """
        Method to handle liking a post by a user.
        """
        if user not in self.liked_by_users.all():
            self.liked_by_users.add(user)

    def unlike_post(self, user):
        """
        Method to handle unliking a post by a user.
        """
        if user in self.liked_by_users.all():
            self.liked_by_users.remove(user)

    def get_total_likes(self):
        """
        Method to get the total number of likes for the post.
        """
        return self.liked_by_users.count()
