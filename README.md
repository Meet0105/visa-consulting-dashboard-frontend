# Visa Consulting Dashboard - Frontend

A modern, responsive Next.js dashboard application for visa consulting management with role-based access control.

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Query (@tanstack/react-query)
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Authentication**: JWT with httpOnly cookies

## ✨ Features

- **Multi-Role Dashboards**: Admin, Manager, and User dashboards with role-specific features
- **Authentication**: Secure login/signup with JWT token management
- **Real-time Analytics**: Interactive charts and data visualization
- **Responsive Design**: Mobile-first approach with dark mode support
- **Modern UI/UX**: Beautiful gradients, smooth animations, and professional design

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The app will be available at `http://localhost:3000`

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE=http://localhost:4000
JWT_SECRET=your-jwt-secret-key-here
```

**Important**: 
- `JWT_SECRET` must match the backend server's JWT_SECRET
- `NEXT_PUBLIC_API_BASE` should point to your deployed backend API

## 📁 Project Structure

```
web/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── dashboard/    # Role-specific dashboards
│   │   ├── login/        # Authentication pages
│   │   └── signup/
│   ├── components/        # Reusable React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and API client
│   ├── middleware.ts     # Next.js middleware for auth
│   ├── styles/           # Global CSS
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
├── package.json
└── next.config.js
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Authentication Flow

1. User logs in via `/login`
2. Backend sets JWT token in httpOnly cookie
3. Middleware validates token on protected routes
4. User redirected to role-specific dashboard

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- Render
- AWS Amplify

## 📝 API Integration

The frontend communicates with the backend API defined in `src/lib/api.ts`. Make sure your backend is running and accessible at the `NEXT_PUBLIC_API_BASE` URL.

## 🎨 Styling

- Uses Tailwind CSS for utility-first styling
- Dark mode support via `dark:` classes
- Custom CSS variables in `globals.css`
- Responsive breakpoints: sm, md, lg, xl

## 🐛 Troubleshooting

**404 Error on Vercel**: 
- Make sure root directory is set to root (not `web` folder)
- Verify environment variables are set

**API Connection Issues**:
- Check `NEXT_PUBLIC_API_BASE` is correct
- Verify backend CORS settings allow your frontend domain
- Check browser console for CORS errors

**Authentication Issues**:
- Ensure `JWT_SECRET` matches backend
- Check cookies are enabled in browser
- Verify backend is running and accessible

## 📄 License

Private project - All rights reserved

## 👥 Support

For issues or questions, please contact the development team.

