from django.contrib import admin

# For CustomUser model
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import CustomUser
from django.contrib.auth.models import User

class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    
    list_display = ['username', 'userID', 'email', 'createdOn']
    fieldsets = UserAdmin.fieldsets + (
            (None, {'fields': ('some_extra_data',)}),
    )

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    # list_display = ('email', 'date_of_birth', 'is_admin')
    # list_filter = ('is_admin',)
    '''fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('date_of_birth',)}),
        ('Permissions', {'fields': ('is_admin',)}),
    )'''
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'date_of_birth', 'password1', 'password2')}
        ),
    )

# Register your models here.
from .models import Post, Comment
admin.site.register(Post)
admin.site.register(Comment)

# Re-register UserAdmin - not needed, since we add AUTH_USER_MODEL = 'quickstart.CustomUser' to settings.py
#admin.site.unregister(User)

admin.site.register(User, CustomUserAdmin)
