const fs = require('fs');
const path = require('path');

console.log('Checking TypeScript setup...\n');

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'backend', 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.error('❌ node_modules folder not found!');
    console.log('   Please run: npm install\n');
    process.exit(1);
}

// Check for important packages
const packages = [
    '@types/node',
    'typescript',
    'ts-node',
    'express',
    '@prisma/client'
];

let allFound = true;
packages.forEach(pkg => {
    const pkgPath = path.join(nodeModulesPath, pkg);
    if (fs.existsSync(pkgPath)) {
        console.log(`✅ ${pkg} is installed`);
    } else {
        console.error(`❌ ${pkg} is NOT installed`);
        allFound = false;
    }
});

console.log('\n========================================');
if (allFound) {
    console.log('✅ All required packages are installed!');
    console.log('   You can now run: npm run dev');
} else {
    console.log('❌ Some packages are missing.');
    console.log('   Please run: npm install');
}
console.log('========================================\n');
