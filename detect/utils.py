from PIL import Image
import numpy as np
from tensorflow.keras.preprocessing import image
from .apps import DetectConfig

def process_image(image_file):
    """Process the image and return predictions."""
    img = Image.open(image_file).convert('RGB')
    img = img.resize((224, 224))  # Resize image to match model expected input
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
    img_array /= 255.0  # Normalize to [0,1]

    predictions = DetectConfig.model.predict(img_array)
    predicted_index = np.argmax(predictions, axis=1)[0]
    confidence = np.max(predictions) * 100
    return predicted_index, confidence
