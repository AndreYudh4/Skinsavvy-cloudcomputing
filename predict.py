import sys
import json
import numpy as np
from keras.models import load_model

# Fungsi untuk melakukan prediksi
def predict(input_data):
    model = load_model('models/model_local.h5')
    data = np.array(input_data).reshape(1, -1)  # Sesuaikan sesuai dengan input model Anda
    prediction = model.predict(data)
    return prediction.tolist()

if __name__ == "__main__":
    input_data = json.loads(sys.argv[1])
    result = predict(input_data)
    print(json.dumps(result))
