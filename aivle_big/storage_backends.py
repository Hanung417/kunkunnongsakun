from storages.backends.s3boto3 import S3Boto3Storage

class PostBoardStorage(S3Boto3Storage):
    location = 'post_board'
    default_acl = 'public-read'
    file_overwrite = False

class PestDetectionStorage(S3Boto3Storage):
    location = 'pest_detection'
    default_acl = 'public-read'
    file_overwrite = False