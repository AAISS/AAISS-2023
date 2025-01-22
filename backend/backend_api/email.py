import threading
from time import sleep
from typing import TypedDict

from django.conf import settings
from django.core.mail import EmailMessage

from aaiss_backend import settings
from aaiss_backend.settings import ENABLE_SENDING_EMAIL

class DataItem(TypedDict):
    email: str
    subject: str
    content: str


class MailerThread(threading.Thread):
    _MAXIMUM_RETRIES = 10
    _SLEEP_INTERVAL_SECONDS = 60
    CHUNK_SIZE = 40
    CHUNK_SLEEP_INTERVAL = 120 # In seconds

    def __init__(self, data: list[DataItem]):
        self.data = data
        threading.Thread.__init__(self)

    def run(self):
        print('STARTING TO SEND MAILS')
        print([item['email'] for item in self.data])
        for index, chunk in enumerate([self.data[pointer:min(pointer+self.CHUNK_SIZE, len(self.data))] for pointer in range(0, len(self.data), self.CHUNK_SIZE)]):
            print(f"current chunk: {[item['email'] for item in chunk]}")
            for item in chunk:
                email = EmailMessage(
                    subject=item['subject'],
                    body=item['content'],
                    from_email=settings.EMAIL_HOST_USER,
                    to=[item['email']],
                    reply_to=(settings.EMAIL_HOST_USER,)
                )
                email.content_subtype = "html"
                if ENABLE_SENDING_EMAIL:
                    has_send = False
                    for i in range(self._MAXIMUM_RETRIES):
                        try:
                            email.send(fail_silently=False)
                            has_send = True
                            break
                        except Exception as e:
                            print(f"Exception raised while sending email: {e}")
                            sleep(self._SLEEP_INTERVAL_SECONDS)
                    if not has_send:
                        print(f"Failed to send email to {item['email']} after {self._MAXIMUM_RETRIES} retries")
                else:
                    print(f"Sent the following email (change ENABLE_SENDING_EMAIL to True to actually send the email):")
                    print(f"To: {email.bcc}\nSubject: {email.subject}\n\nBody: {email.body}\n\n")

            sleep(self.CHUNK_SLEEP_INTERVAL)
        print("SENDING DONE")
