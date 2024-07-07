from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .models import User

class UserRegistrationForm(UserCreationForm):
    email = forms.EmailField(required=True, help_text="Enter a valid email address.")
    password1 = forms.CharField(label='Password', widget=forms.PasswordInput, help_text='Password must be between 8 and 20 characters.')
    password2 = forms.CharField(label='Password confirmation', widget=forms.PasswordInput, help_text='Enter the same password as before, for verification.')

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if not email:
            raise ValidationError(_("email is required."))
        if User.objects.filter(email=email).exists():
            raise ValidationError(_("A user with that email already exists."))
        return email

    def clean_username(self):
        username = self.cleaned_data.get('username')
        if not username:
            raise ValidationError(_("username is required."))
        return username

    def clean_password1(self):
        password = self.cleaned_data.get('password1')
        if password and len(password) < 8:
            raise ValidationError(_("Password must be between 8 and 20 characters."))
        return password

    def clean(self):
        cleaned_data = super().clean()
        password = cleaned_data.get('password1')
        confirm_password = cleaned_data.get('password2')

        if password and confirm_password and password != confirm_password:
            raise ValidationError({"password2": _("The two password fields didn’t match.")})
        return cleaned_data
