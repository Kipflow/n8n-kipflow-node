#!/bin/bash

# 🚀 Script de Release Automatizado
# Este script demonstra o fluxo de release do projeto

echo "=========================================="
echo "  🎯 Kipflow n8n Node - Release Helper"
echo "=========================================="
echo ""

# Verifica se há alterações não commitadas
if [[ -n $(git status -s) ]]; then
    echo "❌ Erro: Existem alterações não commitadas."
    echo "   Por favor, faça commit de todas as alterações antes de continuar."
    exit 1
fi

echo "✅ Working directory limpo"
echo ""

# Pergunta o tipo de release
echo "Qual tipo de release você deseja fazer?"
echo ""
echo "  1) patch  - Correções de bugs (1.0.1 → 1.0.2)"
echo "  2) minor  - Novas funcionalidades (1.0.1 → 1.1.0)"
echo "  3) major  - Breaking changes (1.0.1 → 2.0.0)"
echo ""
read -p "Digite sua escolha (1-3): " choice

case $choice in
    1)
        RELEASE_TYPE="patch"
        ;;
    2)
        RELEASE_TYPE="minor"
        ;;
    3)
        RELEASE_TYPE="major"
        ;;
    *)
        echo "❌ Escolha inválida!"
        exit 1
        ;;
esac

echo ""
echo "📦 Você escolheu: $RELEASE_TYPE"
echo ""

# Confirmação
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📌 Versão atual: $CURRENT_VERSION"
echo ""
read -p "Deseja continuar? (s/N): " confirm

if [[ ! $confirm =~ ^[SsYy]$ ]]; then
    echo "❌ Release cancelado."
    exit 0
fi

echo ""
echo "🔨 Executando checklist pré-release..."
echo ""

# Lint
echo "→ Verificando código com lint..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Erro no lint! Corrija os problemas antes de continuar."
    exit 1
fi
echo "✅ Lint OK"
echo ""

# Build
echo "→ Compilando projeto..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erro no build! Corrija os problemas antes de continuar."
    exit 1
fi
echo "✅ Build OK"
echo ""

# Executar release
echo "🚀 Iniciando release $RELEASE_TYPE..."
echo ""

npm run release:$RELEASE_TYPE

if [ $? -eq 0 ]; then
    NEW_VERSION=$(node -p "require('./package.json').version")
    echo ""
    echo "=========================================="
    echo "  ✅ Release concluído com sucesso!"
    echo "=========================================="
    echo ""
    echo "📌 Versão: $CURRENT_VERSION → $NEW_VERSION"
    echo "🏷️  Tag: v$NEW_VERSION"
    echo ""
    echo "O que foi feito:"
    echo "  ✅ Versão atualizada no package.json"
    echo "  ✅ Commit criado"
    echo "  ✅ Tag v$NEW_VERSION criada"
    echo "  ✅ Push realizado"
    echo "  ✅ Tag enviada para o repositório"
    echo ""
    echo "🎉 Pronto para publicar no npm (se necessário):"
    echo "   npm publish"
else
    echo ""
    echo "❌ Erro ao fazer release!"
    exit 1
fi
