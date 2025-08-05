const fs = require('fs');
const path = require('path');

const pkgPath = path.resolve(__dirname, 'package.json');
const pkg = require(pkgPath);

const deps = pkg.dependencies || {};

for (const [dep, version] of Object.entries(deps)) {
  if (version === 'latest') {
    try {
      const realPkg = require(`${dep}/package.json`);
      deps[dep] = `^${realPkg.version}`;
      console.log(`✔ Updated ${dep} to ^${realPkg.version}`);
    } catch (err) {
      console.warn(`⚠️  Cannot resolve version for: ${dep}`);
    }
  }
}

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
console.log('✅ package.json updated.');
