#!/bin/bash

# Payment Services Startup Script
# This script starts all payment-related services including Bybit integration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$PROJECT_ROOT/logs"
PID_DIR="$PROJECT_ROOT/pids"

# Create necessary directories
mkdir -p "$LOG_DIR"
mkdir -p "$PID_DIR"

# Log file
LOG_FILE="$LOG_DIR/payment-services.log"
ERROR_LOG="$LOG_DIR/payment-services-errors.log"

# Function to log messages
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
}

# Function to check if a service is running
is_service_running() {
    local service_name="$1"
    local pid_file="$PID_DIR/${service_name}.pid"

    if [[ -f "$pid_file" ]]; then
        local pid=$(cat "$pid_file")
        if kill -0 "$pid" 2>/dev/null; then
            return 0
        else
            # Remove stale PID file
            rm -f "$pid_file"
        fi
    fi
    return 1
}

# Function to start a service
start_service() {
    local service_name="$1"
    local command="$2"
    local pid_file="$PID_DIR/${service_name}.pid"

    if is_service_running "$service_name"; then
        log "INFO" "$service_name is already running (PID: $(cat "$pid_file"))"
        return 0
    fi

    log "INFO" "Starting $service_name..."

    # Start service in background
    nohup bash -c "$command" > "$LOG_DIR/${service_name}.log" 2> "$LOG_DIR/${service_name}-error.log" &
    local pid=$!

    # Save PID
    echo "$pid" > "$pid_file"

    # Wait a moment to check if service started successfully
    sleep 2

    if kill -0 "$pid" 2>/dev/null; then
        log "SUCCESS" "$service_name started successfully (PID: $pid)"
        return 0
    else
        log "ERROR" "$service_name failed to start"
        rm -f "$pid_file"
        return 1
    fi
}

# Function to stop a service
stop_service() {
    local service_name="$1"
    local pid_file="$PID_DIR/${service_name}.pid"

    if [[ -f "$pid_file" ]]; then
        local pid=$(cat "$pid_file")
        log "INFO" "Stopping $service_name (PID: $pid)..."

        if kill -TERM "$pid" 2>/dev/null; then
            # Wait for graceful shutdown
            local count=0
            while kill -0 "$pid" 2>/dev/null && [[ $count -lt 10 ]]; do
                sleep 1
                ((count++))
            done

            # Force kill if still running
            if kill -0 "$pid" 2>/dev/null; then
                log "WARN" "Force killing $service_name (PID: $pid)"
                kill -KILL "$pid" 2>/dev/null
            fi

            rm -f "$pid_file"
            log "SUCCESS" "$service_name stopped"
        else
            log "ERROR" "Failed to stop $service_name"
            rm -f "$pid_file"
            return 1
        fi
    else
        log "INFO" "$service_name is not running"
    fi
}

# Function to check service health
check_service_health() {
    local service_name="$1"
    local health_url="$2"

    if [[ -z "$health_url" ]]; then
        return 0
    fi

    log "INFO" "Checking health of $service_name..."

    if curl -s -f "$health_url" > /dev/null 2>&1; then
        log "SUCCESS" "$service_name is healthy"
        return 0
    else
        log "ERROR" "$service_name health check failed"
        return 1
    fi
}

# Function to display service status
show_status() {
    echo -e "${BLUE}=== Payment Services Status ===${NC}"

    local services=("nextjs" "bybit-payments" "crypto-api" "p2p-api" "webhook")
    local total=0
    local running=0

    for service in "${services[@]}"; do
        local pid_file="$PID_DIR/${service}.pid"
        local status=""

        if [[ -f "$pid_file" ]]; then
            local pid=$(cat "$pid_file")
            if kill -0 "$pid" 2>/dev/null; then
                status="${GREEN}RUNNING${NC} (PID: $pid)"
                ((running++))
            else
                status="${RED}STALE${NC} (PID: $pid)"
                rm -f "$pid_file"
            fi
        else
            status="${YELLOW}STOPPED${NC}"
        fi

        printf "%-15s: %s\n" "$service" "$status"
        ((total++))
    done

    echo
    echo -e "Summary: ${GREEN}$running${NC}/${BLUE}$total${NC} services running"
}

# Function to start all services
start_all_services() {
    log "INFO" "Starting all payment services..."

    # Check if we're in the right directory
    if [[ ! -f "package.json" ]]; then
        log "ERROR" "package.json not found. Please run this script from the project root."
        exit 1
    fi

    # Check Node.js installation
    if ! command -v node &> /dev/null; then
        log "ERROR" "Node.js is not installed or not in PATH"
        exit 1
    fi

    # Check npm installation
    if ! command -v npm &> /dev/null; then
        log "ERROR" "npm is not installed or not in PATH"
        exit 1
    fi

    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        log "INFO" "Installing dependencies..."
        npm install
    fi

    # Start Next.js development server
    start_service "nextjs" "cd '$PROJECT_ROOT' && npm run dev"

    # Wait for Next.js to start
    log "INFO" "Waiting for Next.js to start..."
    sleep 10

    # Check if Next.js is running
    if is_service_running "nextjs"; then
        log "SUCCESS" "Next.js started successfully"
    else
        log "ERROR" "Failed to start Next.js"
        exit 1
    fi

    # Start additional services if needed
    # These would be started by Next.js automatically

    log "SUCCESS" "All payment services started successfully"
}

# Function to stop all services
stop_all_services() {
    log "INFO" "Stopping all payment services..."

    local services=("nextjs" "bybit-payments" "crypto-api" "p2p-api" "webhook")

    for service in "${services[@]}"; do
        stop_service "$service"
    done

    log "SUCCESS" "All payment services stopped"
}

# Function to restart all services
restart_all_services() {
    log "INFO" "Restarting all payment services..."
    stop_all_services
    sleep 2
    start_all_services
}

# Function to check environment setup
check_environment() {
    log "INFO" "Checking environment setup..."

    # Check if .env file exists
    if [[ ! -f ".env" ]]; then
        log "WARN" ".env file not found. Creating from template..."
        if [[ -f "env.example" ]]; then
            cp env.example .env
            log "INFO" "Created .env from env.example"
        else
            log "ERROR" "env.example not found. Please create a .env file manually."
            return 1
        fi
    fi

    # Check required environment variables
    local required_vars=("BYBIT_API_KEY" "BYBIT_SECRET_KEY" "BYBIT_TESTNET")
    local missing_vars=()

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        fi
    done

    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        log "WARN" "Missing environment variables: ${missing_vars[*]}"
        log "INFO" "Services will run in demo mode"
    else
        log "SUCCESS" "All required environment variables are set"
    fi

    return 0
}

# Function to run health checks
run_health_checks() {
    log "INFO" "Running health checks..."

    # Wait for services to be ready
    sleep 5

    # Check Next.js
    check_service_health "nextjs" "http://localhost:3000"

    # Check API endpoints
    check_service_health "bybit-payments" "http://localhost:3000/api/bybit-payments?action=methods"
    check_service_health "crypto-api" "http://localhost:3000/api/crypto?action=supported-cryptos"
    check_service_health "p2p-api" "http://localhost:3000/api/p2p?action=supported-cryptos"
    check_service_health "webhook" "http://localhost:3000/api/bybit-webhook"
}

# Main script logic
case "${1:-start}" in
    start)
        check_environment
        start_all_services
        run_health_checks
        show_status
        ;;
    stop)
        stop_all_services
        ;;
    restart)
        restart_all_services
        ;;
    status)
        show_status
        ;;
    health)
        run_health_checks
        ;;
    logs)
        if [[ -n "$2" ]]; then
            tail -f "$LOG_DIR/$2.log"
        else
            tail -f "$LOG_FILE"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|health|logs [service]}"
        echo
        echo "Commands:"
        echo "  start   - Start all payment services"
        echo "  stop    - Stop all payment services"
        echo "  restart - Restart all payment services"
        echo "  status  - Show status of all services"
        echo "  health  - Run health checks"
        echo "  logs    - Show logs (all or specific service)"
        echo
        echo "Examples:"
        echo "  $0 start"
        echo "  $0 status"
        echo "  $0 logs nextjs"
        exit 1
        ;;
esac