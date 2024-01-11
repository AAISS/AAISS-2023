import os


def update_certificate_filename(instance, filename):
    path = "certificates/"
    if hasattr(instance, "presentation"):
        path += "presentation/"
    else:
        path += "workshop/"
    format = instance.certificate_uuid
    _, file_extension = os.path.splitext(filename)
    return os.path.join(path, str(format) + file_extension)
