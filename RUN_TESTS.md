# Run Tests - Quick Start Guide

## Server Status
✅ **HTTP Server is running at:** http://localhost:5173/

---

## Step-by-Step: Run Automated Tests (5 minutes)

### Step 1: Open the Dashboard
Click this link or copy to browser: **http://localhost:5173/**

Or double-click: `index.html`

---

### Step 2: Upload Test Data

1. Click the **"Choose File"** button
2. Select: `Anonymised Booking Dashboard.xlsx`
3. Wait 1-3 seconds for dashboard to load
4. Verify you see charts and data

---

### Step 3: Open Browser DevTools

Press **F12** (or right-click → Inspect)

Go to the **Console** tab

---

### Step 4: Load Test Suite

Copy and paste this into the console, then press Enter:

```javascript
const script = document.createElement('script');
script.src = 'test-automation.js';
document.head.appendChild(script);
```

You should see:
```
📋 Dashboard Test Suite Loaded!
```

---

### Step 5: Run All Tests

Copy and paste this, then press Enter:

```javascript
runAllTests()
```

---

### Step 6: Review Results

The console will show:
- ✅ Green checkmarks = Tests PASSED
- ❌ Red X marks = Tests FAILED
- Final summary with pass rate

**Example Output:**
```
=============================================================
🧪 EXCEL DASHBOARD - AUTOMATED TEST SUITE 🧪
=============================================================

✅ PASS: charts object exists
✅ PASS: globalRawData array exists
✅ PASS: Chart.js library loaded
...

=============================================================
TEST RESULTS SUMMARY
=============================================================
Total Tests: 52
✅ Passed: 50
❌ Failed: 2
Pass Rate: 96.2%
```

---

## Critical Security Tests (Must Run)

### Test 1: Verify Client Presentation Mode

**In the main dashboard:**

1. Click **"Presentation Mode"** button (TV icon)
2. Click **"Client Mode"**
3. Look at slide counter in top-right

**VERIFY:**
- Slide counter shows: **"1 / 9"** ✅ (NOT "1 / 12")
- Click "Next" through all slides - should be exactly **9 slides**
- Financial charts should NOT appear:
  - ❌ chartRevenueByLocation
  - ❌ chartProductPaymentRatio
  - ❌ chartRevByMonth

**PASS CRITERIA:** Exactly 9 slides, zero financial charts

---

### Test 2: Verify Secure Export

**In the main dashboard:**

1. Click **"Export Report"** button (PDF icon)
2. Click **"OK"** on confirmation dialog
3. File downloads: `Client_Report_Secure.html`
4. **Open the downloaded file in a NEW browser tab**
5. Press **F12** to open DevTools → Console
6. Paste this command:

```javascript
const sensitiveKeys = ['totals', 'revenue', 'price', 'cost', 'invoice_amount', 'amount', 'fee', 'charge'];
const leaks = Object.keys(window.initialData[0]).filter(k =>
  sensitiveKeys.some(s => k.toLowerCase().includes(s))
);
console.log('🔒 SECURITY CHECK:');
console.log('Financial data leaks found:', leaks);
console.log('Leak count:', leaks.length);
console.log('RESULT:', leaks.length === 0 ? '✅ PASS - No leaks detected' : '❌ FAIL - Financial data leaked!');
```

**MUST SHOW:**
```
🔒 SECURITY CHECK:
Financial data leaks found: []
Leak count: 0
RESULT: ✅ PASS - No leaks detected
```

**If you see ANY field names in the leaks array:** ❌ **CRITICAL FAILURE**

---

### Test 3: Verify Exported File Presentation Mode

**Still in the exported file tab:**

1. Click **"Presentation Mode"** → **"Client Mode"**
2. Verify slide counter shows: **"1 / 9"**
3. Verify financial charts excluded

**PASS CRITERIA:** Exported file also shows only 9 slides in client mode

---

## Individual Tests (Optional)

Run specific test suites individually:

```javascript
// Test data processing
dashboardTests.testDataProcessing()

// Test all charts
dashboardTests.testChartRendering()

// Test presentation modes
dashboardTests.testPresentationModes()

// Test KPIs
dashboardTests.testKPICalculations()

// Test for memory leaks
dashboardTests.testMemoryLeaks()

// Test sanitization (run on exported file)
dashboardTests.testFinancialSanitization()
```

---

## Expected Results

### ✅ PASS Criteria (Ready for Production)

- All automated tests pass (90%+ pass rate)
- Client mode shows exactly **9 slides**
- Export shows **zero financial data leaks**
- No JavaScript errors in console

### ❌ FAIL Criteria (Do NOT Deploy)

- Financial data found in exported file
- Client mode shows 12 slides (should be 9)
- Charts don't render
- Critical JavaScript errors

---

## Troubleshooting

**Problem:** "test-automation.js not found"
**Solution:** Make sure you're at http://localhost:5173/ (not file://)

**Problem:** "globalRawData is empty"
**Solution:** Upload an Excel file first (Step 2)

**Problem:** Charts don't render
**Solution:** Check console for CDN loading errors, reload page

**Problem:** Tests show failures
**Solution:** Review the failure details in red. Check VERIFICATION_REPORT.md for code locations

---

## Quick Verification Checklist

After running tests, verify:

- [ ] Automated tests: 90%+ pass rate
- [ ] Client mode: 9 slides (not 12)
- [ ] Export security: 0 leaks
- [ ] Internal mode: 12 slides
- [ ] All 15 charts visible
- [ ] KPIs calculate correctly
- [ ] No console errors

**If all checked:** ✅ **APPROVED FOR PRODUCTION**

---

## Files Reference

- **test-automation.js** - Automated test suite (already created)
- **TEST_EXECUTION_GUIDE.md** - Detailed manual testing guide
- **FUNCTIONAL_TEST_CHECKLIST.md** - 150+ point comprehensive checklist
- **VERIFICATION_REPORT.md** - Security analysis and code verification
- **server.js** - HTTP server (currently running)

---

## Stop Server (When Done Testing)

To stop the HTTP server:

Press **Ctrl+C** in the terminal where server is running

Or find the process and kill it.

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Review TEST_EXECUTION_GUIDE.md for detailed steps
3. Run PowerShell security script: `powershell -File verify_security.ps1`

---

**Ready to test?** → Go to http://localhost:5173/ and follow Step 1-6 above!
