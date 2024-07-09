from django.apps import AppConfig
from tensorflow.keras.models import load_model

class DetectConfig(AppConfig):
    name = 'detect'
    model = None

    def ready(self):
        # Load your Keras model here
        DetectConfig.model = load_model(r'mobilenet_v2.h5')
