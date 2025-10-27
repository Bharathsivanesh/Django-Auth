from rest_framework import serializers
from .models import CustomUser, Note
from django.contrib.auth.password_validation import validate_password
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims if needed
        token['user_type'] = user.user_type
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra response data
        data['user_type'] = self.user.user_type
        data['username'] = self.user.username
        return data


# Custom User Serializer

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'password', 'user_type')

# Override create method to hash password
    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            user_type=validated_data.get('user_type', 'user')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user



# Note Serializer

class NoteSerializer(serializers.ModelSerializer):

    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Note
        fields = ('id', 'user', 'title', 'content', 'created_at', 'updated_at')


