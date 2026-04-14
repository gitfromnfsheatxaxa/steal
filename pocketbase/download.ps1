# Steal Therapy — PocketBase Download Script (Windows)
# Run this from the project root: .\pocketbase\download.ps1

$ErrorActionPreference = "Stop"
$OutDir = "$PSScriptRoot"

Write-Host "Fetching latest PocketBase release..." -ForegroundColor Cyan

# Get latest release info from GitHub
$release = Invoke-RestMethod "https://api.github.com/repos/pocketbase/pocketbase/releases/latest"
$version = $release.tag_name                        # e.g. v0.27.1
$assetName = "pocketbase_" + $version.TrimStart("v") + "_windows_amd64.zip"
$asset = $release.assets | Where-Object { $_.name -eq $assetName }

if (-not $asset) {
    Write-Error "Could not find Windows asset: $assetName"
    exit 1
}

$zipPath = Join-Path $OutDir "pocketbase_tmp.zip"

Write-Host "Downloading $assetName ($([math]::Round($asset.size/1MB, 1)) MB)..." -ForegroundColor Cyan
Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zipPath -UseBasicParsing

Write-Host "Extracting..." -ForegroundColor Cyan
Expand-Archive -Path $zipPath -DestinationPath $OutDir -Force
Remove-Item $zipPath

Write-Host ""
Write-Host "PocketBase $version downloaded to: $OutDir\pocketbase.exe" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. cd pocketbase"
Write-Host "  2. .\pocketbase.exe serve"
Write-Host "  3. Open http://127.0.0.1:8090/_/ to create your admin account"
Write-Host "  4. Go to Settings > Import collections > paste pocketbase\pb_schema.json"
Write-Host "  5. In a second terminal, run: npm run dev"
