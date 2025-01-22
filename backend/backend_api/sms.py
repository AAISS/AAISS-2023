import threading
import http.client
import json
import time

from django.conf import settings

API_KEY = settings.SMS_KEY
LINE_NUMBER = settings.SMS_LINE_NUMBER

class SMSThread(threading.Thread):
    CHUNK_SIZE = 99
    CHUNK_SEND_INTERVAL = 60  # In seconds
    def __init__(self, message_text: str, mobiles: list[str]):
        super().__init__()
        self.message_text = message_text
        self.mobiles = mobiles
        self.max_retries = 5
        self.retry_interval = 60  # seconds

    @staticmethod
    def send_sms(mobiles, message_text):
        conn = http.client.HTTPSConnection("api.sms.ir")
        payload = json.dumps({
            "lineNumber": LINE_NUMBER,
            "messageText": message_text,
            "mobiles": mobiles,
            "sendDateTime": None
        })

        headers = {
            'X-API-KEY': API_KEY,
            'Content-Type': 'application/json'
        }

        conn.request("POST", "/v1/send/bulk", payload, headers)
        res = conn.getresponse()
        return res.status, res.read()

    def run(self):
        for index, chunk in enumerate([self.mobiles[pointer:min(pointer+self.CHUNK_SIZE, len(self.mobiles))] for pointer in range(0, len(self.mobiles), self.CHUNK_SIZE)]):
            attempts = 0
            while attempts < self.max_retries:
                try:
                    attempts += 1
                    status, response = self.send_sms(self.message_text, chunk)

                    if status == 200:
                        print(f"SMS successfully sent to {self.mobiles}: {response.decode('utf-8')}")
                        break
                    else:
                        print(f"Failed to send SMS (Attempt {attempts}/{self.max_retries}): {response.decode('utf-8')}")

                except Exception as e:
                    print(f"Error sending SMS to {self.mobiles} (Attempt {attempts}/{self.max_retries}): {str(e)}")

                # Wait before retrying
                if attempts < self.max_retries:
                    print(f"Retrying in {self.retry_interval} seconds...")
                    time.sleep(self.retry_interval)
            else:
                print(f"SMS sending failed after {self.max_retries} attempts. chunk index: {index}")
            time.sleep(self.CHUNK_SEND_INTERVAL)

