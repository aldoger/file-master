import readline from 'readline';

function inputData(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (ans) => {
            rl.close();
            resolve(ans);
        });
    });
}

export default inputData;