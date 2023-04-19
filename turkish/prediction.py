from keras.models import load_model


def predict(data):

    model = load_model('/Users/evemc/FYP/AUTSLFamilyRecognition.h5')
    # making prediction
    y_pred = model.predict(data)
    y_pred = (y_pred > 0.80)
    result = "Yes" if y_pred else "No"
    return result
