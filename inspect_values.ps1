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
    
    # Helper to get uniques
    function Get-Uniques($colName) {
        $c = $headers[$colName]
        if (-not $c) { Write-Host "Column '$colName' not found"; return }
        
        $vals = @{}
        $r = 2
        while ($true) {
            $v = $ws.Cells.Item($r, $c).Text
            if ([string]::IsNullOrWhiteSpace($v) -and $r -gt 1000) { break } # Safety break
            if (-not [string]::IsNullOrWhiteSpace($v)) { $vals[$v] = $true }
            $r++
        }
        Write-Host "`n--- Unique $colName ---"
        $vals.Keys | Sort-Object
    }

    Get-Uniques "product_code"
    Get-Uniques "Corporate Or Self Pay"

} catch {
    Write-Host "Error: $_"
} finally {
    if ($wb) { $wb.Close($false) }
    $excel.Quit()
    [System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null
}
