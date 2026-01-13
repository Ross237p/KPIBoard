# User Flows

## Flow 1: Internal Analyst Reviews Data

**Actor:** Internal Analyst
**Goal:** Upload Excel data and review all metrics including financials

**Steps:**
1. Open index.html in browser
2. Click "Choose File" button
3. Select "Anonymised Booking Dashboard.xlsx"
4. Wait for dashboard to load (1-3 seconds)
5. Review KPIs: Total Bookings, Total Revenue
6. Scroll through 15 charts
7. Review data table (first 10 records)
8. Switch to light theme (optional)
9. Change to spacious layout (optional)

**Success Criteria:**
- All charts render without errors
- KPIs show accurate values
- Revenue data visible
- No console errors

## Flow 2: Present to Internal Team

**Actor:** Manager
**Goal:** Present all charts including financial data in fullscreen

**Steps:**
1. Load dashboard with data
2. Click "Presentation Mode" button
3. Click "Internal Mode"
4. Presentation overlay appears fullscreen
5. Navigate through 12 slides using Next button
6. View financial charts (Revenue by Location, Product Payment Ratio, Revenue by Month)
7. Use Previous button to review slides
8. Click "Exit" to return to dashboard

**Success Criteria:**
- 12 slides total displayed
- All financial charts visible
- Slide counter shows "X / 12"
- Navigation works smoothly
- Charts resize to fullscreen

## Flow 3: Present to External Client

**Actor:** Manager
**Goal:** Present operational data to client without showing financials

**Steps:**
1. Load dashboard with data
2. Click "Presentation Mode" button
3. Click "Client Mode"
4. Presentation overlay appears fullscreen
5. Navigate through 9 slides (financial charts excluded)
6. Slide counter shows "X / 9"
7. chartRevenueByLocation NOT visible
8. chartProductPaymentRatio NOT visible
9. chartRevByMonth NOT visible
10. Click "Exit" to return to dashboard

**Success Criteria:**
- Exactly 9 slides displayed
- Zero financial charts visible
- Slide counter accurate
- Client sees only approved operational metrics

## Flow 4: Export Secure Client Report

**Actor:** Analyst
**Goal:** Create sanitized HTML report for client delivery

**Steps:**
1. Load dashboard with complete data (including financials)
2. Review data to ensure accuracy
3. Click "Export Report" button (PDF icon)
4. Confirmation dialog appears: "Do you want to export a Secure Client Report (Financials Removed)?"
5. Click "OK"
6. File "Client_Report_Secure.html" downloads
7. Open downloaded file in new browser tab
8. Verify dashboard auto-loads without upload
9. Open browser console
10. Run: `console.log(Object.keys(window.initialData[0]))`
11. Verify NO financial fields present:
    - totals ❌
    - _revenue ❌
    - invoice_amount ❌
    - price ❌
    - cost ❌
    - fee ❌
    - charge ❌
    - amount ❌
12. Verify operational fields present:
    - date ✓
    - status ✓
    - Age ✓
    - Region ✓
    - product_code ✓
13. Test presentation mode in exported file
14. Verify client mode shows only 9 slides
15. Send file to client

**Success Criteria:**
- File exports successfully
- All financial data removed (100% sanitization)
- Non-financial data intact
- Charts render in exported file
- Upload controls hidden
- Export buttons hidden
- File is self-contained and functional

**Critical Security Check:**
```javascript
// Run in console - should return empty array []
const sensitiveKeys = ['totals', 'revenue', 'price', 'cost', 'invoice_amount', 'amount', 'fee', 'charge'];
const leaks = Object.keys(window.initialData[0]).filter(k =>
  sensitiveKeys.some(s => k.toLowerCase().includes(s))
);
console.log('Leaks found:', leaks); // MUST be []
```

## Flow 5: Handle Invalid Data

**Actor:** Analyst
**Goal:** Upload Excel file with missing or invalid data

**Steps:**
1. Create Excel with missing columns (e.g., no "totals" column)
2. Upload file
3. Dashboard loads without crashes
4. Charts render with available data
5. Missing fields use fallback values:
   - Missing totals → _revenue = 0
   - Missing date → _date = null
   - Missing Age → _age = 0
   - Missing Region → _region = "Unknown"
6. No JavaScript errors in console

**Success Criteria:**
- Application doesn't crash
- Graceful degradation
- Informative (or silent) error handling
- Partial data displays correctly

## Flow 6: Test Performance with Large Dataset

**Actor:** Analyst
**Goal:** Upload Excel with 10,000+ rows

**Steps:**
1. Create/obtain Excel file with 10,000 rows
2. Upload file
3. Measure processing time (should be < 5 seconds)
4. Verify charts render (should be < 3 seconds)
5. Check browser responsiveness (no freezing)
6. Navigate presentation modes
7. Test chart interactions (hover, tooltips)
8. Monitor browser memory usage

**Success Criteria:**
- Upload completes in reasonable time
- Charts aggregate/sample data appropriately
- Browser remains responsive
- No memory leaks
- Performance acceptable on standard hardware

## Flow 7: Multi-Theme Experience

**Actor:** User
**Goal:** Switch between themes and layouts

**Steps:**
1. Load dashboard
2. Default dark theme displays
3. Click theme dropdown → select "Light"
4. UI transitions to light theme (0.3s)
5. Verify charts adapt to light background
6. Click layout dropdown → select "Spacious"
7. Charts become taller (420px)
8. Gaps increase (32px)
9. Switch back to "Compact"
10. Charts shrink (320px)
11. Switch back to "Dark" theme

**Success Criteria:**
- Smooth theme transitions
- All elements readable in both themes
- Layout changes apply immediately
- No visual glitches or broken layouts

## Flow 8: Cross-Browser Testing

**Actor:** QA Tester
**Goal:** Verify compatibility across browsers

**Steps:**
1. Open index.html in Chrome
2. Upload data, verify all features work
3. Repeat in Firefox
4. Repeat in Edge
5. Repeat in Safari (if available)
6. Document any browser-specific issues

**Success Criteria:**
- Consistent behavior across browsers
- CDN libraries load successfully
- CSS renders identically
- JavaScript features work
- Charts display correctly
