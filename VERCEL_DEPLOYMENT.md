# Vercel Deployment Guide - Frontend

Step-by-step guide to deploy your Visa Consulting Dashboard frontend to Vercel.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier works)
- Your frontend code pushed to GitHub

## 🚀 Step-by-Step Deployment

### Step 1: Push to GitHub

1. Make sure your `web` folder is a git repository
2. Push to GitHub:
   ```bash
   cd web
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **Sign Up**
3. Choose **Continue with GitHub**
4. Authorize Vercel to access your GitHub

### Step 3: Import Project

1. In Vercel dashboard, click **Add New** → **Project**
2. Find and select your `visa-consulting-frontend` repository
3. Click **Import**

### Step 4: Configure Project

Vercel should auto-detect Next.js, but verify these settings:

- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: `./` (root - not `web` since we're deploying from the web folder)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

**Important**: Since you're deploying the `web` folder as a separate repo, the root directory should be `./` (the root of the repo).

### Step 5: Add Environment Variables

Click **Environment Variables** and add:

#### Required Variables:

1. **NEXT_PUBLIC_API_BASE**
   - Value: Your backend API URL
   - Example: `https://your-backend.railway.app` or `https://your-backend.herokuapp.com`
   - ⚠️ Must start with `https://` in production
   - For all environments: Production, Preview, Development

2. **JWT_SECRET**
   - Value: Same secret key as your backend server
   - Example: `your-super-secret-jwt-key-minimum-32-characters`
   - ⚠️ Must match exactly with backend `JWT_SECRET`
   - For all environments: Production, Preview, Development

#### Example:
```
NEXT_PUBLIC_API_BASE=https://visa-api.railway.app
JWT_SECRET=your-actual-secret-key-here-make-it-long-and-random
```

### Step 6: Deploy

1. Click **Deploy**
2. Wait for build to complete (usually 1-3 minutes)
3. You'll get a deployment URL like: `https://your-project.vercel.app`

### Step 7: Verify Deployment

1. Visit your deployment URL
2. Check if the homepage loads
3. Try logging in with demo credentials
4. Check browser console for errors

## 🔧 Troubleshooting

### Issue: 404 Error

**Solution**: 
- Verify Root Directory is set to `./` (not `web`)
- Check that `package.json` is in the root of the repo
- Re-deploy after fixing

### Issue: Build Fails

**Common causes**:
- Missing dependencies in `package.json`
- TypeScript errors
- Missing environment variables

**Solution**:
- Check build logs in Vercel dashboard
- Fix errors and push again
- Make sure all environment variables are set

### Issue: API Connection Errors

**Symptoms**: 
- "Network Error" in browser console
- CORS errors
- 401/403 errors

**Solutions**:
1. Verify `NEXT_PUBLIC_API_BASE` is correct
2. Check backend CORS allows your Vercel domain
3. Ensure backend is running and accessible
4. Check `JWT_SECRET` matches backend

### Issue: Authentication Not Working

**Solutions**:
- Verify `JWT_SECRET` matches backend exactly
- Check cookies are being set (browser DevTools → Application → Cookies)
- Ensure backend CORS allows credentials

## 🔄 Updating Deployment

Every time you push to GitHub:

1. Vercel automatically detects changes
2. Creates a new deployment
3. Runs build process
4. Deploys to production (if on main branch)

You can also manually redeploy:
- Go to Deployments tab
- Click three dots (⋯) on a deployment
- Click **Redeploy**

## 📝 Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Vercel will handle SSL automatically

## 🎯 Best Practices

1. **Environment Variables**: Always set them in Vercel dashboard, not in code
2. **Branch Deployments**: Vercel automatically creates preview deployments for PRs
3. **Build Logs**: Check them if deployment fails
4. **Backend URL**: Use environment variable, never hardcode
5. **Security**: Never commit `.env` files or secrets

## 📊 Monitoring

- **Analytics**: Vercel provides analytics (paid feature)
- **Logs**: Check function logs in Vercel dashboard
- **Performance**: Use Vercel Speed Insights (free)

## 🆘 Need Help?

- Check Vercel documentation: [vercel.com/docs](https://vercel.com/docs)
- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure backend is deployed and accessible

---

**Quick Checklist**:
- [ ] Code pushed to GitHub
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Environment variables added
- [ ] Deployment successful
- [ ] Site accessible and working

