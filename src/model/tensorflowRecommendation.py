import os
import pprint
import tempfile

from typing import Dict, Text

import pandas as pd
import numpy as np
import tensorflow as tf
import tensorflow_datasets as tfds
import tensorflow_recommenders as tfrs
from tensorflow import keras

import mysql.connector

# Dataset retrieval
conn = mysql.connector.connect(
    host="127.0.0.1",
    user="jin",
    passwd="password",
    database="jobfit"
)

cursor = conn.cursor()
# cursor.execute(
#     '''select j.jobpost_id, stack from jobpost j
#     left join (select jobpost_id, stack from jobpoststack j
#     inner join stack s  on j.stack_id = s.stack_id) j2 on j.jobpost_id = j2.jobpost_id
#     where stack is not null''')
cursor.execute('''select jobpost_id, stack_id from jobpoststack
                where jobpost_id is not null and stack_id is not null''')
result = cursor.fetchall()

# xJobpost = []
# yJobpost = []
# for jobpost in result:
#     if jobpost[1] is not None:
#         stacks = jobpost[1].split(',')
#         for i in range(len(stacks)):
#             xJobpost.append(jobpost[0])
#             yJobpost.append(stacks[i])

jobpostArr = []
jobpostIds = []
for jobpost in result:
    jobpostArr.append([jobpost[0], jobpost[1]])
    jobpostIds.append(jobpost[0])
jobpostArr = np.asarray(jobpostArr).astype(np.float32)
jobpostIds = np.asarray(jobpostIds).astype(np.float32)
dfJobpost = pd.DataFrame(data=jobpostArr, columns=['jobpostId', 'stackId'])
print(dfJobpost)

# cursor.execute('''select u.user_id, stack from user u
#                 left join (select user_id, stack from userstack us
#                 left join stack s on s.stack_id=us.stack_id) t on t.user_id=u.user_id
#                 where stack is not null''')
cursor.execute('''select user_id, stack_id from userstack
                where user_id is not null and stack_id is not null''')
result = cursor.fetchall()

# xUser = []
# yUser = []
# for user in result:
#     if user[1] is not None:
#         stacks = user[1].split(',')
#         for i in range(len(stacks)):
#             xUser.append(user[0])
#             yUser.append(stacks[i])

userArr = []
userIds = []
for user in result:
    userArr.append([user[0], user[1]])
    userIds.append(user[0])
userArr = np.asarray(userArr).astype(np.float32)
userId = np.asarray(userIds).astype(np.float32)
dfUser = pd.DataFrame(data=userArr, columns=['userId', 'stackId'])
print(dfUser)

cursor.close()
conn.close()


jobpostDataset = tf.data.Dataset.from_tensor_slices(jobpostArr)
userDataset = tf.data.Dataset.from_tensor_slices(userArr)

# for x in jobpostDataset.take(1).as_numpy_iterator():
#     pprint.pprint(x)

tf.random.set_seed(42)
shuffled = userDataset.shuffle(
    100_000, seed=42, reshuffle_each_iteration=False)

train = shuffled.take(80_000)
test = shuffled.skip(80_000).take(20_000)


uniqueJobpostIds = np.unique(jobpostIds)
uniqueUserIds = np.unique(userIds)

# print(type(uniqueJobpostIds))

uniqueUserIds = tf.cast(uniqueUserIds, dtype=tf.float32)

# Query tower
embedding_dimension = 32
# userIdsVocab = tf.keras.layers.StringLookup(mask_token=None)
# userIdsVocab.adapt(dfUser['userId'])
# userModel = tf.keras.Sequential([
#     tf.keras.layers.StringLookup(
#         vocabulary=uniqueUserIds, mask_token=None),
#     # We add an additional embedding to account for unknown tokens.
#     tf.keras.layers.Embedding(len(uniqueUserIds) + 1, embedding_dimension)
# ])

# Candidate tower
# jobpostModel = tf.keras.Sequential([
#     tf.keras.layers.StringLookup(
#         vocabulary=uniqueJobpostIds, mask_token=None),
#     tf.keras.layers.Embedding(len(uniqueJobpostIds) + 1, embedding_dimension)
# ])


# class Model(tfrs.Model):
#     def __init__(self,
#                  userModel: tf.keras.Model,
#                  jobpostModel: tf.keras.Model,
#                  task: tfrs.tasks.Retrieval):
#         super().__init__()

#     # Set up user and movie representations.
#     self.userModel = userModel
#     self.jobpostModel = jobpostModel

#     # Set up a retrieval task.
#     self.task = task

#     def compute_loss(self, features: Dict[Text, tf.Tensor], training=False) -> tf.Tensor:
#         # Define how the loss is computed.

#         user_embeddings = self.userModel(features["user_id"])
#         movie_embeddings = self.jobpostModel(features["movie_title"])

#         return self.task(user_embeddings, movie_embeddings)


inputShape = (len(dfJobpost.columns,))

# Model definition
model = keras.Sequential([
    keras.layers.Dense(64, activation='relu', input_shape=inputShape),
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dense(len(dfJobpost), activation='sigmoid')
])

# Model compilation
model.compile(loss='binary_crossentropy',
              optimizer='adam', metrics=['accuracy'])
