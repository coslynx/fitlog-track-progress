#!/bin/bash
set -euo pipefail

NODE_ENV="${NODE_ENV:-development}"
export NODE_ENV

PROJECT_ROOT=$(pwd)
LOG_FILE="$PROJECT_ROOT/startup.log"
CLIENT_PID_FILE="$PROJECT_ROOT/client.pid"
SERVER_PID_FILE="$PROJECT_ROOT/server.pid"

log_info() {
  date +"%Y-%m-%d %H:%M:%S" "$@" >> "$LOG_FILE"
}

log_error() {
  date +"%Y-%m-%d %H:%M:%S" "$@" >&2
}

cleanup() {
  log_info "Cleaning up..."
  if [ -f "$CLIENT_PID_FILE" ]; then
    kill "$(cat "$CLIENT_PID_FILE")" 2>/dev/null
    rm "$CLIENT_PID_FILE"
  fi
    if [ -f "$SERVER_PID_FILE" ]; then
        kill "$(cat "$SERVER_PID_FILE")" 2>/dev/null
        rm "$SERVER_PID_FILE"
    fi
  log_info "Cleanup complete."
}

check_dependencies() {
    if ! command -v npm &>/dev/null; then
    log_error "Error: npm is not installed."
        exit 1
  fi
  log_info "npm is installed."
}
store_pid() {
    echo "$1" > "$2"
}
trap cleanup EXIT ERR INT TERM

log_info "Starting application setup..."
check_dependencies
if [ -f "$PROJECT_ROOT/.env" ]; then
  log_info "Loading .env file..."
  export $(grep -v '^#' "$PROJECT_ROOT/.env" | xargs)
fi

cd "$PROJECT_ROOT"
log_info "Installing npm dependencies..."
npm install || { log_error "Error installing dependencies."; exit 1; }

log_info "Starting client application..."
npm run client > "$LOG_FILE" 2>&1 &
CLIENT_PID=$!
store_pid "$CLIENT_PID" "$CLIENT_PID_FILE"
log_info "Client started with PID: $CLIENT_PID"


log_info "Starting server application..."
npm run dev > "$LOG_FILE" 2>&1 &
SERVER_PID=$!
store_pid "$SERVER_PID" "$SERVER_PID_FILE"
log_info "Server started with PID: $SERVER_PID"


log_info "Application startup complete."

wait