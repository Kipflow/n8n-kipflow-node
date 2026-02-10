#!/bin/bash

# Script de Release Automatizado
# Executa o fluxo completo: commit → push → version → tag → publish

echo "=========================================="
echo "  Kipflow n8n Node - Release Helper"
echo "=========================================="
echo ""

# Verifica se há alterações não commitadas
if [[ -n $(git status -s) ]]; then
    echo "Existem alterações não commitadas:"
    git status -s
    echo ""
    
    read -p "Deseja commitar essas alterações? (s/N): " doCommit
    
    if [[ $doCommit =~ ^[SsYy]$ ]]; then
        # Git add
        echo ""
        echo "Adicionando arquivos..."
        git add .
        
        # Pede mensagem de commit
        echo ""
        echo "Exemplos de mensagens:"
        echo "  feat: adiciona nova funcionalidade X"
        echo "  fix: corrige bug Y"
        echo "  docs: atualiza documentação"
        echo ""
        read -p "Digite a mensagem do commit: " commitMsg
        
        if [[ -z "$commitMsg" ]]; then
            echo "❌ Mensagem de commit não pode ser vazia!"
            exit 1
        fi
        
        # Git commit
        echo ""
        echo "Fazendo commit..."
        git commit -m "$commitMsg"
        
        if [ $? -ne 0 ]; then
            echo "❌ Erro ao fazer commit!"
            exit 1
        fi
        
        echo "✅ Commit realizado com sucesso"
        echo ""
        
        # Git push
        read -p "Deseja fazer push agora? (s/N): " doPush
        if [[ $doPush =~ ^[SsYy]$ ]]; then
            echo ""
            echo "Fazendo push..."
            git push
            
            if [ $? -ne 0 ]; then
                echo "❌ Erro ao fazer push!"
                exit 1
            fi
            
            echo "✅ Push realizado com sucesso"
        fi
    else
        echo "❌ Release cancelado. Commit suas alterações antes de continuar."
        exit 0
    fi
else
    echo "✅ Working directory limpo"
fi

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
    
    # Pergunta sobre publicação no npm
    read -p "Deseja publicar no npm agora? (s/N): " doPublish
    
    if [[ $doPublish =~ ^[SsYy]$ ]]; then
        echo ""
        echo "📦 Publicando no npm..."
        npm publish
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "=========================================="
            echo "  ✅ Publicado no npm com sucesso!"
            echo "=========================================="
            echo ""
            echo "📦 Versão $NEW_VERSION está disponível em:"
            echo "https://www.npmjs.com/package/n8n-nodes-kipflow"
        else
            echo ""
            echo "❌ Erro ao publicar no npm!"
            echo "Você pode tentar manualmente: npm publish"
        fi
    else
        echo ""
        echo "Para publicar depois, execute: npm publish"
    fi
else
    echo ""
    echo "❌ Erro ao fazer release!"
    exit 1
fi
