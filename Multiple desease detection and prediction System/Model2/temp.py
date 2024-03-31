import numpy as np
import pickle
import os
import sys

# Load the scaler and the trained model
model_file_path = os.path.join(os.path.dirname(__file__), 'trained_model.sav')
scalar_file_path = os.path.join(os.path.dirname(__file__), 'scaler.sav')

loaded_model = pickle.load(open(model_file_path, 'rb'))
scaler = pickle.load(open(scalar_file_path, 'rb'))

# Define your input data
#input_data = (1,119,88,41,170,45.3,0.507,26)
input_data = list(map(float, sys.argv[1:]))

# Convert input data to a numpy array and reshape it
input_data_as_numpy_array = np.asarray(input_data)
input_data_reshaped = input_data_as_numpy_array.reshape(1,-1)

# Scale the input data
std_data = scaler.transform(input_data_reshaped)

# Debugging: Print the scaled input data

# Make predictions using the loaded model
prediction = loaded_model.predict(std_data)

# Debugging: Print the prediction
print(prediction[0])
