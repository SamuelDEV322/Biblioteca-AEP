from django.apps import AppConfig

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        from django.contrib.auth.models import User
        from rest_framework.authtoken.models import Token
        from django.db.models.signals import post_save

        def create_auth_token(sender, instance=None, created=False, **kwargs):
            if created:
                Token.objects.create(user=instance)

        post_save.connect(create_auth_token, sender=User)
