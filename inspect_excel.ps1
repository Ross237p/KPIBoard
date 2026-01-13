$file = "C:\Users\rossg\.gemini\antigravity\scratch\excel_dashboard\Anonymised Booking Dashboard.xlsx"
$excel = New-Object -ComObject Excel.Application
$excel.Visible = $false
$excel.DisplayAlerts = $false

try {
    $wb = $excel.Workbooks.Open($file)
    $ws = $wb.Sheets.Item(1)
    
    # Get headers (Row 1)
    $headers = @()
    $col = 1
    while ($true) {
        $val = $ws.Cells.Item(1, $col).Text
        if ([string]::IsNullOrWhiteSpace($val)) { break }
        $headers += $val
        $col++
    }
    
    Write-Host "--- HEADERS ---"
    Write-Host ($headers -join ",")
    
    Write-Host "`n--- FIRST 3 ROWS ---"
    for ($r = 2; $r -le 4; $r++) {
        $rowValues = @()
        for ($c = 1; $c -lt $col; $c++) {
            $rowValues += $ws.Cells.Item($r, $c).Text
        }
        Write-Host ($rowValues -join ",")
    }

} catch {
    Write-Host "Error: $_"
} finally {
    if ($wb) { $wb.Close($false) }
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
