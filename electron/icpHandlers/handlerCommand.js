async function runCommand (event, command, path) {
    return new Promise((resolve, reject) => {
      const { exec } = require('child_process');
      const options = path ? { cwd: path } : undefined;
  
      exec(command, options, (error, stdout, stderr) => {
          if (error) {
              reject({error: error.message, stdout: null, stderr: stderr});
          } else {
              resolve({error: null, stdout: stdout, stderr: stderr});
          }
        });
    });
};

module.exports = {
    runCommand
};