# Meesho Auto Product Lister

This extension automates product listings on the Meesho Supplier Panel using CSV data.

## Features
- CSV Upload support
- Automatic form filling (Name, Price, MRP, SKU, Stock, Description)
- Image upload from URL
- Category selection support
- Progress tracking
- Anti-detection delays (3-5s)

## CSV Format
Your CSV file should have the following headers:
`product_name, description, category, price, mrp, stock, sku, image_url`

## Installation Instructions (Load Unpacked)

1. Open Google Chrome.
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** by toggling the switch in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the folder containing these extension files (`meesho-auto-lister`).
6. The extension icon should now appear in your browser toolbar.

## How to Use
1. Go to the [Meesho Supplier Panel](https://supplier.meesho.com/).
2. Login to your account.
3. Navigate to the "Add Single Listing" page.
4. Click the extension icon in your toolbar.
5. Upload your CSV file.
6. Click **Start Auto Listing**.
7. The extension will begin filling the form for each product in your CSV.

## Important Note
Since Meesho frequently updates its website, the automation selectors might need occasional adjustments. This extension uses standard attribute selectors to maximize compatibility.
