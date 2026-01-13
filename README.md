# Excel -> HTML Dashboard

A client-side analytics dashboard that visualizes booking and revenue data from Excel spreadsheets. This tool runs locally in your browser and processes data securely on your machine without uploading it to any external server.

## Features

- **Instant Visualizations**: Automatically generates KPIs, charts, and tables from raw Excel data.
- **Interactive Filtering**: Filter by location, status, client prefix, and date ranges.
- **Multiple Views**: Switch between "Compact" and "Spacious" layouts or Light/Dark themes.
- **Presentation Mode**: specific modes for Internal (financials included) or Client (financials hidden) presentations.
- **Zero-Install**: Runs directly in the browser with a simple local server.

## Prerequisites

- **Node.js**: You need Node.js installed to run the local server. [Download Node.js](https://nodejs.org/)

## Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Ross237p/KPIBoard.git
    cd KPIBoard
    ```

2.  **Start the local server**:
    This project uses a zero-dependency server script. You do not need to run `npm install`.
    ```bash
    node server.js
    ```

3.  **Open the Dashboard**:
    The server will start at `http://localhost:5173`. Open this URL in your web browser.

## How to Use

1.  **Launch the App**: Open `http://localhost:5173` in your browser.
2.  **Load Data**:
    -   Click the **"Choose File"** button in the top toolbar.
    -   Select your Excel export file (`.xlsx` or `.xls`).
    -   The dashboard will instantly render the charts and KPIs.
3.  **Analyze**: Use the filters on the left/top to drill down into specific locations or time periods.
4.  **Present**: Click the "Presentation Mode" button (TV icon) to enter a simplified slide view perfect for meetings.

## Data Requirements

The Excel file (`.xlsx` or `.xls`) must contain the following Key columns for the dashboard to function correctly:

| Column Name | Description |
| :--- | :--- |
| `date` | Appointment date (primary date field) |
| `totals` | Revenue amount for the booking |
| `location` | Site/Hospital Name |
| `status` | Booking status (e.g., 'Booked', 'Cancelled') |
| `Corporate Or Self Pay` | Payment categorization |
| `Prefix` | Client/Patient Prefix |
| `postcode_region` | Region derived from postcode |
| `product_code` | Code for the service/product booked |

*Note: Ensure your Excel file headers exactly match these names.*

-   `index.html`: The main dashboard application structure and logic.
-   `server.js`: Simple HTTP server to host the application locally.
-   `style.css`: Core styling (though much is embedded in `index.html`).
-   `inspect_excel.py`: Utility script to inspect Excel file structure for debugging.

## Troubleshooting

-   **Files not loading?** Ensure you are running the `node server.js` command. Opening `index.html` directly from the file system might block some features due to browser security policies (CORS).
-   **Wrong columns?** This dashboard expects a specific Excel schema. Check `inspect_excel.py` to see expected column structures.
