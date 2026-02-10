# Script de Release Automatizado
# Executa o fluxo completo de versionamento

Write-Host "=========================================="
Write-Host "  Kipflow n8n Node - Release Helper"
Write-Host "=========================================="
Write-Host ""

# Verifica alteracoes nao commitadas
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "Erro: Existem alteracoes nao commitadas." -ForegroundColor Red
    Write-Host "Faca commit de todas as alteracoes antes de continuar." -ForegroundColor Yellow
    exit 1
}

Write-Host "Working directory limpo" -ForegroundColor Green
Write-Host ""

# Pergunta o tipo de release
Write-Host "Qual tipo de release?"
Write-Host ""
Write-Host "  1) patch  - Bugs (1.0.1 -> 1.0.2)"
Write-Host "  2) minor  - Features (1.0.1 -> 1.1.0)"
Write-Host "  3) major  - Breaking (1.0.1 -> 2.0.0)"
Write-Host ""
$choice = Read-Host "Digite sua escolha (1-3)"

switch ($choice) {
    "1" { $releaseType = "patch" }
    "2" { $releaseType = "minor" }
    "3" { $releaseType = "major" }
    default {
        Write-Host "Escolha invalida!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Voce escolheu: $releaseType" -ForegroundColor Cyan
Write-Host ""

# Confirmacao
$packageJson = Get-Content "package.json" | ConvertFrom-Json
$currentVersion = $packageJson.version
Write-Host "Versao atual: $currentVersion" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Deseja continuar? (s/N)"

if ($confirm -notmatch "^[SsYy]$") {
    Write-Host "Release cancelado." -ForegroundColor Red
    exit 0
}

Write-Host ""
Write-Host "Executando checklist pre-release..." -ForegroundColor Cyan
Write-Host ""

# Lint
Write-Host "Verificando codigo com lint..."
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no lint! Corrija antes de continuar." -ForegroundColor Red
    exit 1
}
Write-Host "Lint OK" -ForegroundColor Green
Write-Host ""

# Build
Write-Host "Compilando projeto..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Erro no build! Corrija antes de continuar." -ForegroundColor Red
    exit 1
}
Write-Host "Build OK" -ForegroundColor Green
Write-Host ""

# Executar release
Write-Host "Iniciando release $releaseType..." -ForegroundColor Cyan
Write-Host ""

$scriptBlock = "npm run release:$releaseType"
Invoke-Expression $scriptBlock

if ($LASTEXITCODE -eq 0) {
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    $newVersion = $packageJson.version
    Write-Host ""
    Write-Host "=========================================="
    Write-Host "  Release concluido com sucesso!" -ForegroundColor Green
    Write-Host "=========================================="
    Write-Host ""
    Write-Host "Versao: $currentVersion -> $newVersion" -ForegroundColor Yellow
    Write-Host "Tag: v$newVersion" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "O que foi feito:"
    Write-Host "  - Versao atualizada no package.json" -ForegroundColor Green
    Write-Host "  - Commit criado" -ForegroundColor Green
    Write-Host "  - Tag v$newVersion criada" -ForegroundColor Green
    Write-Host "  - Push realizado" -ForegroundColor Green
    Write-Host "  - Tag enviada para o repositorio" -ForegroundColor Green
    Write-Host ""
    Write-Host "Pronto para publicar no npm (se necessario):" -ForegroundColor Cyan
    Write-Host "   npm publish"
}
else {
    Write-Host ""
    Write-Host "Erro ao fazer release!" -ForegroundColor Red
    exit 1
}
