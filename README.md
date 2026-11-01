# Sevana Sub-Modules

Sevana is a community-service platform with two connected frontend modules: donations and aid, plus educational and medical camps.

## Run the complete demo

Install dependencies in each module once, then start both apps from this directory:

```bash
npm install --prefix sevana-donations/Sevana-Donations-And-Aid
npm install --prefix sevana-camps/Sevana-Camps-Module
npm run dev:donations
npm run dev:camps
```

Open Donations & Aid at `http://localhost:5173` and Camps at `http://localhost:5174`. Each app links to the other in its navigation. `npm run build` builds both modules.

## Donations & Aid Module
👉 [`sevana-donations/Sevana-Donations-And-Aid`](./sevana-donations/Sevana-Donations-And-Aid)
```bash
cd sevana-donations/Sevana-Donations-And-Aid
npm install
npm run dev
```

## Camps Module
👉 [`sevana-camps/Sevana-Camps-Module`](./sevana-camps/Sevana-Camps-Module)
```bash
cd sevana-camps/Sevana-Camps-Module
npm install
npm run dev
```

Both modules are frontend demos and save new camps, registrations, invitations, donation receipts, and XP in browser storage. Real accounts, server synchronization, NGO verification, payment processing, and moderation still require a backend.
