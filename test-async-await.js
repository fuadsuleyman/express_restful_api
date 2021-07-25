// function makeRequest(location) {
//     return new Promise((resolve, reject) => {
//         console.log(`Making Request to ${location}`);
//         if(location === 'Google') {
//             resolve('Google says hi')
//         } else {
//             reject('We can only talk to Google')
//         }
//     })
// }

// yuxaridaki funqsiyasinin arrow varianti
const makeRequest = (location) => {
    return new Promise((resolve, reject) => {
        console.log(`Making Request to ${location}`);
        if(location === 'Google') {
            resolve('Google says hi')
        } else {
            reject('We can only talk to Google')
        }
    })
}

// function processRequest(response) {
//     return new Promise((resolve, reject) => {
//         console.log(`Processing response`);
//         resolve(`Extra Information + ${response}`)
//     })
// }

// yuxaridaki funqsiyasinin arrow varianti
const processRequest = (response) => {
    return new Promise((resolve, reject) => {
        console.log(`Processing response`);
        resolve(`Extra Information + ${response}`)
    })
}

// yuxaridaki promise qaytaran funqsiyalari then() ile asagidaki kimi cagiririq
// makeRequest('Google')
//     .then(response => {
//         console.log('Recponse Received');
//         return processRequest(response)
//     })
//     .then(result => {
//         console.log(result);
//     })
//     .catch(err => {
//         console.log(err);
// })

// yuxaridaki kodun asagida daha elegant varianti
// async function doWork() {
//     try{
//         const response = await makeRequest('Google');
//         console.log('Recponse Received');
//         const processResult = await processRequest(response);
//         console.log(processResult);
//     }catch (err){
//         console.log(err);
//     }
// }

// yuxaridaki doWork funqsiyasinin arrow varianti
const doWork = async () =>{
    try{
        const response = await makeRequest('Googlesss');
        console.log('Recponse Received');
        const processResult = await processRequest(response);
        console.log(processResult);
    }catch (err){
        console.log(err);
    }
}

doWork()