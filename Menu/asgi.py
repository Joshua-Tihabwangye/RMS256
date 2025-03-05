# asgi.py

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from Menu import routing  # Ensure this imports your routing correctly

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Menu.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            routing.websocket_urlpatterns  # Ensure this is defined in your routing.py
        )
    ),
})