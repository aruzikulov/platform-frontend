#!/usr/bin/env bash
set -e
set -u
cd "$(dirname "$0")"

frontend_pid=0
run_frontend() {
    echo "Building production build of frontend"
    yarn build:prod

    echo "Starting up local http server"
    ../scripts/prod-like-srv.sh&
    frontend_pid=$!
    echo "Frontend running"
}

if lsof -Pi :5001 -sTCP:LISTEN -t > /dev/null ; then
    echo "Detected already started backend..."
else
    set +e
    until ./run_backend.sh;
    do
      echo "Error, retrying"
      if [ -d "./platform-backend" ]; then
        echo "Stopping containers"
        cd ./platform-backend
        make down
        cd ..
        rm -rf platform-backend
      fi
      sleep 10
    done
    set -e
fi

echo "sleeping for 120 seconds to allow for ETOs to settle"
sleep 120

if lsof -Pi :9090 -sTCP:LISTEN -t > /dev/null ; then
    echo "Detected already started frontend..."
else
    echo "Starting up frontend..."
    run_frontend
fi

yarn test:e2e:cypress:record

if [[ $frontend_pid -ne 0 ]]; then
    echo "Killing frontend server..."
    kill -9 $frontend_pid
fi
