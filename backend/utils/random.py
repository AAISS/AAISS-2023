import random
import string

_PASSWORD_LENGTH = 16
_DISCOUNT_CODE_LENGTH = 32


def create_random_string(length: int) -> str:
    return ''.join(
        random.SystemRandom().choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in
        range(length))


def random_password() -> str:
    return create_random_string(_PASSWORD_LENGTH)


def random_discount_code() -> str:
    return create_random_string(_DISCOUNT_CODE_LENGTH)
