
// pipe
const events = require('events');
const fs = require('fs');
const readline = require('readline');

// spi
const childproc = require('child_process');

// express
const http = require('http');
const express = require('express');
const path = require('path');
const ws = require('ws');
const bodyParser = require('body-parser')

const app = express();
//app.use(bodyParser.text({limit: '32000'}));
app.use(bodyParser.text());


/*let i = 0;
setInterval(() => {
    console.log('Infinite Loop Test interval n:', i++);
}, 2000)
*/
const port = 3000;
const httpServer = http.createServer(app);

// WebSocket event handling
const wsServer = new ws.WebSocketServer({server: httpServer}); //new WebSocket.Server({ port: 3030 });
wsServer.on('connection', (ws) => {
  console.log('new client connected.');

  // Event listener for incoming messages
  ws.on('message', (message) => {
    console.log('Received message:', message.toString());

    // Broadcast the message to all connected clients
    wsServer.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message.toString());
      }
    });
  });

  // Event listener for client disconnection
  ws.on('close', () => {
    console.log('A client disconnected.');
  });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'page.html'));
});


async function spi(buf) {
    var spiwrite = childproc.spawn('./spiwrite', []);
    var output = "";
    return new Promise((resolve, reject) => {
	spiwrite.stdout.on('data', (data) => {
            console.log(`Output from spiwrite: ${data.toString()}`);
	    output += data;
        });
	spiwrite.stderr.on('data', (data) => {
            console.error(`Error from spiwrite: ${data.toString()}`);
        });
        spiwrite.on('close', (code) => {
	    pid = spiwrite.pid;
            resolve({ code: code, pid: pid, output: output });
        });
	spiwrite.stdin.write(buf);
        spiwrite.stdin.end();
    });
}

app.post('/spi', async (req, res) => {
    input = req.body;
    if (Object.keys(req.body).length === 0) {
	return res.status(400).send("body is empty");
    }
    console.log(req.body);
    // "25 00 01 000192CD0000002F6D6E 742F7"
    input = input.replace(/ /g, '');
    var buf = Buffer.from(input , "hex");
    console.log(buf);

    // slow down
    await new Promise( resolve => setTimeout(resolve, 1500));

    var result = await spi(buf);
    return res.json(result);
})

app.get('/treepic', (req, res) => {
    res.sendFile('/tmp/treepic.jpg');
});

function background() {
    setTimeout( async () => {
        console.log('treepic');
        var treepic = childproc.exec('ffmpeg -y -f video4linux2 -s 640x480 -i /dev/video0 -ss 0:0:0 -frames 1 /tmp/treepic.jpg');
        await new Promise( (resolve) => {
            treepic.on('close', resolve)
        });
        background();
    }, 3000)
}
background();

// Start the server

httpServer.listen(port); //() => { console.log(`Server started on http://0.0.0.0:${port}`);});


(async function processLineByLine() {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream('trace_pipe'),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      process.stdout.write(".");
      wsServer.clients.forEach((client) => {
        if (client.readyState === ws.WebSocket.OPEN) {
          client.send(line);
        }
      });
    });

    await events.once(rl, 'close');

    console.log('Reading file line by line with readline done.');
  } catch (err) {
    console.error(err);
  }
})();

