$file = "C:\Users\rossg\.gemini\antigravity\scratch\excel_dashboard\Anonymised Booking Dashboard.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($file)
    $ws = $wb.Sheets.Item(1)
    
    # Find headers
    $headers = @{}
    $col = 1
    while ($true) {
        $val = $ws.Cells.Item(1, $col).Text
        if ([string]::IsNullOrWhiteSpace($val)) { break }
        $headers[$val] = $col
        $col++
    }
    
    $prodCol = $headers["product_code"]
    $payCol = $headers["Corporate Or Self Pay"]
    
    if (-not $prodCol -or -not $payCol) {
        Write-Host "Error: Columns not found"
        exit
    }

    $data = @()
    # Read first 100 rows
    for ($r = 2; $r -le 100; $r++) {
        $prod = $ws.Cells.Item($r, $prodCol).Text
        $pay = $ws.Cells.Item($r, $payCol).Text
        
        if (-not [string]::IsNullOrWhiteSpace($prod)) {
            $data += @{
                product_code = $prod
                corp_or_self = $pay
                totals = 100 # Dummy value for revenue
                date = "2025-01-01" # Dummy date
                location = "Test Loc"
                status = "Booked"
            }
        }
    }
    
    $json = $data | ConvertTo-Json -Depth 2 -Compress
    $json | Out-File "sample_data.json" -Encoding utf8

} catch {
    Write-Host "Error: $_"
} finally {
    if ($wb) { $wb.Close($false) }
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
