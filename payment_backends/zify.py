from urllib.parse import urljoin

import requests
import json

from aaiss_backend.settings import ZIFY_AUTH, BASE_URL

ZIFY_STATUS_OK = 200
ZIFY_STATUS_201 = 201
ZIFY_STATUS_202 = 202
ZIFY_STATUS_BAD_REQUEST = 400
ZIFY_STATUS_INTERNAL_SERVER_ERROR = 500
ZIFY_STATUS_UNAVAILABLE = 503
ZIFY_STATUS_AUTH_ERROR = 401
ZIFY_STATUS_BAN = 403
ZIFY_STATUS_NOT_FOUND = 404
ZIFY_PAYMENT_DESCRIPTION = 'register workshops or talks'
ZIFY_CALL_BACK = 'https://aaiss.ir/api/payment/verify/'
ZIFY_URL = "https://zify.ir/api/order/v2/create"
ZIFY_URL_VERIFY = "https://zify.ir/api/order/v2/verify"
ZIFY_PAYMENT_LINK = 'https://zify.ir/order/accept/{track_id}'


class ZIFYRequest:
    def __init__(self):
        self.__headers = {
            'Content-Type': 'application/json',
            "Authorization": "Bearer %s" % ZIFY_AUTH
        }

    @staticmethod
    def get_order_url(track_id: str):
        return ZIFY_PAYMENT_LINK.format(track_id=track_id)

    def create_payment(self, order_id, amount, user_name, user_phone, user_email):
        body = {
            "payer": {
                "first_name": "",
                "last_name": user_name,
                "phone": user_phone,
                "email": user_email,
                "state": "",
                "city": "",
                "address_1": "",
                "address_2": "",

            },
            "products": [
                {
                    "code": "000",
                    "sellQuantity": 1,
                    "title": "AAISS PAY",
                    "amount": amount,
                    "unlimited": True,
                    "quantity": 100,
                    "description": ZIFY_PAYMENT_DESCRIPTION
                }
            ],
            "returnUrl": ZIFY_CALL_BACK,
            "clientRefId": order_id,
            "shipping_total": 0,
            "off_total": 0,
            "tax_total": 0
        }
        response = requests.request(method='POST', headers=self.__headers, url=ZIFY_URL, data=json.dumps(body))
        json_response = json.loads(response.text)
        json_response['status'] = response.status_code
        return json_response

    def verify_payment(self, code):
        body = {
            "order": code
        }
        response = requests.request(method='POST', headers=self.__headers, url=ZIFY_URL_VERIFY, data=json.dumps(body))
        json_response = json.loads(response.text)
        if 'status' not in json_response:
            json_response['status'] = response.status_code
        return json_response
