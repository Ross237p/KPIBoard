# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a client-side Excel-to-HTML dashboard application for healthcare booking analytics. It converts Excel booking data into interactive web visualizations with Chart.js, featuring secure client exports that automatically strip financial information.

## Running the Dashboard

**Open the dashboard:**
```bash
# Simply open index.html in a browser (no build step required)
start index.html  # Windows
open index.html   # macOS
```

**Testing utilities:**
```bash
# Verify financial data sanitization (Python)
python verify_security.py

# Verify financial data sanitization (PowerShell)
powershell -File verify_security.ps1

# Inspect Excel file structure
python inspect_excel.py

# Extract sample data from Excel file
powershell -File extract_sample.ps1
```

## Architecture

### Core Technology Stack
- **Pure client-side** - No backend server required
- **XLSX.js** - Excel file parsing in the browser
- **Chart.js** - Data visualization with Chart.js v4 + datalabels plugin
- **SortableJS** - Drag-and-drop chart rearrangement
- **Vanilla JavaScript** - No framework dependencies

### Data Flow Pipeline

```
Excel Upload → XLSX.js Parse → Data Cleaning → Chart Rendering
                                     ↓
                              KPI Calculation
                                     ↓
                              Table Population
```

**Key transformation steps in `processData()` (app.js:80-116):**
1. Parse `totals` field (removes £ symbol, converts to float) → `_revenue`
2. Parse `date` field (DD/MM/YYYY format) → `_date` Date object
3. Extract `Age` → `_age` integer
4. Normalize `Region`, `status`, `Corporate Or Self Pay` → `_region`, `_status`, `_type`

### Chart System Architecture

**Chart storage:** All Chart.js instances are stored in the global `charts` object (app.js:43) with canvas IDs as keys. This allows:
- Destroying charts before re-rendering (prevents memory leaks)
- Chart manipulation in presentation mode
- Resizing charts dynamically

**Chart IDs in index.html:**
- `chartSelfPayOrigin` - Self-pay customer origin analysis
- `chartAgeProduct` - Age distribution by product type
- `chartStackedProdLocation` - Stacked product/location breakdown
- `chartRevenueByLocation` - Revenue by geographic region
- `chartProductDistribution` - Product mix analysis
- `chartSexDistribution` - Gender demographics
- `chartProcessStatus` - Booking status (Booked/Completed/Cancelled)
- `chartBookingType` - Corporate vs Self Pay breakdown
- `chartProductPaymentRatio` - Product payment ratios
- `chartTopClients` - Top client accounts
- `chartTopPostcodes` - Geographic distribution by postcode
- `chartRevByMonth` - Monthly revenue trends

**Rendering pattern:** `renderChart(canvasId, type, data)` (app.js:222-242)
1. Get 2D context from canvas
2. Destroy existing chart if present
3. Create new Chart.js instance with responsive settings

### Presentation Mode System

**Two presentation modes** (app.js:272-345):
- **Internal Mode** - Shows all charts including financial data
- **Client Mode** - Excludes revenue-related charts (`chartRevenueByLocation`, `chartRevByMonth`, `chartProductPaymentRatio`)

**Slide navigation:** Presentation overlay displays one chart at a time in fullscreen. Charts are moved into `activeSlideFrame` div and resized dynamically.

### Financial Data Sanitization

**Critical security feature** for client exports (app.js:349-407):

**Sensitive keywords** that trigger removal:
```javascript
['totals', 'revenue', 'price', 'cost', 'invoice_amount', 'amount', 'fee', 'charge']
```

**Sanitization process in `exportClientReport()`:**
1. Clone `globalRawData` array
2. Remove `_revenue` internal field from all records
3. Delete any field whose lowercased name contains a sensitive keyword
4. Inject sanitized data into exported HTML via `<script>` tag
5. Auto-load sanitized data on page load
6. Hide upload controls and export button in exported file

**Testing:** Use `verify_security.py` or `verify_security.ps1` to validate sanitization logic before deploying changes.

## File Structure

### Core Application Files
- **index.html** - Main dashboard interface (~95KB)
  - Embedded CSS with dark/light theme support
  - Chart canvas elements
  - Presentation overlay modal
  - File upload controls
- **app.js** - Application logic (408 lines)
  - Data processing pipeline
  - Chart rendering and management
  - Presentation mode
  - Secure export functionality
- **style.css** - Additional styling (minimal, most CSS is inline in index.html)

### Utility Scripts
- **inspect_excel.py** - Pandas-based Excel inspection (prints columns, sample rows, dtypes)
- **extract_color.py** - PIL-based logo color extraction for branding
- **extract_sample.ps1** - PowerShell COM automation to extract Excel data
- **verify_security.py** / **verify_security.ps1** - Sanitization logic tests

### Data Files
- **Anonymised Booking Dashboard.xlsx** - Source data file
- **sample_data.json** - Extracted sample data for testing
- **logo.png** - Circle Health Group branding

## Data Schema Expectations

The Excel file should contain these columns:
- `date` - Booking date (DD/MM/YYYY format)
- `status` - Booking status (Booked, Completed, Cancelled)
- `first_name`, `last_name` - Customer names
- `totals` - Revenue value (format: £XXX.XX)
- `Age` - Customer age (integer)
- `Region` - Geographic region
- `Corporate Or Self Pay` - Payment type
- `product_code` - Product/service type (Advanced, Select, Essential, GSK, etc.)

**Note:** The app is resilient to missing columns (uses optional chaining and fallback values).

## Theme System

**Theme toggle:** Controlled by `#themeSelect` dropdown in header
- **Dark mode** (default) - CSS custom properties in `:root`
- **Light mode** - Applied via `body.light` class override

**Layout modes:**
- **Compact** - Smaller gaps, shorter charts
- **Spacious** - Larger gaps (`--gap: 32px`), taller charts (`--chart-h: 420px`)

## Important Patterns

### DOM Safety Pattern
All DOM queries check for element existence before manipulation:
```javascript
if (elementId) elementId.classList.add('hidden');
```
This prevents errors when HTML structure changes.

### Chart Lifecycle Pattern
Always destroy existing chart before creating new one:
```javascript
if (charts[canvasId]) {
    charts[canvasId].destroy();
}
charts[canvasId] = new Chart(ctx, config);
```

### Data Immutability
Original data is preserved in `globalRawData` for re-rendering after presentation mode exit.

## Modifying Charts

**To add a new chart:**
1. Add `<canvas id="chartNewChart"></canvas>` to index.html
2. Add chart rendering logic in `updateCharts()` in app.js
3. Add chart ID to `allSlides` array in `startPresentation()`
4. If chart contains financial data, add to exclusion filter in client mode

**To modify sanitization:**
1. Update `sensitiveKeys` array in `exportClientReport()` (app.js:350)
2. Test with `python verify_security.py` or PowerShell equivalent
3. Verify exported HTML doesn't leak sensitive data

## Browser Compatibility

Requires modern browser with:
- ES6+ JavaScript support
- FileReader API
- Canvas 2D context
- CSS custom properties