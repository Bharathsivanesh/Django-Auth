from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

#custom user model
class CustomUser(AbstractUser):
    USER_TYPE_CHOICES = (
    ('user','User'),
    ('admin','Admin')
    )
    user_type=models.CharField(max_length=10,choices=USER_TYPE_CHOICES,default='user')

    def __str__(self):
        return f"{self.username}({self.user_type})"


 # Notes Model

class Note(models.Model):
     user=models.ForeignKey(CustomUser,on_delete=models.CASCADE,related_name='notes')
     title=models.CharField(max_length=100)
     content=models.TextField()
     created_at=models.DateTimeField(auto_now_add=True)
     updated_at=models.DateTimeField(auto_now=True)

     def __str__(self):
         return f"{self.title}-({self.user_type})"

