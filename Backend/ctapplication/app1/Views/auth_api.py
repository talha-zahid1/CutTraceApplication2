from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from ..serializers import user_serializer
from django.contrib.auth.models import User


class register_view(APIView):
    permission_classes=[AllowAny]
    def get_token(self,user):
        refresh=RefreshToken.for_user(user)
        return {
            'access':str(refresh.access_token),
            'refresh':str(refresh)
        }
    def post(self,req):
        serializer=user_serializer(data=req.data)
        if serializer.is_valid():
            data=serializer.data
            if  User.objects.filter(username=data['username']).exists():
                return Response({
                    'status':False,
                    'message':'User is Already Registered'
                },status=400)
            user,created=User.objects.get_or_create(username=data['username'],email=data['email'],password=data['password'])
            user.save()
            return Response({
                'status':True,
                'message':'User Rigestered',
                'data':user
            })
class logout_view(APIView):
    def post(self,req):
        try:
            refresh_token=req.data.get('refresh')
            token=RefreshToken(refresh_token)
            token.blacklist()
            return Response(
                {"message": "Logout successful"}
            )

        except Exception as e:
            return Response({
                'status':False,
                "error": "Invalid refresh token",
            },status=400)
