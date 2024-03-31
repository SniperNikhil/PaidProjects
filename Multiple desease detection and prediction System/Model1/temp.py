import numpy as np
import pickle
import os
import sys

model_file_path = os.path.join(os.path.dirname(__file__), 'covid_trained_model.sav')
scalar_file_path = os.path.join(os.path.dirname(__file__), 'scalar.sav')

loaded_model= pickle.load(open(model_file_path,'rb')) 
scalar=pickle.load(open(scalar_file_path,'rb'))

#input_data = (0,0,0,0,0,1,0)
input_data = list(map(float, sys.argv[1:]))

input_data_as_numpy_array = np.asarray(input_data)
input_data_reshaped = input_data_as_numpy_array.reshape(1,-1)

std_data = scalar.transform(input_data_reshaped)

prediction = loaded_model.predict(std_data)

print(prediction)