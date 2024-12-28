
// pipe
const events = require('events');
const fs = require('fs');
const readline = require('readline');

// spi
const childproc = require('child_process');

// express
const express = require('express');
const path = require('path');
const WebSocket = require('ws');
const bodyParser = require('body-parser')

const app = express();
app.use(bodyParser.text());
const wss = new WebSocket.Server({ port: 3333 });

/*
function background() {
    setTimeout(() => {
        console.log('awake');
        trace_pipe();
        background();
    }, 1000)
}
//background();

/*let i = 0;
setInterval(() => {
    console.log('Infinite Loop Test interval n:', i++);
}, 2000)
*/

// WebSocket event handling
wss.on('connection', (ws) => {
  console.log('new client connected.');

  // Event listener for incoming messages
  ws.on('message', (message) => {
    console.log('Received message:', message.toString());

    // Broadcast the message to all connected clients
    wss.clients.forEach((client) => {
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

    var spiwrite = childproc.exec('cat', []);
    spiwrite.stdin.write(buf);
    spiwrite.stdin.end();
    await new Promise( (resolve) => {
        spiwrite.on('close', resolve)
    });

    var pid = 999; // TODO
    response = {
        received: input,
        parsed: buf,
        pid: pid
    }
    return res.json(response)
})

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});


(async function processLineByLine() {
  try {
    const rl = readline.createInterface({
      input: fs.createReadStream('pipe1'),
      crlfDelay: Infinity
    });

    rl.on('line', (line) => {
      process.stdout.write(".");
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
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

