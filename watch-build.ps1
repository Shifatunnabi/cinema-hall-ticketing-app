# Continuous build monitoring script
Write-Host "Starting continuous build monitoring..." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor Yellow
Write-Host ""

$buildCount = 0

while ($true) {
    $buildCount++
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    
    Write-Host "[$timestamp] Build #$buildCount - Running npm run build..." -ForegroundColor Cyan
    
    # Run the build command and capture output
    $buildResult = & npm run build 2>&1
    $exitCode = $LASTEXITCODE
    
    if ($exitCode -eq 0) {
        Write-Host "[$timestamp] Build #$buildCount - SUCCESS ✓" -ForegroundColor Green
    } else {
        Write-Host "[$timestamp] Build #$buildCount - FAILED ✗" -ForegroundColor Red
        Write-Host "Build output:" -ForegroundColor Yellow
        Write-Host $buildResult -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Waiting 10 seconds before next build..." -ForegroundColor Gray
    Start-Sleep -Seconds 10
}
