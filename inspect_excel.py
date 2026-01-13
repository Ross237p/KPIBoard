import pandas as pd
import os

file_path = r'C:\Users\rossg\.gemini\antigravity\scratch\excel_dashboard\Anonymised Booking Dashboard.xlsx'

try:
    # Read the Excel file
    df = pd.read_excel(file_path)
    
    print("--- Columns ---")
    print(df.columns.tolist())
    
    print("\n--- First 3 Rows ---")
    print(df.head(3).to_markdown(index=False, numalign="left", stralign="left"))
    
    print("\n--- Data Types ---")
    print(df.dtypes)

except Exception as e:
    print(f"Error reading excel file: {e}")
