docker run --name santa-app --init --restart unless-stopped -p 3000:3000 -p 3030:3030 --device /dev/video0 --device /dev/spidev0.0 -v /sys/kernel/tracing/trace_pipe:/app/pipe1 -ti santa
