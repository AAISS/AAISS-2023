import os

from aaiss_backend.settings import MEDIA_URL, BASE_URL


def update_certificate_filename(instance, filename):
    path = "certificates/"
    if hasattr(instance, "presentation"):
        path += "presentation/"
    else:
        path += "workshop/"
    format = instance.certificate_uuid
    _, file_extension = os.path.splitext(filename)
    return os.path.join(MEDIA_URL, path, str(format) + file_extension)
