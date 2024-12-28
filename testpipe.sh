
PIPE_PATH=pipe1

if [ -f $PIPE_PATH ]
then
    echo pipe exists
    export PIPE_PATH
    exit 0
fi

mkfifo $PIPE_PATH

if [ $? -eq 1 ]
then
   echo error
   exit 1
fi

export PIPE_PATH
