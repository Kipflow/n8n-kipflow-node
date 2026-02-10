# 🚀 Guia Rápido de Release

## TL;DR - Como fazer um release

```bash
# 1. Faça suas alterações e commite
git add .
git commit -m "feat: sua nova funcionalidade"

# 2. Execute o comando de release apropriado
npm run release:patch    # bugs: 1.0.1 → 1.0.2
npm run release:minor    # features: 1.0.1 → 1.1.0
npm run release:major    # breaking: 1.0.1 → 2.0.0

# Pronto! ✨
```

## 📊 Quando usar cada versão?

| Tipo      | Quando usar                                        | Exemplo                    |
| --------- | -------------------------------------------------- | -------------------------- |
| **PATCH** | Correções de bugs, melhorias pequenas              | Corrigir validação de CNPJ |
| **MINOR** | Novas funcionalidades, sem quebrar compatibilidade | Adicionar novo dataset     |
| **MAJOR** | Mudanças que quebram compatibilidade               | Remover campo obrigatório  |

## 🔄 Fluxo Visual

```
┌─────────────────────────────────────────────────────────────┐
│  1. DESENVOLVIMENTO                                          │
├─────────────────────────────────────────────────────────────┤
│  $ git add .                                                 │
│  $ git commit -m "feat: nova funcionalidade"                │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  2. VALIDAÇÃO (Automática no prepublishOnly)                │
├─────────────────────────────────────────────────────────────┤
│  ✓ npm run lint                                             │
│  ✓ npm run build                                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  3. RELEASE                                                  │
├─────────────────────────────────────────────────────────────┤
│  $ npm run release:minor                                     │
│                                                              │
│  Isso executa:                                               │
│  • npm version minor  ──→ Atualiza package.json             │
│                      └──→ Cria commit com msg "1.1.0"      │
│                      └──→ Cria tag "v1.1.0"                │
│  • git push          ──→ Envia commit                       │
│  • git push --tags   ──→ Envia tag                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│  4. PUBLICAÇÃO (Opcional)                                    │
├─────────────────────────────────────────────────────────────┤
│  $ npm publish                                               │
└─────────────────────────────────────────────────────────────┘
```

## 💻 Comandos Úteis

### Verificar antes do release

```bash
npm run lint          # Verifica erros
npm run build         # Testa compilação
git status            # Vê alterações não commitadas
```

### Ver versões e tags

```bash
npm version           # Versão atual
git tag -l            # Lista todas as tags
git show v1.0.1       # Detalhes de uma tag
```

### Desfazer release (emergência)

```bash
git tag -d v1.0.2              # Remove tag local
git push --delete origin v1.0.2  # Remove tag remota
git reset --hard HEAD~1         # Volta commit
```

## 📋 Checklist Pré-Release

Antes de fazer `npm run release:*`, verifique:

- [ ] ✅ Código testado localmente
- [ ] ✅ `npm run lint` sem erros
- [ ] ✅ `npm run build` funcionando
- [ ] ✅ Commits com mensagens descritivas
- [ ] ✅ Documentação atualizada (se necessário)
- [ ] ✅ Todas as alterações commitadas

## 🎯 Exemplos Práticos

### Cenário 1: Corrigi um bug

```bash
# Código corrigido e commitado
git commit -m "fix: corrige validação de CNPJ com caracteres especiais"

# Release patch
npm run release:patch
```

### Cenário 2: Adicionei nova funcionalidade

```bash
# Código novo e commitado
git commit -m "feat: adiciona suporte para consulta em lote"

# Release minor
npm run release:minor
```

### Cenário 3: Mudança que quebra compatibilidade

```bash
# Código com breaking change commitado
git commit -m "feat!: remove campo legado 'old_api_field'"

# Release major
npm run release:major
```

## 🛡️ Segurança

**⚠️ NUNCA:**

- Faça release com alterações não commitadas
- Force push (`git push -f`) em branches principais
- Delete tags de versões já publicadas no npm

**✅ SEMPRE:**

- Teste localmente antes do release
- Siga o Semantic Versioning
- Documente breaking changes

## 🆘 Troubleshooting

### "Permission denied" no git push

```bash
# Verifique suas credenciais git
git config --list | grep user
```

### Tag já existe

```bash
# Delete a tag local e remota primeiro
git tag -d v1.0.1
git push --delete origin v1.0.1

# Tente novamente
npm run release:patch
```

### Esqueci de algo antes do release

```bash
# Se ainda não fez push:
git reset --soft HEAD~1   # Mantém alterações
# Faça as correções necessárias

# Se já fez push (crie um novo patch):
npm run release:patch
```

## 📚 Documentação Completa

Para informações detalhadas, consulte:

- [CONTRIBUTING.md](CONTRIBUTING.md) - Guia completo de contribuição
- [README.md](README.md) - Documentação do projeto

## 🎓 Scripts Auxiliares

Para um fluxo guiado com validações:

```powershell
# Windows
.\release.ps1

# Linux/Mac
./release.sh
```

---

**Dica** 💡: Salve este arquivo nos favoritos para consulta rápida!
