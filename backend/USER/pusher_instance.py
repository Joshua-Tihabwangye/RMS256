# yourapp/pusher_instance.py
import pusher
from django.conf import settings

pusher_client = pusher.Pusher(
    app_id=settings.PUSHER_CONFIG["app_id"],
    key=settings.PUSHER_CONFIG["key"],
    secret=settings.PUSHER_CONFIG["secret"],
    cluster=settings.PUSHER_CONFIG["cluster"],
    ssl=settings.PUSHER_CONFIG["ssl"]
)
