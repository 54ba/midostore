const fs = require('fs');
const path = require('path');

const prismaSchemaPath = path.resolve(__dirname, '../prisma/schema.prisma');
let prismaSchemaContent = fs.readFileSync(prismaSchemaPath, 'utf8');

// Re-add 'url = env("DATABASE_URL")'
const newPrismaSchemaContent = prismaSchemaContent.replace(
  /(\s*provider = "postgresql")\s*(?!(url\s*=\s*env(\"DATABASE_URL\")))/,
  '$1\n  url      = env("DATABASE_URL")'
);

// Only write if there are changes
if (newPrismaSchemaContent !== prismaSchemaContent) {
  fs.writeFileSync(prismaSchemaPath, newPrismaSchemaContent);
  console.log('✅ Re-added DATABASE_URL to prisma/schema.prisma after build.');
}
