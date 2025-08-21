#!/usr/bin/env node

const fs = require('fs');

// Fix duplicate import issues
const componentsWithDuplicates = [
  'src/components/ProductAnalyticsDashboard.tsx',
  'src/components/DecentralizedDashboard.tsx',
  'src/components/ManagerDashboard.tsx',
  'src/components/AIOrchestratorDashboard.tsx'
];

function fixDuplicateImports() {
  console.log('🔧 Fixing duplicate import issues...');

  componentsWithDuplicates.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');

      // Remove the @ts-nocheck temporarily to fix imports properly
      content = content.replace('// @ts-nocheck\n', '');

      // Fix duplicate Flame imports
      content = content.replace(
        /import \{([^}]*Flame[^}]*), Flame([^}]*)\} from 'lucide-react'/g,
        'import {$1$2} from \'lucide-react\''
      );

      // Fix duplicate Database imports
      content = content.replace(
        /import \{([^}]*Database[^}]*), Database([^}]*)\} from 'lucide-react'/g,
        'import {$1$2} from \'lucide-react\''
      );

      // Clean up any remaining duplicate imports in the same line
      content = content.replace(
        /(\w+),\s*\1(?=\s*[,}])/g,
        '$1'
      );

      // Add @ts-nocheck back
      content = '// @ts-nocheck\n' + content;

      fs.writeFileSync(file, content, 'utf8');
      console.log(`✅ Fixed duplicate imports in ${file}`);
    }
  });

  console.log('🎉 All duplicate import issues fixed!');
}

if (require.main === module) {
  fixDuplicateImports();
}

module.exports = { fixDuplicateImports };