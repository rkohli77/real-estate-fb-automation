#!/bin/bash

# Real Estate Facebook Automation - Quick Setup Script
# This script sets up the local development environment

set -e  # Exit on any error

echo "🏠 Real Estate Facebook Automation Setup"
echo "========================================"

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

# Check if Node.js is installed
check_nodejs() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_success "Node.js is installed: $NODE_VERSION"
        
        # Check if version is 18 or higher
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -lt 18 ]; then
            print_warning "Node.js version 18+ recommended. Current: $NODE_VERSION"
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_success "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
}

# Create project structure
create_project_structure() {
    print_status "Creating project structure..."
    
    # Create main directories
    mkdir -p src
    mkdir -p tests
    mkdir -p logs
    mkdir -p uploads
    mkdir -p config
    
    print_success "Project structure created"
}

# Initialize npm project if package.json doesn't exist
init_npm_project() {
    if [ ! -f "package.json" ]; then
        print_status "Initializing npm project..."
        npm init -y
        print_success "npm project initialized"
    else
        print_success "package.json already exists"
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Production dependencies
    npm install express axios node-cron multer sharp dotenv cors helmet
    
    # Development dependencies
    npm install -D nodemon
    
    print_success "Dependencies installed"
}

# Create environment file
create_env_file() {
    if [ ! -f ".env" ]; then
        print_status "Creating .env file..."
        
        cat > .env << 'EOF'
# Facebook API Configuration
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
FACEBOOK_PAGE_ID=your_facebook_page_id_here
FACEBOOK_ACCESS_TOKEN=your_facebook_access_token_here
FACEBOOK_USER_TOKEN=your_facebook_user_token_here
FACEBOOK_REDIRECT_URI=http://localhost:3000/auth/facebook/callback

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development
BASE_URL=http://localhost:3000

# Posting Configuration
MAX_POSTS_PER_DAY=5
OPTIMAL_POSTING_TIMES=09:00,12:00,15:00,18:00

# Debug Mode (set to true to prevent actual Facebook posting)
DEBUG_MODE=true

# Optional: Database Configuration
# DATABASE_URL=postgresql://username:password@localhost:5432/realestate_automation
EOF
        
        print_success ".env file created"
        print_warning "Please update the .env file with your actual API keys!"
    else
        print_success ".env file already exists"
    fi
}

# Update package.json scripts
update_package_scripts() {
    print_status "Updating package.json scripts..."
    
    # Use Node.js to safely update package.json
    node -e "
const fs = require('fs');
const path = './package.json';

if (!fs.existsSync(path)) {
  console.log('package.json not found');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(path, 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  'start': 'node server.js',
  'dev': 'nodemon server.js',
  'test': 'node testing-utilities.js integration',
  'test:stress': 'node testing-utilities.js stress',
  'test:batch': 'node testing-utilities.js batch',
  'test:performance': 'node testing-utilities.js performance',
  'debug:facebook': 'node facebook-debug.js full',
  'setup:check': 'node check-setup.js'
};

fs.writeFileSync(path, JSON.stringify(packageJson, null, 2));
console.log('Scripts updated successfully');
"
    
    print_success "Package scripts updated"
}

# Create a simple development server check
create_dev_check() {
    print_status "Creating development check script..."
    
    cat > check-setup.js << 'EOF'
const fs = require('fs');
require('dotenv').config();

console.log('🔍 Development Environment Check');
console.log('================================');

const checks = [
    {
        name: 'Environment file',
        test: () => fs.existsSync('.env'),
        required: true
    },
    {
        name: 'Server file',
        test: () => fs.existsSync('server.js'),
        required: true,
        note: 'Copy from the provided artifact'
    },
    {
        name: 'Facebook App ID',
        test: () => process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_ID !== 'your_facebook_app_id_here',
        required: false,
        note: 'Required for Facebook posting'
    },
    {
        name: 'Facebook Page ID',
        test: () => process.env.FACEBOOK_PAGE_ID && process.env.FACEBOOK_PAGE_ID !== 'your_facebook_page_id_here',
        required: false,
        note: 'Required for Facebook posting'
    },
    {
        name: 'Facebook Access Token',
        test: () => process.env.FACEBOOK_ACCESS_TOKEN && process.env.FACEBOOK_ACCESS_TOKEN !== 'your_facebook_access_token_here',
        required: false,
        note: 'Required for Facebook posting'
    },
    {
        name: 'OpenAI API Key',
        test: () => process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here',
        required: true,
        note: 'Required for content generation'
    },
    {
        name: 'Node modules',
        test: () => fs.existsSync('node_modules'),
        required: true,
        note: 'Run npm install'
    }
];

let allRequired = true;
let warnings = 0;

checks.forEach(check => {
    const passed = check.test();
    const status = passed ? '✅' : (check.required ? '❌' : '⚠️');
    const message = check.note ? ` (${check.note})` : '';
    
    console.log(`${status} ${check.name}${message}`);
    
    if (!passed && check.required) {
        allRequired = false;
    } else if (!passed) {
        warnings++;
    }
});

console.log('\nSummary:');
if (allRequired) {
    console.log('✅ All required checks passed!');
    if (warnings > 0) {
        console.log(`⚠️  ${warnings} optional warning(s) - some features may not work`);
    }
    console.log('\n🚀 You can start the server with: npm run dev');
    console.log('🧪 Run Facebook debug with: npm run debug:facebook');
} else {
    console.log('❌ Some required checks failed. Please fix the issues above.');
    console.log('\nNext steps:');
    console.log('1. Copy server.js from the provided code artifacts');
    console.log('2. Update .env file with your API keys');
    console.log('3. Run: npm install');
}
EOF
    
    print_success "Development check script created"
}

# Create gitignore file
create_gitignore() {
    if [ ! -f ".gitignore" ]; then
        print_status "Creating .gitignore file..."
        
        cat > .gitignore << 'EOF'
# Environment variables
.env
.env.local
.env.production

# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Logs
logs
*.log

# Directory for instrumented libs generated by jscoverage/JSCover
lib-cov

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Grunt intermediate storage
.grunt

# Bower dependency directory
bower_components

# node-waf configuration
.lock-wscript

# Compiled binary addons
build/Release

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# uploads directory
uploads/*
!uploads/.gitkeep

# logs directory
logs/*
!logs/.gitkeep

# macOS
.DS_Store

# Windows
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo
EOF
        
        print_success ".gitignore created"
    else
        print_success ".gitignore already exists"
    fi
}

# Create placeholder directories with .gitkeep
create_placeholder_dirs() {
    print_status "Creating placeholder directories..."
    
    # Create .gitkeep files for empty directories
    touch uploads/.gitkeep
    touch logs/.gitkeep
    
    print_success "Placeholder directories created"
}

# Create a simple test script
create_test_script() {
    print_status "Creating simple test script..."
    
    cat > test-basic.js << 'EOF'
// Basic test to verify server can start
const axios = require('axios');

async function testBasicSetup() {
    console.log('🧪 Basic Setup Test');
    console.log('==================');
    
    try {
        // Test if we can require the main modules
        console.log('✅ Testing module requires...');
        require('express');
        require('axios');
        require('dotenv');
        console.log('✅ All required modules available');
        
        // Test environment loading
        require('dotenv').config();
        console.log('✅ Environment variables loaded');
        
        // Test if server file exists
        const fs = require('fs');
        if (fs.existsSync('server.js')) {
            console.log('✅ server.js found');
        } else {
            console.log('❌ server.js not found - copy from artifacts');
        }
        
        console.log('\n🎯 Basic setup test completed successfully!');
        console.log('Next steps:');
        console.log('1. Copy server.js from the code artifacts');
        console.log('2. Update .env with your API keys');
        console.log('3. Run: npm run setup:check');
        
    } catch (error) {
        console.log('❌ Setup test failed:', error.message);
        console.log('\nTry running: npm install');
    }
}

testBasicSetup();
EOF
    
    print_success "Basic test script created"
}

# Main setup function
main_setup() {
    print_status "Starting setup process..."
    
    # Run all setup steps
    check_nodejs
    check_npm
    create_project_structure
    init_npm_project
    install_dependencies
    create_env_file
    update_package_scripts
    create_dev_check
    create_gitignore
    create_placeholder_dirs
    create_test_script
    
    # Final status
    echo ""
    print_success "Setup completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Copy the server.js code from the provided artifacts"
    echo "2. Update .env file with your API keys"
    echo "3. Run: npm run setup:check"
    echo "4. Start development: npm run dev"
    echo ""
    echo "Useful commands:"
    echo "  npm run setup:check    - Check if everything is configured"
    echo "  npm run debug:facebook - Debug Facebook API connection"
    echo "  npm run dev           - Start development server"
    echo "  npm run test          - Run integration tests"
    echo ""
}

# Handle command line arguments
case "${1:-setup}" in
    "setup")
        main_setup
        ;;
    "check")
        if [ -f "check-setup.js" ]; then
            node check-setup.js
        else
            print_error "Setup check script not found. Run './setup.sh setup' first"
        fi
        ;;
    "test")
        if [ -f "test-basic.js" ]; then
            node test-basic.js
        else
            print_error "Test script not found. Run './setup.sh setup' first"
        fi
        ;;
    "help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  setup (default) - Run full setup process"
        echo "  check          - Check current setup status"
        echo "  test           - Run basic tests"
        echo "  help           - Show this help"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Run '$0 help' for available commands"
        exit 1
        ;;
esac
