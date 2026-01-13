import json

# 1. Sample Data (Simulating what is in the browser)
sample_data = [
    { 
        "date": "13/01/2025", 
        "status": "Booked", 
        "totals": "£543.38",  # SENSITIVE
        "Age": 50, 
        "Region": "Ilford", 
        "product_code": "Advanced", 
        "_revenue": 543.38      # SENSITIVE (Internal)
    },
    { 
        "date": "14/01/2025", 
        "status": "Completed", 
        "totals": "£200.00",  # SENSITIVE
        "invoice_amount": 200, # SENSITIVE
        "Age": 35, 
        "Region": "London", 
        "_revenue": 200.00      # SENSITIVE (Internal)
    }
]

print("--- ORIGINAL DATA (First Record) ---")
print(json.dumps(sample_data[0], indent=2))

# 2. Sanitization Logic (Mimicking app.js)
sensitive_keys = ['totals', 'revenue', 'price', 'cost', 'invoice_amount', 'amount', 'fee', 'charge']

sanitized_data = []
for row in sample_data:
    new_row = row.copy()
    
    # Explicitly remove internal revenue
    if '_revenue' in new_row:
        del new_row['_revenue']
    
    # Remove keys matching sensitive words
    keys_to_remove = []
    for k in new_row.keys():
        lower_k = k.lower()
        for s in sensitive_keys:
            if s in lower_k:
                keys_to_remove.append(k)
                break
    
    for k in keys_to_remove:
        del new_row[k]
        
    sanitized_data.append(new_row)

print("\n--- SANITIZED DATA (First Record) ---")
print(json.dumps(sanitized_data[0], indent=2))

# 3. Verification
print("\n--- VERIFICATION RESULTS ---")
keys_remaining = sanitized_data[0].keys()
forbidden_found = False
for k in keys_remaining:
    if k in ['totals', '_revenue', 'invoice_amount']:
        print(f"FAILED: Found forbidden key '{k}'")
        forbidden_found = True

if not forbidden_found:
    print("SUCCESS: All financial data removed.")
else:
    print("FAILED: Financial data still present.")
