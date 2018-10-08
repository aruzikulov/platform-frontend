#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

BACKEND_SHA=a248b476ad7e528ddf545f38f4905e6d6927a811

# we tag images with shorter SHA
BACKEND_SHORT_SHA=${BACKEND_SHA:0:7}

echo "BACKEND_SHA: ${BACKEND_SHA}";
echo "BACKEND_SHORT_SHA: ${BACKEND_SHORT_SHA}";

if [[ -z "${REGISTRY_HOST}" ]]; then
  echo "You need to provide REGISTRY_HOST env var";
  exit 1;
fi

if [[ -z "${REGISTRY_USER}" ]]; then
  echo "You need to provide REGISTRY_USER env var";
  exit 1;
fi

if [[ -z "${REGISTRY_PASS}" ]]; then
  echo "You need to provide REGISTRY_PASS env var";
  exit 1;
fi


run_backend() {
    # copy config e2e as default .env if doesnt exist
    cp -n ../app/config/.env.e2e ../.env || true

    echo "Cloning backend repo..."
    if [[ -z "${BACKEND_DEPLOYMENT_KEY}" ]]; then
        if [ ! -d "./platform-backend" ]; then
            git clone git@github.com:Neufund/platform-backend.git
        fi

        cd ./platform-backend
        echo "resetting backend to ${BACKEND_SHA}"
        git pull
        git reset --hard ${BACKEND_SHA}
        cd ..
    else
        if [ ! -d "./platform-backend" ]; then
            echo "using env variable"
            echo "${BACKEND_DEPLOYMENT_KEY}" | base64 -d > "./cert"
            chmod 600 ./cert
            ssh-agent sh -c "ssh-add ./cert && git clone git@github.com:Neufund/platform-backend.git && cd ./platform-backend && git reset --hard ${BACKEND_SHA} && git status"
        fi
    fi

    echo ${REGISTRY_PASS} | docker login ${REGISTRY_HOST} --username ${REGISTRY_USER} --password-stdin

    echo "Running backend"
    cd ./platform-backend

    make docker-pull tag=dev_${BACKEND_SHORT_SHA}
    echo "Pulling images done."

    make prerequisites-dev
    make run-remote-dev-without-build

    echo "sleeping for 120 seconds to allow for ETOs to settle"
    sleep 120

    cd ..
    echo "Backend running"
}

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
    echo "Starting up backend..."
    run_backend
fi

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
