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


# Data preprocessing
# jobpostStacks = dfJobpost['stackId'].astype(str).str.get_dummies(',')
jobpostStacks = pd.get_dummies(dfJobpost['stackId'])
# jobpostStacks = dfJobpost['stackId'].astype(np.float32)
# userStacks = dfUser['stackId'].astype(str).str.get_dummies(',')
userStacks = pd.get_dummies(dfUser['stackId'])
# userStacks = dfUser['stackId'].astype(np.float32)

print(jobpostStacks)
print(type(jobpostStacks))
# print(pd.get_dummies(dfJobpost['stackId']).head(10))

# Model definition
inputShape = (len(jobpostStacks.columns),)
print(inputShape)
print(len(userStacks.columns),)
print(jobpostStacks.shape)
print(userStacks.shape)
model = keras.Sequential([
    keras.layers.Dense(64, activation='relu', input_shape=None),
    keras.layers.Dense(32, activation='relu'),
    keras.layers.Dense(len(dfJobpost), activation='sigmoid')
])

# Model compilation
model.compile(loss='binary_crossentropy',
              optimizer='adam', metrics=['accuracy'])


# Train the model
model.fit(userStacks, jobpostStacks, epochs=10, batch_size=32)

# Use the model to make recommendations
# user_id = 1
# user_stack = userStacks.loc[user_id]
# user_stack = user_stack.values.reshape(1, -1)
# recommendations = model.predict(user_stack)
# recommendations = pd.DataFrame(recommendations, columns=dfJobpost['jobpostId'])
# recommendations = recommendations.transpose()
# recommendations.columns = ['recommendation_score']
# recommendations = recommendations.sort_values(
#     'recommendation_score', ascending=False)
