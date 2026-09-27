# HemaVault — National Blood Banking & Emergency Transfusion Network

An urgent deep-red and white blood bank management system, donor eligibility registry, and hospital STAT requisition network built with React 18, Vite 5, Tailwind CSS, and Zustand.

## Features
- **Cryogenic Vault Inventory**: Live unit counts across all 8 blood groups (O-, O+, A-, A+, B-, B+, AB-, AB+) with target benchmarks and cold-storage shelf-life monitoring.
- **Emergency STAT Broadcasting**: Broadcast rapid SMS emergency alerts to verified matching eligible donors during critical inventory deficits.
- **Hospital Transfusion Fulfillment**: Trauma centers and ICU departments can submit emergency requisitions with one-click dispatch and live inventory deductions.
- **Donor Registry & Cooldown Engine**: Track verified donors with automatic 56-day cooldown interval enforcement and total historical donations counter.
- **Donor Onboarding**: Seamless registration portal for citizens to join the emergency donor network.

## Running Locally
```bash
npm install
npm run dev
```
Port: `http://localhost:3044`
