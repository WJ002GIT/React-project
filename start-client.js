const sleep = require('sleep-promise');
const { exec } = require('child_process');

async function startClient() {
  await sleep(1500); // Wait for 1.5 seconds

  const clientProcess = exec('npm run dev --prefix client');

  // output log
  clientProcess.stdout.on('data', (data) => {
    console.log(`Client Output: ${data}`);
  });
  //error log
  clientProcess.stderr.on('data', (data) => {
    console.error(`Client Error: ${data}`);
  });

  clientProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Client process exited with code ${code}`);
    } else {
      console.log('Client started successfully');
    }
  });
}

startClient();
