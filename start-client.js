const sleep = require('sleep-promise');
const { exec } = require('child_process');

async function startClient() {
  await sleep(3000); // Wait for 3 seconds

  const clientProcess = exec('npm run dev --prefix client');

  // Log stdout (normal output)
  clientProcess.stdout.on('data', (data) => {
    console.log(`Client Output: ${data}`);
  });

  // Log stderr (error output)
  clientProcess.stderr.on('data', (data) => {
    console.error(`Client Error: ${data}`);
  });

  // Log when the process exits
  clientProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Client process exited with code ${code}`);
    } else {
      console.log('Client started successfully');
    }
  });
}

startClient();
