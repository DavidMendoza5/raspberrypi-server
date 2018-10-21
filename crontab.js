const cron = require('node-cron')
const exec = require('child_process').exec;

var task = cron.schedule('* * * * *', () => {
    exec('sudo nodemon /home/pi/Desktop/raspberrypi-server/index.js', async (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return
        }
        console.log(stdout)
      });
}, true)
task.start()