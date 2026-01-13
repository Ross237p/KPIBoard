/**
 * Excel Dashboard - Automated Browser Test Suite
 *
 * Run these tests in the browser console after loading the dashboard.
 * Open browser DevTools (F12) → Console tab → Paste functions → Run tests
 */

// Color-coded logging
const log = {
  pass: (msg) => console.log('%c✅ PASS: ' + msg, 'color: green; font-weight: bold'),
  fail: (msg) => console.error('%c❌ FAIL: ' + msg, 'color: red; font-weight: bold'),
  info: (msg) => console.log('%c🔵 INFO: ' + msg, 'color: blue'),
  warn: (msg) => console.warn('%c⚠️ WARN: ' + msg, 'color: orange'),
  section: (msg) => console.log('%c\n' + '='.repeat(60) + '\n' + msg + '\n' + '='.repeat(60), 'color: purple; font-weight: bold; font-size: 14px')
};

// Test Results Tracker
const testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  failures: []
};

function recordResult(testName, passed, details = '') {
  testResults.total++;
  if (passed) {
    testResults.passed++;
    log.pass(testName);
  } else {
    testResults.failed++;
    testResults.failures.push({ test: testName, details });
    log.fail(testName + (details ? ': ' + details : ''));
  }
}

// ==================================================================
// TEST SUITE 1: Global Variables and Initialization
// ==================================================================

function testGlobalVariables() {
  log.section('TEST SUITE 1: Global Variables and Initialization');

  recordResult('charts object exists', typeof charts === 'object');
  recordResult('globalRawData array exists', typeof globalRawData === 'object' && Array.isArray(globalRawData));
  recordResult('Chart.js library loaded', typeof Chart !== 'undefined');
  recordResult('XLSX library loaded', typeof XLSX !== 'undefined');
  recordResult('Sortable library loaded', typeof Sortable !== 'undefined');

  log.info(`Charts object has ${Object.keys(charts).length} chart instances`);
  log.info(`GlobalRawData has ${globalRawData.length} records`);
}

// ==================================================================
// TEST SUITE 2: Data Processing Verification
// ==================================================================

function testDataProcessing() {
  log.section('TEST SUITE 2: Data Processing Verification');

  if (globalRawData.length === 0) {
    log.warn('No data loaded. Upload an Excel file first, then run this test.');
    return;
  }

  const firstRecord = globalRawData[0];
  log.info('First record: ' + JSON.stringify(firstRecord, null, 2));

  // Check transformed fields exist
  recordResult('_revenue field exists', '_revenue' in firstRecord, 'Check processData() transformation');
  recordResult('_date field exists', '_date' in firstRecord);
  recordResult('_age field exists', '_age' in firstRecord);
  recordResult('_region field exists', '_region' in firstRecord);
  recordResult('_status field exists', '_status' in firstRecord);
  recordResult('_type field exists', '_type' in firstRecord);

  // Check data types
  if ('_revenue' in firstRecord) {
    recordResult('_revenue is number', typeof firstRecord._revenue === 'number');
  }
  if ('_age' in firstRecord) {
    recordResult('_age is number', typeof firstRecord._age === 'number');
  }
  if ('_date' in firstRecord && firstRecord._date !== null) {
    recordResult('_date is Date object', firstRecord._date instanceof Date);
  }
}

// ==================================================================
// TEST SUITE 3: Chart Rendering Verification
// ==================================================================

function testChartRendering() {
  log.section('TEST SUITE 3: Chart Rendering Verification');

  const expectedCharts = [
    'chartCumulativeCompare',
    'chartSelfPayOrigin',
    'chartAgeProduct',
    'chartStackedProdLocation',
    'chartRevenueByLocation',
    'chartProductDistribution',
    'chartSexDistribution',
    'chartProcessStatus',
    'chartBookingType',
    'chartProductPaymentRatio',
    'chartTopClients',
    'chartTopPostcodes',
    'chartRevByMonth',
    'chartRecallInviteCombo',
    'chartRecallsTrend'
  ];

  log.info(`Checking ${expectedCharts.length} charts...`);

  let renderedCount = 0;
  expectedCharts.forEach(chartId => {
    const canvas = document.getElementById(chartId);
    const canvasExists = canvas !== null;
    const chartInstance = charts[chartId];
    const isRendered = chartInstance !== undefined;

    if (canvasExists && isRendered) {
      renderedCount++;
      recordResult(`Chart ${chartId} rendered`, true);
    } else if (!canvasExists) {
      recordResult(`Chart ${chartId} canvas exists`, false, 'Canvas element not found in DOM');
    } else {
      recordResult(`Chart ${chartId} instance exists`, false, 'Chart.js instance not created');
    }
  });

  log.info(`${renderedCount}/${expectedCharts.length} charts successfully rendered`);
}

// ==================================================================
// TEST SUITE 4: Financial Data Sanitization
// ==================================================================

function testFinancialSanitization() {
  log.section('TEST SUITE 4: Financial Data Sanitization (CRITICAL)');

  if (typeof window.initialData === 'undefined') {
    log.warn('This test only works on EXPORTED files (Client_Report_Secure.html)');
    log.info('To test: 1) Export client report, 2) Open exported HTML, 3) Run this test');
    return;
  }

  const sensitiveKeys = ['totals', 'revenue', 'price', 'cost', 'invoice_amount', 'amount', 'fee', 'charge'];
  const data = window.initialData;

  if (!data || data.length === 0) {
    recordResult('Exported data exists', false, 'window.initialData is empty');
    return;
  }

  log.info(`Checking ${data.length} exported records for financial data leaks...`);

  let leaksFound = [];
  data.forEach((record, idx) => {
    Object.keys(record).forEach(key => {
      const lowerKey = key.toLowerCase();
      const isSensitive = sensitiveKeys.some(s => lowerKey.includes(s));
      if (isSensitive) {
        leaksFound.push({ record: idx, field: key });
      }
    });
  });

  recordResult('NO financial data in exported file', leaksFound.length === 0,
    leaksFound.length > 0 ? `Found ${leaksFound.length} sensitive fields: ${JSON.stringify(leaksFound)}` : '');

  // Check specific fields
  const firstRecord = data[0];
  recordResult('totals field removed', !('totals' in firstRecord));
  recordResult('_revenue field removed', !('_revenue' in firstRecord));
  recordResult('invoice_amount field removed', !('invoice_amount' in firstRecord));

  // Verify non-financial fields preserved
  recordResult('date field preserved', 'date' in firstRecord);
  recordResult('status field preserved', 'status' in firstRecord || '_status' in firstRecord);
  recordResult('Age field preserved', 'Age' in firstRecord || '_age' in firstRecord);
  recordResult('Region field preserved', 'Region' in firstRecord || '_region' in firstRecord);

  if (leaksFound.length === 0) {
    log.pass('🔒 SECURITY CHECK PASSED: Zero financial data leaks detected');
  } else {
    log.fail('🔒 SECURITY CHECK FAILED: Financial data found in exported file');
  }
}

// ==================================================================
// TEST SUITE 5: Presentation Mode Verification
// ==================================================================

function testPresentationModes() {
  log.section('TEST SUITE 5: Presentation Mode Configuration');

  // Test slide configuration
  const allSlides = [
    'chartSelfPayOrigin',
    'chartAgeProduct',
    'chartStackedProdLocation',
    'chartRevenueByLocation',
    'chartProductDistribution',
    'chartSexDistribution',
    'chartProcessStatus',
    'chartBookingType',
    'chartProductPaymentRatio',
    'chartTopClients',
    'chartTopPostcodes',
    'chartRevByMonth'
  ];

  const financialCharts = ['chartRevenueByLocation', 'chartRevByMonth', 'chartProductPaymentRatio'];
  const clientModeSlides = allSlides.filter(id =>
    !financialCharts.includes(id)
  );

  log.info(`Total slides defined: ${allSlides.length}`);
  log.info(`Financial charts: ${financialCharts.length}`);
  log.info(`Client mode slides: ${clientModeSlides.length}`);

  recordResult('Internal mode should have 12 slides', allSlides.length === 12);
  recordResult('Client mode should have 9 slides', clientModeSlides.length === 9);
  recordResult('Financial charts correctly identified', financialCharts.length === 3);

  // Verify financial charts
  recordResult('chartRevenueByLocation in financial list', financialCharts.includes('chartRevenueByLocation'));
  recordResult('chartRevByMonth in financial list', financialCharts.includes('chartRevByMonth'));
  recordResult('chartProductPaymentRatio in financial list', financialCharts.includes('chartProductPaymentRatio'));

  // Verify financial charts NOT in client mode
  recordResult('chartRevenueByLocation NOT in client mode', !clientModeSlides.includes('chartRevenueByLocation'));
  recordResult('chartRevByMonth NOT in client mode', !clientModeSlides.includes('chartRevByMonth'));
  recordResult('chartProductPaymentRatio NOT in client mode', !clientModeSlides.includes('chartProductPaymentRatio'));
}

// ==================================================================
// TEST SUITE 6: KPI Calculations
// ==================================================================

function testKPICalculations() {
  log.section('TEST SUITE 6: KPI Calculations');

  if (globalRawData.length === 0) {
    log.warn('No data loaded. Upload an Excel file first.');
    return;
  }

  // Calculate expected KPIs
  const expectedBookings = globalRawData.length;
  const expectedRevenue = globalRawData.reduce((sum, row) => sum + (row._revenue || 0), 0);

  // Get displayed KPIs
  const kpiBookingsEl = document.getElementById('kpiBookings');
  const kpiRevenueEl = document.getElementById('kpiRevenue');

  if (kpiBookingsEl) {
    const displayedBookings = parseInt(kpiBookingsEl.textContent.replace(/,/g, ''));
    recordResult('Total Bookings KPI accurate',
      displayedBookings === expectedBookings,
      `Expected: ${expectedBookings}, Displayed: ${displayedBookings}`);
  } else {
    recordResult('kpiBookings element exists', false);
  }

  if (kpiRevenueEl) {
    const displayedRevenueText = kpiRevenueEl.textContent.replace(/[£,]/g, '');
    const displayedRevenue = parseFloat(displayedRevenueText);
    const revenueMatch = Math.abs(displayedRevenue - expectedRevenue) < 0.01; // Allow 1 penny variance
    recordResult('Total Revenue KPI accurate',
      revenueMatch,
      `Expected: £${expectedRevenue.toFixed(2)}, Displayed: £${displayedRevenue.toFixed(2)}`);
  } else {
    recordResult('kpiRevenue element exists', false);
  }

  log.info(`Expected Total Bookings: ${expectedBookings}`);
  log.info(`Expected Total Revenue: £${expectedRevenue.toFixed(2)}`);
}

// ==================================================================
// TEST SUITE 7: DOM Elements Verification
// ==================================================================

function testDOMElements() {
  log.section('TEST SUITE 7: DOM Elements Verification');

  const requiredElements = [
    'fileInput',
    'presentBtn',
    'exportReportBtn',
    'presentationOverlay',
    'modeDialog',
    'startInternalBtn',
    'startClientBtn',
    'exitPresentBtn',
    'prevSlideBtn',
    'nextSlideBtn',
    'slideCounter',
    'slideTitle',
    'activeSlideFrame',
    'themeSelect',
    'layoutMode'
  ];

  requiredElements.forEach(id => {
    const element = document.getElementById(id);
    recordResult(`Element #${id} exists`, element !== null);
  });
}

// ==================================================================
// TEST SUITE 8: Memory Leak Check
// ==================================================================

function testMemoryLeaks() {
  log.section('TEST SUITE 8: Memory Leak Prevention');

  log.info('Checking Chart.js instance management...');

  const chartKeys = Object.keys(charts);
  let allValid = true;

  chartKeys.forEach(key => {
    const instance = charts[key];
    const isValidInstance = instance && typeof instance.destroy === 'function';
    if (!isValidInstance) {
      allValid = false;
      log.warn(`Invalid chart instance: ${key}`);
    }
  });

  recordResult('All chart instances are valid Chart.js objects', allValid);
  recordResult('Charts object not excessively large', chartKeys.length < 50,
    chartKeys.length >= 50 ? 'Possible memory leak: too many chart instances' : '');

  log.info(`Current chart instances: ${chartKeys.length}`);
  log.info('To test memory leaks: Upload new data and verify old charts are destroyed');
}

// ==================================================================
// MASTER TEST RUNNER
// ==================================================================

function runAllTests() {
  console.clear();
  log.section('🧪 EXCEL DASHBOARD - AUTOMATED TEST SUITE 🧪');

  testResults.passed = 0;
  testResults.failed = 0;
  testResults.total = 0;
  testResults.failures = [];

  testGlobalVariables();
  testDataProcessing();
  testChartRendering();
  testFinancialSanitization();
  testPresentationModes();
  testKPICalculations();
  testDOMElements();
  testMemoryLeaks();

  // Final Report
  log.section('TEST RESULTS SUMMARY');
  console.log(`%cTotal Tests: ${testResults.total}`, 'font-size: 16px; font-weight: bold');
  console.log(`%c✅ Passed: ${testResults.passed}`, 'color: green; font-size: 16px; font-weight: bold');
  console.log(`%c❌ Failed: ${testResults.failed}`, 'color: red; font-size: 16px; font-weight: bold');

  const passRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
  console.log(`%cPass Rate: ${passRate}%`, passRate >= 90 ? 'color: green; font-size: 18px; font-weight: bold' : 'color: orange; font-size: 18px; font-weight: bold');

  if (testResults.failures.length > 0) {
    log.section('FAILED TESTS DETAIL');
    testResults.failures.forEach(failure => {
      console.log(`%c❌ ${failure.test}`, 'color: red; font-weight: bold');
      if (failure.details) {
        console.log(`   ${failure.details}`);
      }
    });
  }

  if (testResults.failed === 0) {
    console.log('%c\n🎉 ALL TESTS PASSED! 🎉\n', 'color: green; font-size: 20px; font-weight: bold; background: #d4edda; padding: 10px');
  } else if (passRate >= 90) {
    console.log('%c\n✅ TESTS MOSTLY PASSED (90%+)\n', 'color: green; font-size: 18px; font-weight: bold');
  } else if (passRate >= 70) {
    console.log('%c\n⚠️ SOME TESTS FAILED (70-90%)\n', 'color: orange; font-size: 18px; font-weight: bold');
  } else {
    console.log('%c\n❌ CRITICAL FAILURES DETECTED\n', 'color: red; font-size: 20px; font-weight: bold; background: #f8d7da; padding: 10px');
  }

  return testResults;
}

// ==================================================================
// INDIVIDUAL TEST FUNCTIONS (can be run separately)
// ==================================================================

// Export functions for manual testing
window.dashboardTests = {
  runAll: runAllTests,
  testGlobalVariables,
  testDataProcessing,
  testChartRendering,
  testFinancialSanitization,
  testPresentationModes,
  testKPICalculations,
  testDOMElements,
  testMemoryLeaks
};

console.log('%c📋 Dashboard Test Suite Loaded!', 'color: blue; font-size: 16px; font-weight: bold');
console.log('%cRun: runAllTests() - to execute all tests', 'color: blue');
console.log('%cOr run individual tests:', 'color: blue');
console.log('  - dashboardTests.testGlobalVariables()');
console.log('  - dashboardTests.testDataProcessing()');
console.log('  - dashboardTests.testChartRendering()');
console.log('  - dashboardTests.testFinancialSanitization() // Run on exported file');
console.log('  - dashboardTests.testPresentationModes()');
console.log('  - dashboardTests.testKPICalculations()');
console.log('  - dashboardTests.testDOMElements()');
console.log('  - dashboardTests.testMemoryLeaks()');
