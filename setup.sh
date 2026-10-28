#!/bin/bash

# PrintCare Management System - Setup Script
# This script automates the setup process for development

set -e

echo "🖨️  PrintCare Management System - Setup Script"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if running on supported OS
check_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        print_status "Running on Linux"
        OS="linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        print_status "Running on macOS"
        OS="macos"
    elif [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "msys" ]]; then
        print_status "Running on Windows"
        OS="windows"
    else
        print_error "Unsupported operating system: $OSTYPE"
        exit 1
    fi
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js found: $NODE_VERSION"
        
        # Check if version is >= 18
        MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | cut -d'v' -f2)
        if [ "$MAJOR_VERSION" -ge "18" ]; then
            print_status "Node.js version is compatible"
        else
            print_error "Node.js version must be >= 18. Current: $NODE_VERSION"
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js >= 18"
        exit 1
    fi
}

# Check if PostgreSQL is installed and running
check_postgresql() {
    if command -v psql &> /dev/null; then
        print_status "PostgreSQL client found"
        
        if command -v pg_ctl &> /dev/null; then
            print_status "PostgreSQL server tools found"
        fi
        
        # Try to connect to PostgreSQL
        if sudo -u postgres psql -c "SELECT version();" &> /dev/null; then
            print_status "PostgreSQL server is running"
            return 0
        else
            print_warning "PostgreSQL server is not running or not accessible"
            return 1
        fi
    else
        print_error "PostgreSQL is not installed"
        return 1
    fi
}

# Install PostgreSQL
install_postgresql() {
    print_info "Installing PostgreSQL..."
    
    if [ "$OS" == "linux" ]; then
        if command -v apt-get &> /dev/null; then
            sudo apt update
            sudo apt install -y postgresql postgresql-contrib
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
        elif command -v yum &> /dev/null; then
            sudo yum install -y postgresql-server postgresql-contrib
            sudo postgresql-setup initdb
            sudo systemctl start postgresql
            sudo systemctl enable postgresql
        else
            print_error "Package manager not supported. Please install PostgreSQL manually."
            exit 1
        fi
    elif [ "$OS" == "macos" ]; then
        if command -v brew &> /dev/null; then
            brew install postgresql@15
            brew services start postgresql@15
        else
            print_error "Homebrew not found. Please install PostgreSQL manually."
            exit 1
        fi
    else
        print_error "Please install PostgreSQL manually for your operating system"
        exit 1
    fi
}

# Setup PostgreSQL database and user
setup_database() {
    print_info "Setting up PostgreSQL database..."
    
    DB_NAME="printcare_db"
    DB_USER="printcare_user"
    DB_PASSWORD="printcare123"
    
    # Create database and user
    sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS ${DB_NAME};
DROP USER IF EXISTS ${DB_USER};

CREATE USER ${DB_USER} WITH ENCRYPTED PASSWORD '${DB_PASSWORD}';
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};

GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
GRANT ALL ON SCHEMA public TO ${DB_USER};
ALTER USER ${DB_USER} CREATEDB;

\q
EOF

    if [ $? -eq 0 ]; then
        print_status "Database and user created successfully"
        
        # Test connection
        if PGPASSWORD=${DB_PASSWORD} psql -h localhost -U ${DB_USER} -d ${DB_NAME} -c "SELECT version();" &> /dev/null; then
            print_status "Database connection test successful"
            return 0
        else
            print_error "Database connection test failed"
            return 1
        fi
    else
        print_error "Failed to create database and user"
        return 1
    fi
}

# Setup environment file
setup_env_file() {
    print_info "Creating environment configuration..."
    
    DB_USER="printcare_user"
    DB_PASSWORD="printcare123"
    DB_NAME="printcare_db"
    
    # Generate a random secret key
    SECRET_KEY=$(openssl rand -base64 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 32)
    
    cat > .env.local << EOF
# Database Configuration
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@localhost:5432/${DB_NAME}?schema=public"

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET="${SECRET_KEY}"

# Email Configuration (Gmail example - update with your details)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM="PrintCare System <your-email@gmail.com>"

# Application Settings
NODE_ENV=development
COMPANY_NAME="PrintCare Solutions"
COMPANY_EMAIL="support@printcare.com"
COMPANY_PHONE="+91-XXXX-XXXX-XXX"

# Security Settings
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=30d
DEBUG_MODE=true
EOF

    print_status "Environment file created: .env.local"
    print_warning "Please update the email settings in .env.local with your SMTP details"
}

# Install npm dependencies
install_dependencies() {
    print_info "Installing npm dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
        print_status "Dependencies installed successfully"
    else
        print_error "package.json not found. Make sure you're in the project directory."
        exit 1
    fi
}

# Setup Prisma
setup_prisma() {
    print_info "Setting up Prisma..."
    
    # Generate Prisma client
    npx prisma generate
    print_status "Prisma client generated"
    
    # Push database schema
    npx prisma db push
    print_status "Database schema pushed"
    
    # Seed database
    if [ -f "prisma/seed.ts" ]; then
        npx prisma db seed
        print_status "Database seeded with initial data"
    else
        print_warning "Seed file not found, skipping database seeding"
    fi
}

# Test the setup
test_setup() {
    print_info "Testing the setup..."
    
    # Test database connection
    if [ -f "scripts/test-db-connection.js" ]; then
        node scripts/test-db-connection.js
    fi
    
    # Test email configuration (optional)
    # npm run test:email
    
    print_status "Setup testing completed"
}

# Main setup function
main() {
    echo
    print_info "Starting PrintCare Management System setup..."
    echo
    
    # Pre-flight checks
    check_os
    check_node
    
    # PostgreSQL setup
    if ! check_postgresql; then
        read -p "PostgreSQL not found. Install it now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            install_postgresql
        else
            print_error "PostgreSQL is required for this application"
            exit 1
        fi
    fi
    
    # Database setup
    print_info "Setting up database..."
    if setup_database; then
        print_status "Database setup completed"
    else
        print_error "Database setup failed"
        exit 1
    fi
    
    # Environment setup
    setup_env_file
    
    # Dependencies
    install_dependencies
    
    # Prisma setup
    setup_prisma
    
    # Test setup
    test_setup
    
    echo
    print_status "🎉 Setup completed successfully!"
    echo
    print_info "Next steps:"
    echo "  1. Update email settings in .env.local"
    echo "  2. Run 'npm run dev' to start the development server"
    echo "  3. Visit http://localhost:3000"
    echo "  4. Login with: username=admin, password=admin123"
    echo
    print_info "Useful commands:"
    echo "  npm run dev          - Start development server"
    echo "  npm run db:studio    - Open Prisma Studio"
    echo "  npm run db:seed      - Re-seed database"
    echo "  npm run db:reset     - Reset database"
    echo
}

# Run main function
main "$@"