
const childproc = require('child_process')
const fs = require('fs')


async function start() {
    var buf = fs.readFileSync('red_green');
    console.log(buf);
    
    var spiwrite = childproc.exec('./spiwrite', (error) => {
	    console.error(error);
    });

    await new Promise( (resolve) => {
        spiwrite.on('close', resolve)
        spiwrite.stdin.write(buf);
        spiwrite.stdin.end();
    });
}

start()
