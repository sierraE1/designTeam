$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $repoRoot "backend"
$frontendDir = Join-Path $repoRoot "frontend"
$pythonExe = Join-Path $repoRoot ".venv\Scripts\python.exe"

if (-not (Test-Path $pythonExe)) {
    Write-Error "Python executable not found at $pythonExe. Create .venv first or update this script."
}

Push-Location $repoRoot
try {
    Write-Host "Starting Docker database..."
    docker compose up -d db | Out-Null

    Write-Host "Waiting for database health..."
    $maxAttempts = 30
    for ($attempt = 1; $attempt -le $maxAttempts; $attempt++) {
        $status = docker inspect --format='{{.State.Health.Status}}' dopaminder-db 2>$null
        if ($status -eq "healthy") {
            break
        }
        if ($attempt -eq $maxAttempts) {
            throw "Database did not become healthy in time. Check: docker compose logs db"
        }
        Start-Sleep -Seconds 2
    }

    Write-Host "Launching backend and frontend terminals..."

    $backendCmd = "Set-Location '$backendDir'; & '$pythonExe' -m uvicorn app.main:app --reload"
    $frontendCmd = "Set-Location '$frontendDir'; npm start"

    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd | Out-Null
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd | Out-Null

    Write-Host "All services launched."
    Write-Host "Frontend: http://localhost:3000"
    Write-Host "Backend:  http://127.0.0.1:8000"
}
finally {
    Pop-Location
}
