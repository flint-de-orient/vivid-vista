# Land Record Management System

A Next.js application for managing land records with MongoDB backend.

## Features

1. **Khatian Master** - Create and manage khatian records with unique khatian_no, owner, and guardian's name
2. **Plot Master** - Manage plots with plot_no, total_land_area, and nature_of_land
3. **Plot-Khatian Mapping** - Map plots to khatians with land share information
4. **Purchaser Master** - Manage purchaser records with optional khatian_no
5. **Deed Registration** - Register deeds with multiple plot details, sold area, seller type, and relations

## Setup

1. Install dependencies:
```bash
npm install
```

2. Update the database password in `.env.local`:
```
MONGODB_URI=mongodb+srv://sabirwbsedcl_db_user:<your_db_password>@cluster0.mvu5jkj.mongodb.net/land_records?appName=Cluster0
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Models

- **Khatian**: khatian_no (unique), owner, guardian_name
- **Plot**: plot_no (unique), total_land_area, nature_of_land
- **PlotKhatian**: plot_id, khatian_id, land_share
- **Purchaser**: name, guardian_name, khatian_no (optional)
- **Deed**: deed_no (unique), deed_date, plot_details[]

## API Endpoints

- `/api/khatians` - GET/POST khatian records
- `/api/plots` - GET/POST plot records
- `/api/plot-khatians` - GET/POST plot-khatian mappings
- `/api/purchasers` - GET/POST purchaser records
- `/api/deeds` - GET/POST deed records