from django.contrib import admin
from .models import Posts, Comments, User
# Register your models here.

admin.site.register(Posts)
admin.site.register(User)
admin.site.register(Comments)