from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/socketservice/(?P<client_id>\w+)", consumers.ChatConsumer.as_asgi()),
]