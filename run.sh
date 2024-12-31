
docker stop santa-app

docker rm santa-app

docker run -d --name santa-app --init --restart on-failure -p 3000:3000 --device /dev/video0 --device /dev/spidev0.0 -v /sys/kernel/tracing/trace_pipe:/app/trace_pipe -ti santa
