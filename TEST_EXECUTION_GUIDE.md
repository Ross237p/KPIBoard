# Test Execution Guide - Excel Dashboard

**Purpose:** Step-by-step guide to verify all features using automated browser tests and manual verification

---

## Testing Approach

Since TestSprite requires API authentication, I've created:
1. **Automated Browser Test Suite** - JavaScript tests you run in browser console
2. **Manual Verification Checklist** - Step-by-step testing procedures
3. **Security Verification Scripts** - PowerShell/Python sanitization tests

---

## Method 1: Automated Browser Tests (Recommended)

### Setup (One-Time)

1. **Start Local Server:**
```bash
cd "c:\Users\rossg\.gemini\antigravity\scratch\excel_dashboard"
node server.js
```
Server will run on: http://localhost:5173/

2. **Open Dashboard:**
- Navigate to: http://localhost:5173/
- Or open `index.html` directly in browser

3. **Load Test Script:**
Open browser DevTools (F12) → Console tab → Run:
```javascript
// Load test automation script
const script = document.createElement('script');
script.src = 'test-automation.js';
document.head.appendChild(script);
```

### Running Tests

#### Run All Tests:
```javascript
runAllTests()
```

This executes 8 test suites with 50+ automated checks:
1. Global Variables and Initialization
2. Data Processing Verification
3. Chart Rendering Verification
4. Financial Data Sanitization *(CRITICAL)*
5. Presentation Mode Configuration
6. KPI Calculations
7. DOM Elements Verification
8. Memory Leak Prevention

#### Run Individual Test Suites:
```javascript
dashboardTests.testGlobalVariables()
dashboardTests.testDataProcessing()
dashboardTests.testChartRendering()
dashboardTests.testFinancialSanitization() // Run on exported file
dashboardTests.testPresentationModes()
dashboardTests.testKPICalculations()
dashboardTests.testDOMElements()
dashboardTests.testMemoryLeaks()
```

### Test Output

The test suite provides:
- ✅ **Green PASS** - Test succeeded
- ❌ **Red FAIL** - Test failed with details
- 🔵 **Blue INFO** - Informational messages
- ⚠️ **Orange WARN** - Warnings (not failures)

**Example Output:**
```
=============================================================
🧪 EXCEL DASHBOARD - AUTOMATED TEST SUITE 🧪
=============================================================

=============================================================
TEST SUITE 1: Global Variables and Initialization
=============================================================
✅ PASS: charts object exists
✅ PASS: globalRawData array exists
✅ PASS: Chart.js library loaded
✅ PASS: XLSX library loaded
✅ PASS: Sortable library loaded
🔵 INFO: Charts object has 15 chart instances
🔵 INFO: GlobalRawData has 250 records

[... continues through all test suites ...]

=============================================================
TEST RESULTS SUMMARY
=============================================================
Total Tests: 52
✅ Passed: 50
❌ Failed: 2
Pass Rate: 96.2%

✅ TESTS MOSTLY PASSED (90%+)
```

---

## Method 2: Manual Testing Workflow

### Phase 1: Basic Functionality (15 minutes)

#### 1. File Upload Test
**Steps:**
1. Open http://localhost:5173/ or index.html
2. Click "Choose File" button
3. Select `Anonymised Booking Dashboard.xlsx`
4. Wait 1-3 seconds for loading

**Verify:**
- [ ] Dashboard appears (no longer showing upload screen)
- [ ] Charts render (scroll to see all 15)
- [ ] KPIs display values (Total Bookings, Total Revenue)
- [ ] Data table shows first 10 records
- [ ] Browser console shows NO red errors (F12 → Console)

**Expected:** All items checked ✅

---

#### 2. Chart Rendering Test
**Scroll through dashboard and verify these 15 charts exist:**

| # | Chart ID | Visible? | Data? |
|---|----------|----------|-------|
| 1 | chartCumulativeCompare | [ ] | [ ] |
| 2 | chartSelfPayOrigin | [ ] | [ ] |
| 3 | chartAgeProduct | [ ] | [ ] |
| 4 | chartStackedProdLocation | [ ] | [ ] |
| 5 | chartRevenueByLocation 🔒 | [ ] | [ ] |
| 6 | chartProductDistribution | [ ] | [ ] |
| 7 | chartSexDistribution | [ ] | [ ] |
| 8 | chartProcessStatus | [ ] | [ ] |
| 9 | chartBookingType | [ ] | [ ] |
| 10 | chartProductPaymentRatio 🔒 | [ ] | [ ] |
| 11 | chartTopClients | [ ] | [ ] |
| 12 | chartTopPostcodes | [ ] | [ ] |
| 13 | chartRevByMonth 🔒 | [ ] | [ ] |
| 14 | chartRecallInviteCombo | [ ] | [ ] |
| 15 | chartRecallsTrend | [ ] | [ ] |

🔒 = Financial chart

**Test Interactivity:**
- [ ] Hover over chart bars/segments → tooltips appear
- [ ] Legends visible below charts
- [ ] No visual glitches or missing data

---

#### 3. KPI Verification Test
**In browser console, run:**
```javascript
// Check KPI accuracy
const totalBookings = globalRawData.length;
const totalRevenue = globalRawData.reduce((sum, r) => sum + (r._revenue || 0), 0);
console.log('Expected Bookings:', totalBookings);
console.log('Expected Revenue: £' + totalRevenue.toFixed(2));
```

**Manually verify:**
- [ ] Displayed "Total Bookings" matches console output
- [ ] Displayed "Total Revenue" matches console output (within £0.01)

---

### Phase 2: Critical Security Tests (10 minutes)

#### 4. Client Presentation Mode Test 🔒 CRITICAL
**Steps:**
1. Click "Presentation Mode" button (TV icon)
2. Dialog appears with two buttons
3. Click "**Client Mode**"
4. Presentation starts fullscreen

**Verify Slide Count:**
- [ ] Slide counter shows "1 / **9**" (NOT 12)
- [ ] Navigate through all slides using "Next" button
- [ ] Count total slides = exactly **9**

**Verify Financial Charts EXCLUDED:**
- [ ] ❌ chartRevenueByLocation NOT visible
- [ ] ❌ chartProductPaymentRatio NOT visible
- [ ] ❌ chartRevByMonth NOT visible

**Verify Other Charts INCLUDED:**
- [ ] ✅ chartSelfPayOrigin visible
- [ ] ✅ chartAgeProduct visible
- [ ] ✅ chartStackedProdLocation visible
- [ ] ✅ chartProductDistribution visible
- [ ] ✅ chartSexDistribution visible
- [ ] ✅ chartProcessStatus visible
- [ ] ✅ chartBookingType visible
- [ ] ✅ chartTopClients visible
- [ ] ✅ chartTopPostcodes visible

**Navigation Test:**
- [ ] "Next" button advances slide
- [ ] "Prev" button goes back
- [ ] "Exit" button closes presentation
- [ ] Returns to normal dashboard view

**PASS CRITERIA:** Exactly 9 slides, zero financial charts visible

---

#### 5. Internal Presentation Mode Test
**Steps:**
1. Click "Presentation Mode" button
2. Click "**Internal Mode**"

**Verify Slide Count:**
- [ ] Slide counter shows "1 / **12**" (NOT 9)
- [ ] Navigate through all slides
- [ ] Count total slides = exactly **12**

**Verify Financial Charts INCLUDED:**
- [ ] ✅ chartRevenueByLocation visible
- [ ] ✅ chartProductPaymentRatio visible
- [ ] ✅ chartRevByMonth visible

**PASS CRITERIA:** Exactly 12 slides, financial charts visible

---

#### 6. Secure Client Export Test 🔒 CRITICAL SECURITY

**Part A: Export the File**
1. [ ] Click "Export Report" button (PDF icon in toolbar)
2. [ ] Confirmation dialog appears: "Do you want to export a Secure Client Report (Financials Removed)?"
3. [ ] Click "OK"
4. [ ] File downloads: `Client_Report_Secure.html`

**Part B: Verify Exported File**
1. [ ] Open `Client_Report_Secure.html` in **NEW browser tab**
2. [ ] Dashboard auto-loads (NO upload required)
3. [ ] Charts render automatically
4. [ ] Upload controls HIDDEN
5. [ ] Export buttons HIDDEN

**Part C: Critical Security Verification**

Open browser console (F12) in the **exported file tab**, run:

```javascript
// SECURITY CHECK - Must return empty array []
const sensitiveKeys = ['totals', 'revenue', 'price', 'cost', 'invoice_amount', 'amount', 'fee', 'charge'];
const leaks = Object.keys(window.initialData[0]).filter(k =>
  sensitiveKeys.some(s => k.toLowerCase().includes(s))
);
console.log('🔒 Financial data leaks:', leaks);
console.log('Leak count:', leaks.length);
console.log('RESULT:', leaks.length === 0 ? '✅ PASS - No leaks' : '❌ FAIL - Data leaked!');
```

**Verify Output:**
- [ ] `Financial data leaks: []` (empty array)
- [ ] `Leak count: 0`
- [ ] `RESULT: ✅ PASS - No leaks`

**Also run these specific checks:**
```javascript
// Check individual fields
console.log('totals exists?', 'totals' in window.initialData[0]); // Must be FALSE
console.log('_revenue exists?', '_revenue' in window.initialData[0]); // Must be FALSE
console.log('invoice_amount exists?', 'invoice_amount' in window.initialData[0]); // Must be FALSE

// Verify safe fields preserved
console.log('date exists?', 'date' in window.initialData[0]); // Should be TRUE
console.log('status exists?', 'status' in window.initialData[0]); // Should be TRUE
console.log('Age exists?', 'Age' in window.initialData[0]); // Should be TRUE
console.log('Region exists?', 'Region' in window.initialData[0]); // Should be TRUE
```

**Expected Results:**
- [ ] `totals exists? false` ✅
- [ ] `_revenue exists? false` ✅
- [ ] `invoice_amount exists? false` ✅
- [ ] `date exists? true` ✅
- [ ] `status exists? true` ✅
- [ ] `Age exists? true` ✅
- [ ] `Region exists? true` ✅

**Part D: Verify Presentation Mode in Exported File**
In the exported file:
1. [ ] Click "Presentation Mode" → "Client Mode"
2. [ ] Slide counter shows "1 / **9**" (not 12)
3. [ ] Financial charts excluded

**CRITICAL PASS CRITERIA:**
- ✅ Zero financial fields in exported data
- ✅ Non-financial data preserved
- ✅ File functions independently
- ✅ Client mode shows 9 slides in exported file

**If ANY financial data found:** ❌ **CRITICAL FAILURE - DO NOT DEPLOY**

---

### Phase 3: Feature Tests (20 minutes)

#### 7. Theme Switching Test
**Steps:**
1. [ ] Click "Theme" dropdown (top toolbar)
2. [ ] Select "Dark"
3. [ ] Verify:
   - [ ] Background dark (#0f172a)
   - [ ] Text light
   - [ ] Charts adapt
4. [ ] Select "Light"
5. [ ] Verify:
   - [ ] Background light (#f8fafc)
   - [ ] Text dark
   - [ ] Shadows appear
   - [ ] Charts readable

**PASS:** Both themes work, smooth transitions

---

#### 8. Layout Mode Test
**Steps:**
1. [ ] Select "Layout" → "Compact"
2. [ ] Charts become shorter (320px)
3. [ ] Less spacing (24px gaps)
4. [ ] Select "Layout" → "Spacious"
5. [ ] Charts become taller (420px)
6. [ ] More spacing (32px gaps)

**PASS:** Layout changes apply immediately

---

#### 9. Data Table Test
**Scroll to data table section:**
- [ ] Displays first 10 records
- [ ] Columns visible: Date, Name, Status, Type, Revenue
- [ ] Status badges colored (Booked=green, Cancelled=red)
- [ ] Revenue formatted as £X.XX
- [ ] Rows highlight on hover

**PASS:** Table displays correctly

---

#### 10. Error Handling Test
**Create test Excel file with missing columns:**

Option A: Missing `totals` column
1. [ ] Remove `totals` column from Excel
2. [ ] Upload file
3. [ ] Verify: No errors, revenue shows £0.00

Option B: Missing `date` column
1. [ ] Remove `date` column from Excel
2. [ ] Upload file
3. [ ] Verify: No errors, dates show as undefined/null

**PASS:** Handles missing data gracefully, no crashes

---

### Phase 4: Performance Tests (10 minutes)

#### 11. Large Dataset Test
**If you have a large dataset (1000+ rows):**
1. [ ] Upload large Excel file
2. [ ] Measure upload time (should be < 5 seconds)
3. [ ] All charts render (should be < 3 seconds)
4. [ ] Browser remains responsive
5. [ ] No freezing or lag

**PASS:** Handles large data efficiently

---

#### 12. Memory Leak Test
**In browser console:**
```javascript
// Initial state
console.log('Initial charts:', Object.keys(charts).length);

// Upload new data (do this manually)
// Then check again:
console.log('After reload charts:', Object.keys(charts).length);

// Should be same or similar count (not growing indefinitely)
```

**Also check:**
1. [ ] Open DevTools → Memory tab
2. [ ] Take heap snapshot
3. [ ] Upload new data
4. [ ] Take second snapshot
5. [ ] Compare - no massive growth

**PASS:** Chart instances don't accumulate, memory stable

---

## Method 3: PowerShell Security Verification

Run the existing security script:

```powershell
cd "c:\Users\rossg\.gemini\antigravity\scratch\excel_dashboard"
powershell -File verify_security.ps1
```

**Expected Output:**
```
--- SANITIZED DATA (First Record) ---
{
    "Region":  "Ilford",
    "product_code":  "Advanced",
    "date":  "13/01/2025",
    "Age":  50,
    "status":  "Booked"
}

--- VERIFICATION RESULTS ---
SUCCESS: All financial data removed.
```

**PASS CRITERIA:** Output shows "SUCCESS: All financial data removed."

---

## Test Results Summary Template

### Test Execution Report

**Date:** _______________
**Tester:** _______________
**Browser:** _______________

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | File Upload | [ ] Pass [ ] Fail | |
| 2 | Chart Rendering (15 charts) | [ ] Pass [ ] Fail | |
| 3 | KPI Accuracy | [ ] Pass [ ] Fail | |
| 4 | Client Presentation (9 slides) | [ ] Pass [ ] Fail | |
| 5 | Internal Presentation (12 slides) | [ ] Pass [ ] Fail | |
| 6 | Secure Export (Zero leaks) | [ ] Pass [ ] Fail | |
| 7 | Theme Switching | [ ] Pass [ ] Fail | |
| 8 | Layout Modes | [ ] Pass [ ] Fail | |
| 9 | Data Table | [ ] Pass [ ] Fail | |
| 10 | Error Handling | [ ] Pass [ ] Fail | |
| 11 | Large Dataset | [ ] Pass [ ] Fail | |
| 12 | Memory Leaks | [ ] Pass [ ] Fail | |

### Critical Security Tests

| Security Test | Result | Evidence |
|---------------|--------|----------|
| Client mode excludes 3 financial charts | [ ] Pass [ ] Fail | Slide count: ___ |
| Export removes ALL financial fields | [ ] Pass [ ] Fail | Leak count: ___ |
| PowerShell script verification | [ ] Pass [ ] Fail | Output: ___ |

### Overall Result

- **Total Tests:** _____ / 12
- **Critical Tests:** _____ / 3
- **Pass Rate:** _____%

**Overall Status:** [ ] ✅ PASS [ ] ❌ FAIL

**Ready for Production?** [ ] YES [ ] NO

**Critical Issues Found:**
1. _________________________________
2. _________________________________
3. _________________________________

**Signature:** _______________ **Date:** _______________

---

## Quick Reference Commands

### Browser Console Commands

```javascript
// Load automated tests
const script = document.createElement('script');
script.src = 'test-automation.js';
document.head.appendChild(script);

// Run all tests
runAllTests()

// Check data
console.log('Records:', globalRawData.length);
console.log('First record:', globalRawData[0]);

// Check charts
console.log('Charts:', Object.keys(charts));
console.log('Chart count:', Object.keys(charts).length);

// Security check (on exported file)
const sensitiveKeys = ['totals', 'revenue', 'price', 'cost', 'invoice_amount', 'amount', 'fee', 'charge'];
const leaks = Object.keys(window.initialData[0]).filter(k =>
  sensitiveKeys.some(s => k.toLowerCase().includes(s))
);
console.log('Leaks:', leaks.length === 0 ? 'NONE ✅' : leaks);
```

---

## Troubleshooting

### Issue: Tests don't run
**Solution:** Ensure you've loaded test-automation.js first

### Issue: "globalRawData is empty"
**Solution:** Upload an Excel file before running data tests

### Issue: Charts don't render
**Solution:** Check browser console for CDN library loading errors

### Issue: Server won't start
**Solution:** Check if port 5173 is already in use, or open index.html directly

### Issue: Export test shows leaks
**Solution:** ❌ CRITICAL - Do not deploy. Review app.js:349-407 sanitization logic

---

## Files Created for Testing

1. **test-automation.js** - Automated browser test suite
2. **TEST_EXECUTION_GUIDE.md** - This document
3. **FUNCTIONAL_TEST_CHECKLIST.md** - Comprehensive 150+ point checklist
4. **VERIFICATION_REPORT.md** - Security and code analysis report
5. **server.js** - Local HTTP server for testing
6. **verify_security.ps1** - PowerShell sanitization test (existing)

---

## Next Steps

1. **Run automated tests:** `runAllTests()` in browser console
2. **Manual verification:** Work through Phase 1-4 tests above
3. **Security validation:** Run PowerShell script + export verification
4. **Document results:** Fill out Test Results Summary
5. **Review failures:** Address any failed tests before deployment

**Estimated Total Testing Time:** 60-90 minutes for complete verification

---

**Document Version:** 1.0
**Last Updated:** 2025-12-06
