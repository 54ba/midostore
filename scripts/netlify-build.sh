#!/bin/bash

# Netlify Build Script for MidoStore
# Handles database setup, AI model training, and package installation

set -e  # Exit on any error

echo "🚀 Starting Netlify build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment variables
check_env() {
    print_status "Checking environment variables..."

    local missing_vars=()

    # Required variables
    local required_vars=("DATABASE_URL" "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" "CLERK_SECRET_KEY")

    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            missing_vars+=("$var")
        else
            print_success "$var is set"
        fi
    done

    if [[ ${#missing_vars[@]} -gt 0 ]]; then
        print_error "Missing required environment variables: ${missing_vars[*]}"
        exit 1
    fi

    print_success "Environment check passed"
}

# Function to install Node.js dependencies
install_node_deps() {
    print_status "Installing Node.js dependencies..."

    if [[ -f "package-lock.json" ]]; then
        npm ci --production=false
    else
        npm install
    fi

    print_success "Node.js dependencies installed"
}

# Function to setup Python environment
setup_python() {
    print_status "Setting up Python environment..."

    # Check if Python is available
    if ! command_exists python3; then
        print_warning "Python3 not found, skipping AI setup"
        return 0
    fi

    # Check Python version
    local python_version=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    print_status "Python version: $python_version"

    # Create AI directory if it doesn't exist
    if [[ ! -d "ai" ]]; then
        print_warning "AI directory not found, creating basic structure"
        mkdir -p ai
        echo "# Basic AI setup" > ai/requirements.txt
    fi

    # Setup Python virtual environment
    cd ai
    if [[ ! -d "venv" ]]; then
        print_status "Creating Python virtual environment..."
        python3 -m venv venv
    fi

    # Activate virtual environment
    source venv/bin/activate

    # Upgrade pip
    pip install --upgrade pip

    # Install requirements if they exist
    if [[ -f "requirements.txt" ]]; then
        print_status "Installing Python dependencies..."
        pip install -r requirements.txt
        print_success "Python dependencies installed"
    else
        print_warning "No requirements.txt found, skipping Python dependency installation"
    fi

    # Go back to root directory
    cd ..

    print_success "Python environment setup completed"
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."

    # Generate Prisma client
    print_status "Generating Prisma client..."
    npm run db:generate

    # Push database schema
    print_status "Pushing database schema..."
    npm run db:push

    print_success "Database setup completed"
}

# Function to seed database
seed_database() {
    print_status "Seeding database..."

    # Check if seeding script exists
    if [[ -f "scripts/db-seed.ts" ]]; then
        npm run db:seed
        print_success "Database seeded successfully"
    else
        print_warning "Database seeding script not found, skipping"
    fi
}

# Function to setup AI model
setup_ai_model() {
    print_status "Setting up AI model..."

    # Check if AI training is enabled
    if [[ "${ENABLE_AI_TRAINING}" != "true" ]]; then
        print_warning "AI training disabled, skipping model setup"
        return 0
    fi

    # Check if Python environment is ready
    if [[ ! -d "ai/venv" ]]; then
        print_warning "Python virtual environment not found, skipping AI setup"
        return 0
    fi

    # Activate virtual environment and check LightFM
    cd ai
    source venv/bin/activate

    if python -c "import lightfm" 2>/dev/null; then
        print_success "LightFM is available"

        # Check if model already exists
        if [[ -f "models/recommendation_model.pkl" ]]; then
            print_status "AI model already exists, skipping training"
        else
            print_status "Training AI model..."
            python recommendation_engine.py --train || {
                print_warning "AI model training failed, continuing with build"
            }
        fi
    else
        print_warning "LightFM not available, skipping AI model setup"
    fi

    cd ..

    print_success "AI model setup completed"
}

# Function to build Next.js application
build_nextjs() {
    print_status "Building Next.js application..."

    npm run build

    print_success "Next.js build completed"
}

# Function to cleanup
cleanup() {
    print_status "Cleaning up build artifacts..."

    # Remove Python virtual environment to save space
    if [[ -d "ai/venv" ]]; then
        print_status "Removing Python virtual environment to save space..."
        rm -rf ai/venv
    fi

    # Remove node_modules if not needed for production
    if [[ "${NODE_ENV}" == "production" ]]; then
        print_status "Keeping node_modules for production"
    else
        print_status "Removing node_modules to save space..."
        rm -rf node_modules
    fi

    print_success "Cleanup completed"
}

# Main build process
main() {
    print_status "Starting MidoStore build process..."

    # Check environment
    check_env

    # Install dependencies
    install_node_deps

    # Setup Python environment
    setup_python

    # Setup database
    setup_database

    # Seed database
    seed_database

    # Setup AI model
    setup_ai_model

    # Build Next.js application
    build_nextjs

    # Cleanup
    cleanup

    print_success "🎉 Build process completed successfully!"
}

# Run main function
main "$@"