import requests
from django.conf import settings
from backend_api.models import Payment


class ZarinPalRequest:
    STATUS_OK = 200
    STATUS_ERROR = 400

    def __init__(self):
        self.merchant_id = getattr(settings, "X_API_KEY", "")
        self.description = "AAISS Payment"
        self.callback_url = getattr(settings, "CALLBACK_URL", "")

        sandbox = getattr(settings, "ZARINPAL_SANDBOX", False)
        if isinstance(sandbox, str):
            sandbox = sandbox.lower() in ("true", "1", "yes")

        self.base_url = "https://sandbox.zarinpal.com" if sandbox else "https://payment.zarinpal.com"
        self.urls = {
            "pay": f"{self.base_url}/pg/v4/payment/request.json",
            "verify": f"{self.base_url}/pg/v4/payment/verify.json",
            "start": f"{self.base_url}/pg/StartPay/{{authority}}"
        }

    def create_payment(self, order_id, amount, name, phone, mail, desc=None, callback=None):
        payload = {
            "merchant_id": self.merchant_id,
            "amount": int(amount) * 10,  # Convert Tomans to Rials
            "callback_url": callback or self.callback_url,
            "description": desc or self.description,
            "metadata": {
                "mobile": phone,
                "email": mail,
                "order_id": str(order_id)
            },
        }

        headers = {"Content-Type": "application/json", "Accept": "application/json"}

        try:
            resp = requests.post(self.urls["pay"], json=payload, headers=headers)
            response_json = resp.json()
            data = response_json.get("data", {})
            errors = response_json.get("errors", {})

            if data and data.get("code") == 100:
                authority = data.get("authority")
                return {
                    "status": self.STATUS_OK,
                    "id": authority,
                    "link": self.urls["start"].format(authority=authority),
                    "error": None
                }

            msg = errors.get("message") if isinstance(errors, dict) else str(errors)
            return {"status": self.STATUS_ERROR, "error": msg or "Payment creation failed"}

        except requests.RequestException as e:
            return {"status": self.STATUS_ERROR, "error": str(e)}

    def verify_payment(self, order_id, payment_id):
        try:
            # Fetch amount from DB to ensure security
            payment = Payment.objects.get(pk=order_id)
            amount_tomans = payment.amount
        except Payment.DoesNotExist:
            return {"status": self.STATUS_ERROR, "error": "Payment record not found"}

        payload = {
            "merchant_id": self.merchant_id,
            "amount": int(amount_tomans) * 10,  # Convert to Rials
            "authority": payment_id
        }

        headers = {"Content-Type": "application/json", "Accept": "application/json"}

        try:
            resp = requests.post(self.urls["verify"], json=payload, headers=headers)
            response_json = resp.json()
            data = response_json.get("data", {})
            errors = response_json.get("errors", {})

            # Code 100 = Success, 101 = Verified
            if data and data.get("code") in [100, 101]:
                return {
                    "status": self.STATUS_OK,
                    "ref_id": data.get("ref_id"),
                    "card_pan": data.get("card_pan"),
                    "error": None
                }

            msg = errors.get("message") if isinstance(errors, dict) else str(errors)
            return {"status": self.STATUS_ERROR, "error": msg or "Verification failed"}

        except requests.RequestException as e:
            return {"status": self.STATUS_ERROR, "error": str(e)}