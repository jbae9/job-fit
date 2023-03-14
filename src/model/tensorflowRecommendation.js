import tf from '@tensorflow/tfjs'
const axios = require('axios')

// fetch('http://localhost:3000/api/jobpost/filter?limit=20')
//     .then((response) => {
//         response.json()
//     })
//     .then((data) => console.log(data))
//     .catch((error) => console.log(error))

async function getJobposts() {
    try {
        const response = await axios.get('http://localhost:3000/api/jobpost/filter?limit=20')
        let data = await response.data

        data = data.data.map((jobpost) => ({
            jobpostId: jobpost.jobpost_id,
            stacks: jobpost.stacks ? jobpost.stacks.split(',') : null,
        }))

        console.log(data)
        return data
    } catch (error) {
        console.log(error)
    }
}

getJobposts()

let userStacks = [
    { userId: 1, stacks: 'Java' },
    { userId: 1, stacks: 'Javascript' },
    { userId: 1, stacks: 'MySQL' },
    { userId: 2, stacks: 'Unity' },
    { userId: 2, stacks: 'ReactJS' },
    { userId: 3, stacks: 'Docker' },
    { userId: 3, stacks: 'Python' },
    { userId: 3, stacks: 'Javascript' },
]

async function createModel() {
    const model = tf.sequential()

    const tokenizer = new tf.data.text

}


// console.log(jobposts)

// const shuffled = tf.util.shuffle(data)
// const train = shuffled.take(80)
// const test = shuffled.skip(80)

// https://codelabs.developers.google.com/codelabs/tfjs-training-regression/index.html#4
// function createModel() {
//     const model = tf.sequential()

//     model.add(tf.layers.dense({ inputShape: [1], units: 1 }))
//     model.add(tf.layers.embedding())
// }

// function convertToTensor(data) {
//     return tf.tidy(() => {
//         tf.util.shuffle(data)

//         const inputs = data.map(elem => elem.jobpost_id)
//         const stacks = data.map(elem => elem.stacks.split(','))

//         const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
//         const stackTensor = tf.tensor2d(stacks, [stacks.length, 1])

//         const inputMax = inputTensor.max()
//         const inputMin = inputTensor.min()
//         const stackMax = stackTensor.max()
//         const stackMin = inputTensor.min()

//         const normalizedInputs = inputTensor
//             .sub(inputMin)
//             .div(inputMax.sub(inputMin))
//         const normalizedStacks = inputTensor
//             .sub(stackMin)
//             .div(inputMax.sub(stackMin))

//         return {
//             inputs: normalizedInputs,
//             stacks: normalizedStacks,
//             inputMax,
//             inputMin,
//             stackMax,
//             stackMin,
//         }
//     })
// }

// async function trainModel(model, inputs, labels) {
//     model.compile({
//         optimizer: tf.train.adam(),
//         loss: tf.losses.meanSquaredError,
//         metrics: ['mse'],
//     })

//     const batchSize = 32
//     const epochs = 50

//     return await model.fit(inputs, labels, {
//         batchSize,
//         epochs,
//         shuffle: true,
//         callbacks: tfvis.show.fitCallbacks(
//             { name: 'Training Performance' },
//             ['loss', 'mse'],
//             { height: 200, callbacks: ['onEpochEnd'] }
//         )
//     })
// }
