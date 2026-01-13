# 1. Sample Data
$sampleData = @(
    @{
        "date"         = "13/01/2025";
        "status"       = "Booked";
        "totals"       = "£543.38";  # SENSITIVE
        "Age"          = 50;
        "Region"       = "Ilford";
        "product_code" = "Advanced";
        "_revenue"     = 543.38      # SENSITIVE (Internal)
    },
    @{
        "date"           = "14/01/2025";
        "status"         = "Completed";
        "totals"         = "£200.00";  # SENSITIVE
        "invoice_amount" = 200; # SENSITIVE
        "Age"            = 35;
        "Region"         = "London";
        "_revenue"       = 200.00      # SENSITIVE (Internal)
    }
)

Write-Host "--- ORIGINAL DATA (First Record) ---"
$sampleData[0] | ConvertTo-Json

# 2. Sanitization Logic
$sensitiveKeys = @('totals', 'revenue', 'price', 'cost', 'invoice_amount', 'amount', 'fee', 'charge')

$sanitizedData = @()

foreach ($row in $sampleData) {
    $newRow = $row.Clone()
    
    # Remove internal revenue
    if ($newRow.ContainsKey('_revenue')) {
        $newRow.Remove('_revenue')
    }
    
    # Remove keys matching sensitive words
    $keysToRemove = @()
    foreach ($key in $newRow.Keys) {
        $lowerKey = $key.ToLower()
        foreach ($s in $sensitiveKeys) {
            if ($lowerKey -match $s) {
                $keysToRemove += $key
                break
            }
        }
    }
    
    foreach ($k in $keysToRemove) {
        $newRow.Remove($k)
    }
    
    $sanitizedData += $newRow
}

Write-Host "`n--- SANITIZED DATA (First Record) ---"
$sanitizedData[0] | ConvertTo-Json

# 3. Verification
Write-Host "`n--- VERIFICATION RESULTS ---"
$keysRemaining = $sanitizedData[0].Keys
$forbiddenFound = $false

foreach ($k in $keysRemaining) {
    if ($k -eq 'totals' -or $k -eq '_revenue' -or $k -eq 'invoice_amount') {
        Write-Host "FAILED: Found forbidden key '$k'" -ForegroundColor Red
        $forbiddenFound = $true
    }
}

if (-not $forbiddenFound) {
    Write-Host "SUCCESS: All financial data removed." -ForegroundColor Green
}
else {
    Write-Host "FAILED: Financial data still present." -ForegroundColor Red
}
