// DOM Elements
const fileInput = document.getElementById('fileInput');
const fileInputHero = document.getElementById('fileInputHero'); // May not exist in index.html, but keeping for safety
const welcomeState = document.getElementById('welcomeState'); // May not exist, need to check index.html if this causes error
const dashboardContent = document.getElementById('dashboardContent'); // May not exist
const loadSampleBtn = document.getElementById('loadSampleBtn'); // May not exist

// Presentation Elements
const presentBtn = document.getElementById('presentBtn');
const modeDialog = document.getElementById('modeDialog');
const startInternalBtn = document.getElementById('startInternalBtn');
const startClientBtn = document.getElementById('startClientBtn');
const presentationOverlay = document.getElementById('presentationOverlay');
const exitPresentBtn = document.getElementById('exitPresentBtn');
const prevSlideBtn = document.getElementById('prevSlideBtn');
const nextSlideBtn = document.getElementById('nextSlideBtn');
const slideCounter = document.getElementById('slideCounter');
const slideTitle = document.getElementById('slideTitle');
const activeSlideFrame = document.getElementById('activeSlideFrame');
const exportReportBtn = document.getElementById('exportReportBtn');

// Event Listeners
if (fileInput) fileInput.addEventListener('change', handleFileUpload);
// fileInputHero.addEventListener('change', handleFileUpload); // Removed as it might not be in the DOM
if (loadSampleBtn) loadSampleBtn.addEventListener('click', loadSampleData);

// Presentation Mode Listeners
if (presentBtn) presentBtn.addEventListener('click', () => modeDialog.showModal());
if (startInternalBtn) startInternalBtn.addEventListener('click', () => startPresentation('internal'));
if (startClientBtn) startClientBtn.addEventListener('click', () => startPresentation('client'));
if (exitPresentBtn) exitPresentBtn.addEventListener('click', exitPresentation);
if (prevSlideBtn) prevSlideBtn.addEventListener('click', () => changeSlide(-1));
if (nextSlideBtn) nextSlideBtn.addEventListener('click', () => changeSlide(1));

// Export Report Listener
if (exportReportBtn) exportReportBtn.addEventListener('click', () => {
    if (confirm("Do you want to export a Secure Client Report (Financials Removed)?")) {
        exportClientReport();
    }
});

// Chart Instances
let charts = {};
let presentationMode = null;
let currentSlideIndex = 0;
let slides = [];
let globalRawData = [];

// Sample Data
const sampleData = [
    { "date": "13/01/2025", "status": "Booked", "first_name": "Valentin", "last_name": "Elsip", "totals": "£543.38", "Age": 50, "Region": "Ilford", "Corporate Or Self Pay": "Corporate", "product_code": "Advanced", "corp_or_self": "Corporate" },
    { "date": "13/01/2025", "status": "Booked", "first_name": "Carlin", "last_name": "Towson", "totals": "£543.38", "Age": 52, "Region": "Milton Keynes", "Corporate Or Self Pay": "Corporate", "product_code": "Select", "corp_or_self": "Corporate" },
    { "date": "13/01/2025", "status": "Booked", "first_name": "Woodie", "last_name": "Kynsey", "totals": "£543.38", "Age": 44, "Region": "South East London", "Corporate Or Self Pay": "Corporate", "product_code": "Essential", "corp_or_self": "Self Pay" },
    { "date": "14/01/2025", "status": "Completed", "first_name": "Jane", "last_name": "Doe", "totals": "£200.00", "Age": 35, "Region": "London", "Corporate Or Self Pay": "Self Pay", "product_code": "Advanced Plus", "corp_or_self": "Self Pay" },
    { "date": "14/01/2025", "status": "Cancelled", "first_name": "John", "last_name": "Smith", "totals": "£0.00", "Age": 29, "Region": "London", "Corporate Or Self Pay": "Self Pay", "product_code": "GSK", "corp_or_self": "Corporate Flex" },
    { "date": "15/01/2025", "status": "Booked", "first_name": "Alice", "last_name": "Jones", "totals": "£150.00", "Age": 40, "Region": "Ilford", "Corporate Or Self Pay": "Corporate", "product_code": "Advanced", "corp_or_self": "Corporate" }
];

function loadSampleData() {
    processData(sampleData);
}

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        processData(jsonData);
    };
    reader.readAsArrayBuffer(file);
}

function processData(data) {
    globalRawData = data;

    // Check if elements exist before accessing classList
    if (welcomeState) welcomeState.classList.add('hidden');
    if (dashboardContent) dashboardContent.classList.remove('hidden');

    const cleanedData = data.map(row => {
        let revenue = 0;
        if (row['totals']) {
            const cleanStr = String(row['totals']).replace(/[^\d.-]/g, '');
            revenue = parseFloat(cleanStr) || 0;
        }

        let dateObj = null;
        if (row['date']) {
            const parts = String(row['date']).split('/');
            if (parts.length === 3) {
                dateObj = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
            }
        }

        return {
            ...row,
            _revenue: revenue,
            _date: dateObj,
            _age: parseInt(row['Age']) || 0,
            _region: row['Region'] || 'Unknown',
            _status: row['status'] || 'Unknown',
            _type: row['Corporate Or Self Pay'] || 'Unknown'
        };
    });

    updateKPIs(cleanedData);
    updateCharts(cleanedData);
    updateTable(cleanedData);
}

function updateKPIs(data) {
    // Format helpers
    const fmtMoney = n => (n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const fmtInt = n => (n ?? 0).toLocaleString();

    // Calculate all KPI values
    const totalBookings = data.length;
    const totalRevenue = data.reduce((sum, row) => sum + row._revenue, 0);
    const avgRevenue = totalBookings ? (totalRevenue / totalBookings) : 0;

    // Unique locations - use _region or location field
    const locations = new Set(data.map(r => r._region || r.location || 'Unknown'));
    const uniqueLocations = locations.size;

    // Payment Type Counts - check both corp_or_self and _type fields
    const getPaymentType = (row) => {
        const corpOrSelf = (row.corp_or_self || row._type || '').toString().toLowerCase();
        return corpOrSelf;
    };
    const corpCount = data.filter(r => getPaymentType(r) === 'corporate').length;
    const selfCount = data.filter(r => getPaymentType(r) === 'self pay').length;
    const flexCount = data.filter(r => getPaymentType(r) === 'corporate flex').length;

    // Total Recalls (set to 0 if no recall data available in exported context)
    const totalRecalls = 0; // Recall data comes from separate file upload, not available in export

    // Update all KPI elements
    const kpiBook = document.getElementById('kpiBookings');
    if (kpiBook) kpiBook.textContent = fmtInt(totalBookings);

    const kpiRev = document.getElementById('kpiRevenue');
    if (kpiRev) kpiRev.textContent = '£' + fmtMoney(totalRevenue);

    const kpiARPU = document.getElementById('kpiARPU');
    if (kpiARPU) kpiARPU.textContent = '£' + fmtMoney(avgRevenue);

    const kpiLoc = document.getElementById('kpiLocations');
    if (kpiLoc) kpiLoc.textContent = fmtInt(uniqueLocations);

    const kpiCorp = document.getElementById('kpiCorp');
    if (kpiCorp) kpiCorp.textContent = fmtInt(corpCount);

    const kpiSelf = document.getElementById('kpiSelf');
    if (kpiSelf) kpiSelf.textContent = fmtInt(selfCount);

    const kpiFlex = document.getElementById('kpiFlex');
    if (kpiFlex) kpiFlex.textContent = fmtInt(flexCount);

    const kpiRecalls = document.getElementById('kpiRecalls');
    if (kpiRecalls) kpiRecalls.textContent = fmtInt(totalRecalls);
}

function updateCharts(data) {
    // 1. Trend Chart
    const dateCounts = {};
    data.forEach(r => {
        if (r._date && !isNaN(r._date)) {
            const dateStr = r._date.toISOString().split('T')[0];
            dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        }
    });
    const sortedDates = Object.keys(dateCounts).sort();
    // Check if element exists
    if (document.getElementById('trendChart')) {
        renderChart('trendChart', 'line', {
            labels: sortedDates,
            datasets: [{
                label: 'Daily Bookings',
                data: sortedDates.map(d => dateCounts[d]),
                borderColor: '#4f46e5',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.4,
                fill: true
            }]
        });
    }

    // 2. Status Chart
    const statusCounts = {};
    data.forEach(r => { statusCounts[r._status] = (statusCounts[r._status] || 0) + 1; });
    if (document.getElementById('statusChart')) {
        renderChart('statusChart', 'doughnut', {
            labels: Object.keys(statusCounts),
            datasets: [{
                data: Object.values(statusCounts),
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6']
            }]
        });
    }

    // 3. Region Chart
    const regionCounts = {};
    data.forEach(r => { regionCounts[r._region] = (regionCounts[r._region] || 0) + 1; });
    const sortedRegions = Object.entries(regionCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);
    if (document.getElementById('regionChart')) {
        renderChart('regionChart', 'bar', {
            labels: sortedRegions.map(x => x[0]),
            datasets: [{
                label: 'Bookings',
                data: sortedRegions.map(x => x[1]),
                backgroundColor: '#8b5cf6',
                borderRadius: 6
            }]
        });
    }

    // 4. Type Chart
    const typeCounts = {};
    data.forEach(r => { typeCounts[r._type] = (typeCounts[r._type] || 0) + 1; });
    if (document.getElementById('typeChart')) {
        renderChart('typeChart', 'pie', {
            labels: Object.keys(typeCounts),
            datasets: [{
                data: Object.values(typeCounts),
                backgroundColor: ['#3b82f6', '#ec4899', '#64748b']
            }]
        });
    }

    // 5. Revenue by Location (New)
    const revByLoc = {};
    data.forEach(r => { revByLoc[r._region] = (revByLoc[r._region] || 0) + r._revenue; });
    const sortedRev = Object.entries(revByLoc).sort((a, b) => b[1] - a[1]).slice(0, 10);
    if (document.getElementById('chartRevenueByLocation')) {
        renderChart('chartRevenueByLocation', 'bar', {
            labels: sortedRev.map(x => x[0]),
            datasets: [{
                label: 'Revenue',
                data: sortedRev.map(x => x[1]),
                backgroundColor: '#0ea5e9',
                borderRadius: 6
            }]
        });
    }
}

function renderChart(canvasId, type, data) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    charts[canvasId] = new Chart(ctx, {
        type: type,
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: type === 'line' || type === 'bar' ? {
                y: { beginAtZero: true, grid: { display: false } },
                x: { grid: { display: false } }
            } : {}
        }
    });
}

function updateTable(data) {
    const tbody = document.getElementById('dataTableBody');
    if (!tbody) return; // Safety check
    tbody.innerHTML = '';

    const recentData = data.slice(0, 10);
    recentData.forEach(row => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition-colors';
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${row['date'] || '-'}</td>
            <td class="px-6 py-4 font-medium text-slate-900">${row['first_name']} ${row['last_name']}</td>
            <td class="px-6 py-4">
                <span class="px-2 py-1 text-xs font-semibold rounded-full 
                    ${row._status === 'Booked' ? 'bg-green-100 text-green-800' :
                row._status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}">
                    ${row._status}
                </span>
            </td>
            <td class="px-6 py-4 text-slate-500">${row._type}</td>
            <td class="px-6 py-4 font-medium text-slate-900">£${row._revenue.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

// --- Presentation Logic ---

function startPresentation(mode) {
    presentationMode = mode;
    modeDialog.close();

    // Define slides based on mode
    // Using IDs from index.html
    // 'chartSelfPayOrigin', 'chartAgeProduct', 'chartStackedProdLocation', 'chartRevenueByLocation', 
    // 'chartProductDistribution', 'chartSexDistribution', 'chartProcessStatus', 'chartBookingType',
    // 'chartProductPaymentRatio', 'chartTopClients', 'chartTopPostcodes', 'chartRevByMonth'

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

    if (mode === 'client') {
        // Exclude revenue charts
        slides = allSlides.filter(id =>
            id !== 'chartRevenueByLocation' &&
            id !== 'chartRevByMonth' &&
            id !== 'chartProductPaymentRatio' // Maybe? User said "finances". Payment Ratio is % so maybe safe? Let's exclude to be safe.
        );
    } else {
        slides = allSlides;
    }

    currentSlideIndex = 0;
    presentationOverlay.style.display = 'flex';
    renderSlide(0);
}

function exitPresentation() {
    presentationOverlay.style.display = 'none';
    // Restore charts by re-processing data (simplest way to put canvases back)
    processData(globalRawData);
}

function changeSlide(dir) {
    const newIndex = currentSlideIndex + dir;
    if (newIndex >= 0 && newIndex < slides.length) {
        currentSlideIndex = newIndex;
        renderSlide(newIndex);
    }
}

function renderSlide(index) {
    const chartId = slides[index];
    const canvas = document.getElementById(chartId);

    slideCounter.textContent = `${index + 1} / ${slides.length}`;

    activeSlideFrame.innerHTML = '';
    if (canvas) {
        activeSlideFrame.appendChild(canvas);
        if (charts[chartId]) {
            charts[chartId].resize();
        }
    } else {
        activeSlideFrame.innerHTML = '<div style="color:red">Chart not found</div>';
    }

    // Simple title mapping
    slideTitle.textContent = chartId.replace('chart', '').replace(/([A-Z])/g, ' $1').trim();
}

// --- Secure Export Logic ---

function exportClientReport() {
    const sensitiveKeys = ['totals', 'revenue', 'price', 'cost', 'invoice_amount', 'amount', 'fee', 'charge'];

    const sanitizedData = globalRawData.map(row => {
        const newRow = { ...row };

        // Remove _revenue internal field
        delete newRow['_revenue'];

        // Remove keys matching sensitive words
        Object.keys(newRow).forEach(k => {
            const lowerK = k.toLowerCase();
            if (sensitiveKeys.some(s => lowerK.includes(s))) {
                delete newRow[k];
            }
        });
        return newRow;
    });

    const htmlContent = document.documentElement.outerHTML;

    // Inject data and auto-load script
    const dataScript = `<script>window.initialData = ${JSON.stringify(sanitizedData)};</script>`;
    const autoLoadScript = `
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            if(window.initialData) {
                // Override the processData to use our data
                // We need to make sure the functions are available.
                // Since this script runs after app.js (which is deferred or at bottom), it should be fine.
                // Wait a bit to ensure app.js is loaded? Or just call it.
                setTimeout(() => {
                    if(typeof processData === 'function') {
                        processData(window.initialData);
                        // Hide uploader
                        const uploader = document.querySelector('.uploader');
                        if(uploader) uploader.style.display = 'none';
                        // Hide export buttons to prevent re-exporting
                        const exportBtn = document.getElementById('exportReportBtn');
                        if(exportBtn) exportBtn.style.display = 'none';
                    }
                }, 500);
            }
        });
    </script>
    `;

    const finalHtml = htmlContent.replace('</body>', `${dataScript}${autoLoadScript}</body>`);

    const blob = new Blob([finalHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Client_Report_Secure.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
