const fs = require('fs');
const net = require('net');

fs.open('pipe1', fs.constants.O_RDONLY | fs.constants.O_NONBLOCK, (err, fd) => {
  // Handle err
  const pipe = new net.Socket({ fd });
  // Now `pipe` is a stream that can be used for reading from the FIFO.
  pipe.on('data', (data) => {
    // process data ...
	console.log(data);
  });
});
