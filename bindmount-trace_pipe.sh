
PIPE_PATH=src/trace_pipe

touch $PIPE_PATH
mount --bind /sys/kernel/tracing/trace_pipe $PIPE_PATH
chmod o+x $PIPE_PATH
