from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_perm(self,req,view):
        return req.user.groups.filter(name='admin').exists()