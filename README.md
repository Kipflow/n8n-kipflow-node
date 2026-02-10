# n8n-nodes-kipflow

Este é um node customizado do n8n para enriquecimento de dados de empresas brasileiras usando CNPJ através da API do Kipflow.

## Instalação

### Para uso no n8n

#### Instalação via npm (Community Node)
1. No n8n, vá em **Settings** > **Community Nodes**
2. Clique em **Install Community Node**
3. Digite: `n8n-nodes-kipflow`
4. Clique em Install

#### Instalação manual
```bash
npm install n8n-nodes-kipflow
```

### Para desenvolvimento

```bash
# Clone o repositório
git clone https://github.com/Kipflow/n8n-kipflow-node.git
cd n8n-kipflow-node

# Instale as dependências
npm install

# Compile o projeto
npm run build

# Para desenvolvimento com watch mode
npm run dev
```

## Configuração

1. Obtenha sua API Key em [Kipflow](https://kipflow.io)
2. No n8n, adicione uma nova credencial do tipo "Kipflow API"
3. Cole sua API Key

## Uso

O node **Kipflow CNPJ Enrichment** enriquece dados de empresas brasileiras usando o CNPJ.

### Parâmetros

- **CNPJ**: O CNPJ da empresa (com ou sem formatação)
- **Datasets**: Selecione os datasets que deseja obter:
  - **Básico** (R$ 0,02) - Dados básicos da empresa
  - **Completo** (R$ 0,24) - Dados completos
  - **Endereço** (R$ 0,07) - Informações de endereço
  - **Presença Online** (R$ 0,12) - Website, redes sociais, etc.
  - **Sócios** (R$ 0,08) - Informações sobre os sócios

### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "cnpj": "12345678000190",
    "razao_social": "Empresa Exemplo LTDA",
    "nome_fantasia": "Exemplo",
    "situacao": "ATIVA",
    ...
  }
}
```

## Scripts disponíveis

- `npm run build` - Compila o projeto
- `npm run dev` - Compila em modo watch
- `npm run lint` - Verifica problemas no código
- `npm run lint:fix` - Corrige problemas automaticamente
- `npm run format` - Formata o código

## Como fazer atualizações

### 1. Modificar o código

Edite os arquivos em:
- `nodes/KipflowCnpjEnrichment/` - Lógica do node
- `credentials/` - Configuração de credenciais

### 2. Testar localmente

```bash
# Recompile após mudanças
npm run build

# Ou use watch mode durante desenvolvimento
npm run dev
```

### 3. Testar no n8n local

```bash
# Link o pacote local
npm link

# No diretório do n8n
npm link n8n-nodes-kipflow

# Reinicie o n8n
```

### 4. Atualizar versão

Edite o `version` no `package.json` seguindo [Semantic Versioning](https://semver.org/):
- **MAJOR** (1.0.0 → 2.0.0): Breaking changes
- **MINOR** (1.0.0 → 1.1.0): Novas funcionalidades
- **PATCH** (1.0.0 → 1.0.1): Correções de bugs

```bash
# Ou use o comando npm
npm version patch  # ou minor, ou major
```

### 5. Publicar

```bash
# Login no npm (primeira vez)
npm login

# Publique
npm publish
```

## Estrutura do Projeto

```
n8n-nodes-kipflow/
├── credentials/
│   ├── KipflowApi.credentials.ts
│   └── DrivaSearchApi.credentials.ts
├── nodes/
│   └── KipflowCnpjEnrichment/
│       ├── KipflowCnpjEnrichment.node.ts
│       ├── KipflowCnpjEnrichment.node.json
│       └── kipflow-logo.svg
├── dist/                      # Arquivos compilados
├── package.json
├── tsconfig.json
├── gulpfile.js
├── .eslintrc.js
├── .prettierrc
└── README.md
```

## Licença

MIT

## Suporte

- Documentação: https://docs.kipflow.io
- Issues: https://github.com/Kipflow/n8n-kipflow-node/issues
