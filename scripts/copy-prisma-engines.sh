#!/bin/bash
set -e

echo "🔧 Post-build: Copying Prisma engines to .next output..."

# Créer les dossiers de destination si nécessaire
mkdir -p .next/standalone/node_modules/.prisma/client
mkdir -p .next/standalone/node_modules/@prisma/engines

# Copier tout le contenu de .prisma/client
if [ -d "node_modules/.prisma/client" ]; then
  echo "📦 Copying .prisma/client..."
  cp -r node_modules/.prisma/client/* .next/standalone/node_modules/.prisma/client/ || true
fi

# Copier les engines
if [ -d "node_modules/@prisma/engines" ]; then
  echo "📦 Copying @prisma/engines..."
  cp -r node_modules/@prisma/engines/* .next/standalone/node_modules/@prisma/engines/ || true
fi

# Copier aussi dans le dossier server si il existe
if [ -d ".next/server" ]; then
  echo "📦 Copying to .next/server..."
  mkdir -p .next/server/node_modules/.prisma/client
  cp -r node_modules/.prisma/client/* .next/server/node_modules/.prisma/client/ || true
fi

echo "✅ Prisma engines copied successfully!"

# Lister les fichiers copiés pour vérification
echo "📋 Files in .next/standalone/node_modules/.prisma/client:"
ls -la .next/standalone/node_modules/.prisma/client/ || echo "Directory not found"
