#!/bin/bash

echo "🔧 MidoHub Service Manager"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SERVICES_DIR="pids"
LOGS_DIR="logs"
SERVICE_CONFIG="dynamic-config.json"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to create necessary directories
create_directories() {
    mkdir -p $SERVICES_DIR $LOGS_DIR
}

# Function to show service status
show_status() {
    echo -e "${BLUE}📊 Service Status${NC}"
    echo "=================="

    if [ ! -d "$SERVICES_DIR" ]; then
        echo -e "${YELLOW}⚠️ No services directory found${NC}"
        return
    fi

    local services_running=0
    local services_total=0

    for pid_file in $SERVICES_DIR/*.pid; do
        if [ -f "$pid_file" ]; then
            local service_name=$(basename "$pid_file" .pid)
            local pid=$(cat "$pid_file")

            if ps -p $pid > /dev/null 2>&1; then
                echo -e "  ${GREEN}✅ $service_name (PID: $pid)${NC}"
                services_running=$((services_running + 1))
            else
                echo -e "  ${RED}❌ $service_name (PID: $pid) - Not running${NC}"
                # Clean up stale PID file
                rm -f "$pid_file"
            fi
            services_total=$((services_total + 1))
        fi
    done

    echo ""
    echo -e "${BLUE}Summary: $services_running/$services_total services running${NC}"

    if [ $services_running -eq 0 ]; then
        echo -e "${YELLOW}⚠️ No services are currently running${NC}"
    fi
}

# Function to start a specific service
start_service() {
    local service_name=$1

    case $service_name in
        "dev"|"development")
            echo -e "${BLUE}🚀 Starting development server...${NC}"
            npm run dev &
            echo $! > $SERVICES_DIR/dev-server.pid
            echo -e "${GREEN}✅ Development server started${NC}"
            ;;
        "dynamic"|"services")
            echo -e "${BLUE}🚀 Starting dynamic services...${NC}"
            npm run services:start &
            echo $! > $SERVICES_DIR/dynamic-services.pid
            echo -e "${GREEN}✅ Dynamic services started${NC}"
            ;;
        "web3"|"crypto")
            echo -e "${BLUE}🚀 Starting Web3 services...${NC}"
            npm run services:web3 &
            echo $! > $SERVICES_DIR/web3-services.pid
            echo -e "${GREEN}✅ Web3 services started${NC}"
            ;;
        "ai")
            echo -e "${BLUE}🚀 Starting AI services...${NC}"
            npm run ai:start &
            echo $! > $SERVICES_DIR/ai-service.pid
            echo -e "${GREEN}✅ AI services started${NC}"
            ;;
        "all")
            echo -e "${BLUE}🚀 Starting all services...${NC}"
            start_service "dev"
            start_service "dynamic"
            start_service "web3"
            start_service "ai"
            ;;
        *)
            echo -e "${RED}❌ Unknown service: $service_name${NC}"
            echo -e "${BLUE}Available services: dev, dynamic, web3, ai, all${NC}"
            return 1
            ;;
    esac
}

# Function to stop a specific service
stop_service() {
    local service_name=$1

    case $service_name in
        "dev"|"development")
            if [ -f "$SERVICES_DIR/dev-server.pid" ]; then
                local pid=$(cat "$SERVICES_DIR/dev-server.pid")
                if ps -p $pid > /dev/null 2>&1; then
                    kill $pid
                    echo -e "${GREEN}✅ Development server stopped${NC}"
                else
                    echo -e "${YELLOW}⚠️ Development server not running${NC}"
                fi
                rm -f "$SERVICES_DIR/dev-server.pid"
            fi
            ;;
        "dynamic"|"services")
            if [ -f "$SERVICES_DIR/dynamic-services.pid" ]; then
                local pid=$(cat "$SERVICES_DIR/dynamic-services.pid")
                if ps -p $pid > /dev/null 2>&1; then
                    kill $pid
                    echo -e "${GREEN}✅ Dynamic services stopped${NC}"
                else
                    echo -e "${YELLOW}⚠️ Dynamic services not running${NC}"
                fi
                rm -f "$SERVICES_DIR/dynamic-services.pid"
            fi
            ;;
        "web3"|"crypto")
            if [ -f "$SERVICES_DIR/web3-services.pid" ]; then
                local pid=$(cat "$SERVICES_DIR/web3-services.pid")
                if ps -p $pid > /dev/null 2>&1; then
                    kill $pid
                    echo -e "${GREEN}✅ Web3 services stopped${NC}"
                else
                    echo -e "${YELLOW}⚠️ Web3 services not running${NC}"
                fi
                rm -f "$SERVICES_DIR/web3-services.pid"
            fi
            ;;
        "ai")
            if [ -f "$SERVICES_DIR/ai-service.pid" ]; then
                local pid=$(cat "$SERVICES_DIR/ai-service.pid")
                if ps -p $pid > /dev/null 2>&1; then
                    kill $pid
                    echo -e "${GREEN}✅ AI services stopped${NC}"
                else
                    echo -e "${YELLOW}⚠️ AI services not running${NC}"
                fi
                rm -f "$SERVICES_DIR/ai-service.pid"
            fi
            ;;
        "all")
            echo -e "${BLUE}🛑 Stopping all services...${NC}"
            stop_service "dev"
            stop_service "dynamic"
            stop_service "web3"
            stop_service "ai"
            ;;
        *)
            echo -e "${RED}❌ Unknown service: $service_name${NC}"
            echo -e "${BLUE}Available services: dev, dynamic, web3, ai, all${NC}"
            return 1
            ;;
    esac
}

# Function to restart a service
restart_service() {
    local service_name=$1

    echo -e "${BLUE}🔄 Restarting $service_name...${NC}"
    stop_service "$service_name"
    sleep 2
    start_service "$service_name"
}

# Function to show service logs
show_logs() {
    local service_name=$1
    local lines=${2:-50}

    case $service_name in
        "dev"|"development")
            if [ -f "$LOGS_DIR/dev-server.log" ]; then
                echo -e "${BLUE}📋 Development server logs (last $lines lines):${NC}"
                tail -n $lines "$LOGS_DIR/dev-server.log"
            else
                echo -e "${YELLOW}⚠️ No development server logs found${NC}"
            fi
            ;;
        "dynamic"|"services")
            if [ -f "$LOGS_DIR/dynamic-services.log" ]; then
                echo -e "${BLUE}📋 Dynamic services logs (last $lines lines):${NC}"
                tail -n $lines "$LOGS_DIR/dynamic-services.log"
            else
                echo -e "${YELLOW}⚠️ No dynamic services logs found${NC}"
            fi
            ;;
        "web3"|"crypto")
            if [ -f "$LOGS_DIR/web3-services.log" ]; then
                echo -e "${BLUE}📋 Web3 services logs (last $lines lines):${NC}"
                tail -n $lines "$LOGS_DIR/web3-services.log"
            else
                echo -e "${YELLOW}⚠️ No Web3 services logs found${NC}"
            fi
            ;;
        "ai")
            if [ -f "$LOGS_DIR/ai-service.log" ]; then
                echo -e "${BLUE}📋 AI services logs (last $lines lines):${NC}"
                tail -n $lines "$LOGS_DIR/ai-service.log"
            else
                echo -e "${YELLOW}⚠️ No AI services logs found${NC}"
            fi
            ;;
        *)
            echo -e "${RED}❌ Unknown service: $service_name${NC}"
            echo -e "${BLUE}Available services: dev, dynamic, web3, ai${NC}"
            return 1
            ;;
    esac
}

# Function to monitor services
monitor_services() {
    echo -e "${BLUE}📊 Monitoring services (Press Ctrl+C to stop)...${NC}"
    echo "=================================================="

    while true; do
        clear
        show_status
        echo ""
        echo -e "${BLUE}🔄 Refreshing in 5 seconds...${NC}"
        sleep 5
    done
}

# Function to show help
show_help() {
    echo -e "${BLUE}🔧 Service Manager Usage${NC}"
    echo "========================="
    echo ""
    echo "Commands:"
    echo "  status                    Show service status"
    echo "  start <service>           Start a service"
    echo "  stop <service>            Stop a service"
    echo "  restart <service>         Restart a service"
    echo "  logs <service> [lines]    Show service logs"
    echo "  monitor                   Monitor services continuously"
    echo "  help                      Show this help"
    echo ""
    echo "Services:"
    echo "  dev, development          Next.js development server"
    echo "  dynamic, services         Dynamic services"
    echo "  web3, crypto             Web3 and crypto services"
    echo "  ai                        AI services"
    echo "  all                       All services"
    echo ""
    echo "Examples:"
    echo "  $0 start all              Start all services"
    echo "  $0 stop dynamic           Stop dynamic services"
    echo "  $0 restart web3           Restart Web3 services"
    echo "  $0 logs ai 100            Show last 100 lines of AI logs"
    echo "  $0 monitor                Monitor all services"
}

# Main execution
main() {
    create_directories

    case $1 in
        "status")
            show_status
            ;;
        "start")
            if [ -z "$2" ]; then
                echo -e "${RED}❌ Please specify a service to start${NC}"
                echo -e "${BLUE}Use: $0 start <service>${NC}"
                exit 1
            fi
            start_service "$2"
            ;;
        "stop")
            if [ -z "$2" ]; then
                echo -e "${RED}❌ Please specify a service to stop${NC}"
                echo -e "${BLUE}Use: $0 stop <service>${NC}"
                exit 1
            fi
            stop_service "$2"
            ;;
        "restart")
            if [ -z "$2" ]; then
                echo -e "${RED}❌ Please specify a service to restart${NC}"
                echo -e "${BLUE}Use: $0 restart <service>${NC}"
                exit 1
            fi
            restart_service "$2"
            ;;
        "logs")
            if [ -z "$2" ]; then
                echo -e "${RED}❌ Please specify a service for logs${NC}"
                echo -e "${BLUE}Use: $0 logs <service> [lines]${NC}"
                exit 1
            fi
            show_logs "$2" "$3"
            ;;
        "monitor")
            monitor_services
            ;;
        "help"|"--help"|"-h")
            show_help
            ;;
        "")
            show_status
            ;;
        *)
            echo -e "${RED}❌ Unknown command: $1${NC}"
            echo -e "${BLUE}Use: $0 help for usage information${NC}"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"