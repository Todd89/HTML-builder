const fs = require('fs');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const path = require('path');
let paths = path.join(__dirname);

const rl = readline.createInterface({input, output});

function question () {
  rl.question('How are you, bro? ', (answer) => {
    
    if (answer == "exit") {
      console.log('Good luck');
      process.exit(0);
    } else {
      fs.appendFile(`${paths}/masssage.txt`, `${answer}\n`, function (error) {
        if (error) throw error 
      })
      question ()
    }
  });
}
rl.on('SIGINT', () => {
  console.log(`\nGood luck`);
  process.exit(0);
})
question ()


