# CSSBattle — College Coding Event

A full-stack CSSBattle clone built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **MongoDB Atlas**, and **Monaco Editor**.

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local` and fill in your credentials:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/cssbattle?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS (dark theme) |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT (stored in localStorage) |
| Editor | Monaco Editor |
| Deploy | Vercel + MongoDB Atlas |

---

## 📁 Project Structure

```
app/
  page.tsx            ← Home page
  battles/page.tsx    ← All challenges
  editor/[id]/page.tsx ← Editor (main feature)
  leaderboard/page.tsx ← Global rankings
  admin/page.tsx      ← Admin panel
  learn/page.tsx      ← CSS learning resources
  auth/
    login/page.tsx
    signup/page.tsx
  api/
    auth/login/route.ts
    auth/signup/route.ts
    challenge/route.ts
    challenge/[id]/route.ts
    submit/route.ts
    leaderboard/route.ts
    admin/upload/route.ts

components/
  AuthProvider.tsx    ← JWT auth context
  Navbar.tsx
  Sidebar.tsx
  Editor.tsx          ← Monaco wrapper
  Preview.tsx         ← iframe live preview
  TargetImage.tsx     ← Target + compare mode
  ChallengeCard.tsx
  CountdownTimer.tsx
  ScoreModal.tsx

lib/
  mongodb.ts          ← DB connection
  auth.ts             ← JWT utilities

models/
  User.ts
  Challenge.ts
  Submission.ts

public/
  challenges/         ← Uploaded target images
```

---

## 🔑 Making Someone Admin

After signing up, update the user in MongoDB Atlas:
```js
db.users.updateOne(
  { email: "admin@yourevent.com" },
  { $set: { isAdmin: true } }
)
```

Then the Admin Panel at `/admin` will be accessible.

---

## 🎯 Scoring Formula

```
Score = (Similarity% × 10) − Code Length
```

- **Similarity**: Pixel comparison of user output vs target (0–100%)
- **Code Length**: Character count of the submitted code (minified)

---

## 🔒 Security

- Passwords hashed with bcrypt (12 rounds)
- JWT tokens expire in 7 days
- iframe sandbox prevents JavaScript execution in user code
- Script tags stripped from preview HTML

---

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!
