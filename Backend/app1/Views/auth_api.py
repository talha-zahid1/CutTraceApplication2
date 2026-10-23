from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from ..serializers import user_serializer,profile_serializer
from django.contrib.auth.models import User
from rest_framework.decorators import permission_classes,api_view
from ..models import UserProfile
from django.db import transaction

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(req):
    user=req.user
    if not UserProfile.objects.filter(user=user).exists():
        return Response({
            'status':False,
            'message':'User is not Found'
        },status=401)
    return Response(
        {
            "status": True,
            "message": "Profile retrieved successfully",
            "data": {
                "id": user.id,
                "full_name": user.username,
                "email": user.email,
                "phone": user.userprofile.mobile_no,
                "role": user.userprofile.role
            }
        }
    )

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])                
def Profile_Update(req):
    user=req.user
    profile=UserProfile.objects.filter(user=user).first()
    if not profile:
        return Response({
            'status':False,
            'message':'User  not Found'
        },status=401)
    
    serializer=profile_serializer(profile,data=req.data,partial=True,context={'request': req})
    if serializer.is_valid():
        data=serializer.save()
        
        return Response({
            "status": True,
            "message": "Profile updated successfully",
            "data": {
                "id": user.id,
                "full_name": data.user.username,
                "email": data.user.email,
                "phone": data.mobile_no,
                "role": data.role
            }
        })
    return Response({
        'status':False,
        'error':serializer.errors
    },status=400)

class register_view(APIView):
    authentication_classes = []
    permission_classes=[AllowAny]
    def get_token(self,user):
        refresh=RefreshToken.for_user(user)
        return {
            'access':str(refresh.access_token),
            'refresh':str(refresh)
        }
    def post(self,req):
        with transaction.atomic():
            serializer=user_serializer(data=req.data)
            if serializer.is_valid():
                data=serializer.validated_data
                if  User.objects.filter(username=data['username']).exists():
                    return Response({
                        'status':False,
                        'message':'User is Already Registered'
                    },status=400)
                user=User.objects.create_user(username=data['username'],email=data['email'],password=req.data.get("password"))
                UserProfile.objects.create(user=user,mobile_no=req.data.get('mobile_no'))
                token=self.get_token(user=user)
                return Response({
                    'status':True,
                    'message':'User Rigestered',
                    'data':{
                        "user_id":user.id,
                        "username":user.username,
                        "email":user.email,
                        "access_token":token["access"],
                        'refresh_token':token["refresh"],
                        },
                    })
            return Response({
                'status':False,
                'error':serializer.errors
            },status=400)
        
class logout_view(APIView):
    permission_classes=[IsAuthenticated]
    def post(self,req):
        try:
            refresh_token=req.data.get('refresh')
            if not refresh_token:
                return Response({
                    "status": False,
                    "message": "Refresh token is required"
                }, status=400)
            token=RefreshToken(refresh_token)

            token.blacklist()
            return Response(
                {"message": "Logout successful"}
            )

        except Exception as e:
            print("Logout error:", repr(e))
            return Response({
                'status':False,
                "error": "Invalid refresh token",
            },status=400)
