from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    ROLE_FARMER = 'farmer'
    ROLE_VET = 'vet'
    ROLE_MANAGER = 'manager'

    ROLE_CHOICES = [
        (ROLE_FARMER, 'Farmer'),
        (ROLE_VET, 'Veterinary Doctor'),
        (ROLE_MANAGER, 'Farm Manager'),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_FARMER)
    farm_name = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"
