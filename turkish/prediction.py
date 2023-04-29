from keras.models import load_model
import cv2
import mediapipe as mp
import numpy as np

sequence = []
threshold = 0.5
mp_holistic = mp.solutions.holistic  # Holistic model

# Actions that we try to detect
actions = np.array(
    ['father', 'mother', 'sister', 'brother', 'grandmother', 'grandfather', 'baby', 'child', 'family', 'friend',
     'house'])


def mediapipe_detection(image, model):
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)  # COLOR CONVERSION BGR 2 RGB
    image.flags.writeable = False  # Image is no longer writeable
    results = model.process(image)  # Make prediction
    image.flags.writeable = True  # Image is now writeable
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)  # COLOR COVERSION RGB 2 BGR
    return image, results


def extract_keypoints_nf(results):
    pose = np.array([[res.x, res.y, res.z, res.visibility] for res in
                     results.pose_landmarks.landmark]).flatten() if results.pose_landmarks else np.zeros(33 * 4)
    lh = np.array([[res.x, res.y, res.z] for res in
                   results.left_hand_landmarks.landmark]).flatten() if results.left_hand_landmarks else np.zeros(21 * 3)
    rh = np.array([[res.x, res.y, res.z] for res in
                   results.right_hand_landmarks.landmark]).flatten() if results.right_hand_landmarks else np.zeros(
        21 * 3)
    return np.concatenate([pose, lh, rh])


def predict(filepath):
    cap = cv2.VideoCapture(filepath)

    with mp_holistic.Holistic(min_detection_confidence=0.5, min_tracking_confidence=0.5) as holistic:

        # checks whether frames were extracted
        success = 1

        while success:

            # Read feed
            success, frame = cap.read()

            if not success:
                break

            # Make detections
            image, results = mediapipe_detection(frame, holistic)

            # 2. Prediction logic
            keypoints = extract_keypoints_nf(results)
            sequence.append(keypoints)
            # making prediction
            model = load_model('model/LSTMSoftmax1.h5')

            if len(sequence) == 50:
                res = model.predict(np.expand_dims(sequence, axis=0))[0]
                # print(actions[np.argmax(res)])
                if res[np.argmax(res)] > threshold:
                    print(actions[np.argmax(res)])

        result = actions[np.argmax(res)]
        return result
