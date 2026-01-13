# Excel Dashboard Features

## Feature 1: Excel File Upload and Parsing
**Priority:** Critical
**Description:** Users can upload Excel files (.xlsx, .xls) containing booking data which is parsed client-side using XLSX.js

**Acceptance Criteria:**
- File input accepts .xlsx and .xls files
- XLSX.js parses uploaded file successfully
- Data extracted from first sheet by default
- Dashboard becomes visible after successful upload
- Invalid file formats are rejected gracefully

## Feature 2: Data Processing Pipeline
**Priority:** Critical
**Description:** Transform raw Excel data into usable format with calculated fields

**Acceptance Criteria:**
- `totals` field (£XXX.XX) converts to `_revenue` float
- `date` field (DD/MM/YYYY) converts to `_date` Date object
- `Age` field converts to `_age` integer
- Fields normalized: Region→_region, status→_status, Corporate Or Self Pay→_type
- Handles missing data with fallback values (0, "Unknown", null)
- No JavaScript errors on invalid data types

## Feature 3: KPI Dashboard
**Priority:** High
**Description:** Display key performance indicators calculated from uploaded data

**Acceptance Criteria:**
- Total Bookings displays as integer count
- Total Revenue displays with currency formatting (£XX,XXX.XX)
- KPIs update dynamically when new data uploaded
- Values show "—" when no data loaded

## Feature 4: Chart Rendering System (15 Charts)
**Priority:** Critical
**Description:** Render 15 interactive Chart.js visualizations from booking data

**Acceptance Criteria:**
- All 15 canvas elements exist in HTML
- Charts render without errors after data load
- Charts display correct data from source
- Tooltips appear on hover
- Legends display correctly
- Charts are responsive and resize with window
- Old chart instances destroyed before creating new ones (no memory leaks)

**Chart List:**
1. chartCumulativeCompare - Line chart
2. chartSelfPayOrigin - Bar/Pie chart
3. chartAgeProduct - Bar chart
4. chartStackedProdLocation - Stacked bar
5. chartRevenueByLocation - Bar chart (FINANCIAL)
6. chartProductDistribution - Pie chart
7. chartSexDistribution - Pie chart
8. chartProcessStatus - Doughnut chart
9. chartBookingType - Pie chart
10. chartProductPaymentRatio - Bar chart (FINANCIAL)
11. chartTopClients - Bar chart
12. chartTopPostcodes - Bar chart
13. chartRevByMonth - Line chart (FINANCIAL)
14. chartRecallInviteCombo - Mixed chart
15. chartRecallsTrend - Line chart

## Feature 5: Theme System
**Priority:** Medium
**Description:** Users can switch between dark and light themes

**Acceptance Criteria:**
- Default theme loads (dark mode)
- Theme dropdown in header contains Dark and Light options
- Selecting Dark theme applies dark color scheme
- Selecting Light theme applies light color scheme with shadows
- Theme transitions are smooth (0.3s ease)
- Charts adapt to theme changes
- All text remains readable in both themes

## Feature 6: Layout Modes
**Priority:** Medium
**Description:** Toggle between compact and spacious layouts

**Acceptance Criteria:**
- Layout dropdown contains Compact and Spacious options
- Compact mode: --gap: 24px, --chart-h: 320px
- Spacious mode: --gap: 32px, --chart-h: 420px
- Charts resize appropriately
- Layout changes apply immediately

## Feature 7: Internal Presentation Mode
**Priority:** High
**Description:** Full-screen slideshow of all charts for internal review

**Acceptance Criteria:**
- Presentation button opens mode selection dialog
- Internal Mode button starts presentation
- Presentation overlay appears in fullscreen
- Shows all 12 slides (including 3 financial charts)
- Slide counter displays "X / 12"
- Previous/Next buttons navigate slides
- Exit button closes presentation
- Charts resize to fit fullscreen
- Returns to dashboard on exit with data intact

## Feature 8: Client Presentation Mode
**Priority:** Critical (Security)
**Description:** Full-screen slideshow excluding financial charts for client viewing

**Acceptance Criteria:**
- Client Mode button starts presentation
- Shows only 9 slides (excludes financial charts)
- Slide counter displays "X / 9"
- chartRevenueByLocation NOT visible
- chartProductPaymentRatio NOT visible
- chartRevByMonth NOT visible
- All other 9 charts visible
- Navigation works correctly
- Exit returns to dashboard

## Feature 9: Data Table Display
**Priority:** Medium
**Description:** Display recent booking records in tabular format

**Acceptance Criteria:**
- Table shows first 10 records
- Columns: Date, Full Name, Status, Type, Revenue
- Status badges colored: Booked=green, Cancelled=red
- Revenue formatted as currency (£X.XX)
- Rows highlight on hover
- Table updates when new data loaded

## Feature 10: Secure Client Report Export
**Priority:** Critical (Security)
**Description:** Export self-contained HTML file with financial data removed

**Acceptance Criteria:**
- Export Report button triggers confirmation dialog
- Downloads file named "Client_Report_Secure.html"
- Exported file auto-loads data without upload
- ALL financial fields removed: totals, _revenue, invoice_amount, price, cost, fee, charge, amount
- Sensitive keyword detection is case-insensitive
- Non-financial fields preserved: date, status, Age, Region, product_code
- Upload controls hidden in exported file
- Export buttons hidden in exported file
- Charts render in exported file
- Presentation modes work in exported file
- Client mode shows only 9 slides in exported file

## Feature 11: Sample Data Loading
**Priority:** Low
**Description:** Load embedded sample data for testing

**Acceptance Criteria:**
- Load Sample button exists (if feature enabled)
- Clicking button loads 6 sample records
- Charts populate with sample data
- KPIs calculate from sample data

## Feature 12: Data Reload
**Priority:** Medium
**Description:** Refresh dashboard with current data

**Acceptance Criteria:**
- Reload button exists
- Clicking reloads and re-processes data
- Charts re-render
- KPIs recalculate

## Feature 13: Responsive Design
**Priority:** Medium
**Description:** Dashboard adapts to different screen sizes

**Acceptance Criteria:**
- Functions on desktop (1920x1080)
- Functions on laptop (1366x768)
- Usable on tablet (768px)
- Accessible on mobile (375px) even if not optimized
- No horizontal scroll on standard screen sizes

## Feature 14: Error Handling
**Priority:** High
**Description:** Gracefully handle edge cases and invalid data

**Acceptance Criteria:**
- Empty Excel files don't crash app
- Missing columns handled with fallback values
- Invalid data types parsed safely
- Large datasets (10,000+ rows) process efficiently
- JavaScript errors don't break dashboard
- Console shows no red errors during normal operation

## Feature 15: DPI Scaling
**Priority:** Low
**Description:** Adjust chart rendering quality

**Acceptance Criteria:**
- DPI dropdown contains scale options
- Selecting option re-renders charts at new DPI
- Higher DPI produces sharper charts
