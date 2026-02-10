# Guia de Contribuição

## 📋 Índice

- [Desenvolvimento](#desenvolvimento)
- [Versionamento e Releases](#versionamento-e-releases)
- [Padrões de Código](#padrões-de-código)

## 🛠️ Desenvolvimento

### Configuração Inicial

```bash
# Clone o repositório
git clone https://github.com/Kipflow/n8n-kipflow-node.git
cd n8n-kipflow-node

# Instale as dependências
npm install

# Compile o projeto
npm run build

# Desenvolvimento com watch mode
npm run dev
```

### Scripts Disponíveis

- `npm run build` - Compila o TypeScript e processa os ícones
- `npm run dev` - Modo de desenvolvimento com watch
- `npm run lint` - Verifica problemas de código
- `npm run lint:fix` - Corrige automaticamente problemas de código
- `npm run format` - Formata o código com Prettier

## 🚀 Versionamento e Releases

> 💡 **Referência Rápida:** Veja [RELEASE-GUIDE.md](RELEASE-GUIDE.md) para um guia visual e resumido.

Este projeto segue o [Semantic Versioning (SemVer)](https://semver.org/):

- **MAJOR** (X.0.0): Mudanças incompatíveis com versões anteriores
- **MINOR** (0.X.0): Novas funcionalidades mantendo compatibilidade
- **PATCH** (0.0.X): Correções de bugs

### Como Fazer um Release

#### Método Rápido (Recomendado)

Use os scripts automatizados no `package.json`:

```bash
# Para correções de bugs (1.0.1 → 1.0.2)
npm run release:patch

# Para novas funcionalidades (1.0.1 → 1.1.0)
npm run release:minor

# Para mudanças incompatíveis (1.0.1 → 2.0.0)
npm run release:major
```

Esses comandos fazem automaticamente:

1. ✅ Atualiza a versão no `package.json`
2. ✅ Cria um commit com a mensagem de versão
3. ✅ Cria uma tag git (ex: `v1.0.2`)
4. ✅ Faz push do commit
5. ✅ Faz push da tag

#### Método Assistido (Com Validações)

Para um fluxo mais seguro com validações automáticas, use o script helper:

**No Windows (PowerShell):**

```powershell
.\release.ps1
```

**No Linux/Mac:**

```bash
chmod +x release.sh
./release.sh
```

O script irá:

- Verificar se há alterações não commitadas
- Executar lint e build automaticamente
- Pedir confirmação antes de prosseguir
- Mostrar claramente o que foi feito

#### Método Manual (Passo a Passo)

Se preferir fazer manualmente ou precisar de mais controle:

```bash
# 1. Atualize a versão no package.json
npm version patch   # ou minor ou major
# Isso cria um commit e uma tag automaticamente

# 2. Faça push do commit
git push

# 3. Faça push da tag
git push --tags
```

### Antes de Fazer um Release

✅ **Checklist:**

- [ ] Todos os testes passando
- [ ] Código formatado (`npm run format`)
- [ ] Sem erros de lint (`npm run lint`)
- [ ] Build funcionando (`npm run build`)
- [ ] Documentação atualizada (se necessário)
- [ ] CHANGELOG.md atualizado (se existir)

### Exemplo de Fluxo Completo

```bash
# 1. Faça suas alterações
git add .
git commit -m "feat: adiciona nova funcionalidade X"

# 2. Verifique se está tudo OK
npm run lint
npm run build

# 3. Faça o release
npm run release:minor

# Pronto! A versão foi atualizada e publicada no git 🎉
```

### Visualizando Tags e Versões

```bash
# Ver todas as tags
git tag -l

# Ver detalhes de uma tag específica
git show v1.0.1

# Ver versão atual
npm version
```

### Desfazendo um Release (Se Necessário)

Se você criou um release por engano:

```bash
# 1. Deletar a tag localmente
git tag -d v1.0.2

# 2. Deletar a tag no repositório remoto
git push --delete origin v1.0.2

# 3. Reverter o commit de versão
git reset --hard HEAD~1

# 4. Forçar push (CUIDADO!)
git push -f
```

⚠️ **Atenção:** Só faça isso se a versão ainda não foi publicada no npm!

## 📝 Padrões de Código

### Mensagens de Commit

Seguimos o padrão de [Conventional Commits](https://www.conventionalcommits.org/):

```
tipo(escopo): descrição curta

Descrição mais detalhada (opcional)
```

**Tipos:**

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Alterações na documentação
- `style`: Formatação, ponto e vírgula, etc
- `refactor`: Refatoração de código
- `test`: Adição de testes
- `chore`: Manutenção, configurações, etc

**Exemplos:**

```bash
git commit -m "feat: adiciona suporte para múltiplos CNPJs"
git commit -m "fix: corrige validação de CNPJ inválido"
git commit -m "docs: atualiza guia de instalação"
```

**Dica:** Configure o template de commit do projeto:

```bash
git config commit.template .gitmessage
```

Isso mostrará um lembrete dos padrões toda vez que você fizer commit!

### Formatação

- Use Prettier para formatação: `npm run format`
- Use ESLint para linting: `npm run lint:fix`
- Mantenha o código TypeScript limpo e tipado

## 🤝 Processo de Contribuição

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feat/nova-funcionalidade`)
3. Commit suas mudanças seguindo os padrões
4. Push para a branch (`git push origin feat/nova-funcionalidade`)
5. Abra um Pull Request

## 📞 Dúvidas?

- Abra uma [Issue](https://github.com/Kipflow/n8n-kipflow-node/issues)
- Entre em contato: contato@kipflow.io
