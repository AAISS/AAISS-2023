import csv
from dataclasses import dataclass

from django.http import HttpResponse


@dataclass
class SkyroomCredentials:
    username: str
    password: str
    full_name: str


def convert_credentials_to_csv_response(credentials: list[SkyroomCredentials]) -> HttpResponse:
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="login_credentials.csv"'
    writer = csv.writer(response)
    for credential in credentials:
        writer.writerow([credential.username, credential.password, credential.full_name, 'aaiss', 'normal'])
    return response
