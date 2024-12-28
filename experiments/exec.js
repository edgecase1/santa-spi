


var childproc = require('child_process');

var spiwrite = childproc.spawn('cat', []);

spiwrite.stdin.write(Buffer.from("424241", "hex"));

spiwrite.stdout.on('data', function(data) {
    console.log(data);
});
spiwrite.stdin.end();
