# EcoCampus — Sustainable Campus Website (Dark UI + Student Access)

Responsive HTML, CSS, and vanilla JavaScript front-end prototype.

## Run locally
1. Extract the ZIP file.
2. Open `auth.html` in your browser.
3. Register a student account, then the dashboard opens automatically.
4. Log out through the profile button to return to the login screen.

You can also open the folder in VS Code and use Live Server.

## Features
- Premium dark forest-green UI instead of a white background
- Responsive desktop, tablet, and mobile layouts
- CSS-generated 3D planet, orbit and floating details
- Student registration and login screens
- Student name / department reflected in the dashboard
- Dashboard with resource metrics and chart controls
- Campus issue report form, waste-sorting guide, green challenges, points, leaderboard, event planner and idea hub
- Demo account and activity persistence using browser `localStorage`

## Demo-only security limitation
This is a **front-end demonstration**, not production authentication. Account information including passwords is stored in the current browser's localStorage and is not secure. Do not use real passwords or sensitive student data. Browser-local accounts are not shared across devices or users.

For real college use, implement a backend API and database, hash passwords server-side, use secure sessions / HttpOnly cookies, validate all inputs on the server, add password reset, and define role-based access for students, organizers, faculty and campus administrators. Replace sample metrics with verified campus data.
