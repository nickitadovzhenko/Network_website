from django.contrib import admin
from .models import Posts, User, Comments
# Register your models here.

admin.site.register(Posts)
admin.site.register(User)
admin.site.register(Comments)