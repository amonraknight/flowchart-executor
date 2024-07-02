import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from objects.generalResponseBody import GeneralResponseBody

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.clientID = self.scope["url_route"]["kwargs"]["client_id"]
        self.group_name = f"client_{self.clientID}"
        async_to_sync(self.channel_layer.group_add)(
            self.group_name, self.channel_name
        )

        print('WebSocket %s connected!' % self.clientID)
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name, self.channel_name
        )

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        async_to_sync(self.channel_layer.group_send)(
            self.group_name, {"type": "backend.message", "message": message}
        )

    def backend_message(self, event):
        response = GeneralResponseBody(message=event["message"], status=event["status"], data=event["data"])
        responseStr = json.dumps(response.getResponseBody())

        self.send(text_data=responseStr)




