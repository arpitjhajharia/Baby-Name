# Baby Name Vote

A mobile-native web app for family members to submit and vote on baby names.

## Features

- Submit up to 3 boy names and 3 girl names per family member
- Vote for one boy name and one girl name submitted by someone else
- Live dashboard showing top 3 ranked names for each gender
- Real-time updates across all devices

## Setup

### 1. Create a Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add project** → name it `baby-name-vote` → Create
3. In the left sidebar, click **Firestore Database** → **Create database**
   - Choose **Start in test mode** (or use the rules below)
   - Pick any region
4. Go to **Project Settings** (gear icon) → **General** → scroll to **Your apps**
5. Click **</>** (Web app) → name it → Register
6. Copy the `firebaseConfig` values — you'll need them in step 3

### 2. Apply Firestore Security Rules

In Firebase Console → Firestore → **Rules** tab, paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

Click **Publish**.

### 3. Add GitHub Secrets

In your GitHub repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:

Add each of these secrets using the values from your Firebase config:

| Secret Name | Firebase Config Key |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

### 4. Enable GitHub Pages

In your GitHub repo → **Settings** → **Pages**:
- Source: **GitHub Actions**

### 5. Deploy

Push to `main` — GitHub Actions will build and deploy automatically.

Your app will be live at: `https://arpitjhajharia.github.io/baby-name/`

## Local Development

```bash
cp .env.example .env
# fill in your Firebase values in .env

npm install
npm run dev
```
