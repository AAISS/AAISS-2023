import threading

from django.conf import settings
from django.core.mail import EmailMessage

from aaiss_backend import settings
from aaiss_backend.settings import ENABLE_SENDING_EMAIL


class MailerThread(threading.Thread):
    def __init__(self, subject: str, targets: list[str], html_body: str):
        self.subject = subject
        self.targets = targets
        self.HTML_body = html_body
        threading.Thread.__init__(self)

    def run(self):
        html_message = self.HTML_body
        print('STARTING TO SEND MAILS')
        print(self.targets)

        email = EmailMessage(
            subject=self.subject,
            body=html_message,
            from_email=settings.EMAIL_HOST_USER,
            bcc=self.targets,
            reply_to=(settings.EMAIL_HOST_USER,)
        )
        email.content_subtype = "html"
        if ENABLE_SENDING_EMAIL:
            email.send(fail_silently=False)
        else:
            print(f"Sent the following email (change ENABLE_SENDING_EMAIL to True to actually send the email):")
            print(f"To: {email.bcc}\nSubject: {email.subject}\n\nBody: {email.body}\n\n")
        print("SENDING DONE")