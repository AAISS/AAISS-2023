from rest_framework import status


# TODO: refactor this and make a unified response template
def new_detailed_response(status_code: int = status.HTTP_200_OK, message: str = '', data: any = None) -> dict[str, any]:
    return {
        'status': status_code,
        'message': message,
        'data': data
    }
