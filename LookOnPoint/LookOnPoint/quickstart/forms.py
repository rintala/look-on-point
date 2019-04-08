# users/forms.py
from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from .models import CustomUser

class CustomUserCreationForm(UserCreationForm):
    # Form for creating new users.
    print("PASS.---")
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput)
    #password1 = None
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput)
    print("PASSWORD1..password2..")
    
    class Meta(UserCreationForm):
        model = CustomUser
        fields = ('email', 'username')
        #fields = UserCreationForm.Meta.fields;
        # + ('userID',)
    	
    def save(self, commit=True):
        print("TRUING TO SAVE..")	
        # Save the provided password in hashed format
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password1"])
        if commit:
            user.save()
        return user

    def clean_password1(self):
        password1 = self.cleaned_data.get('password1')
        try:
            password_validation.validate_password(password1, self.instance)
        except forms.ValidationError as error:

            # Method inherited from BaseForm
            self.add_error('password1', error)
        return password1


class CustomUserChangeForm(UserChangeForm):
    class Meta:
        model = CustomUser
        fields = UserChangeForm.Meta.fields