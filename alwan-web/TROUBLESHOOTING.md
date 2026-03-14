# Troubleshooting Guide

## Common Issues and Solutions

### ❌ ChunkLoadError: Loading chunk app/layout failed

**Error Message:**
```
Loading chunk app/layout failed.
(timeout: http://localhost:3000/_next/static/chunks/app/layout.js)
```

**Cause:** Webpack cache corruption or stale dev server

**Solution:**
```bash
# 1. Stop all Node processes
# Windows: Ctrl+C in terminal or close terminal
# Mac/Linux: Ctrl+C

# 2. Clear Next.js cache
rm -rf .next
# Windows PowerShell:
Remove-Item -Recurse -Force .next

# 3. Clear node_modules cache (optional)
rm -rf node_modules/.cache
# Windows PowerShell:
Remove-Item -Recurse -Force node_modules/.cache

# 4. Restart dev server
npm run dev
```

**Quick Fix (One Command):**
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next; npm run dev

# Mac/Linux
rm -rf .next && npm run dev
```

---

### ❌ Port Already in Use

**Error Message:**
```
Port 3000 is already in use
```

**Solution:**
```bash
# Option 1: Kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
npm run dev -- -p 3001
```

---

### ❌ Module Not Found Errors

**Error Message:**
```
Module not found: Can't resolve 'xyz'
```

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Or just install missing package
npm install xyz
```

---

### ❌ Build Fails

**Error Message:**
```
Build failed with errors
```

**Solution:**
```bash
# 1. Clear cache
rm -rf .next

# 2. Check for TypeScript errors
npm run build

# 3. If still failing, reinstall
rm -rf node_modules .next
npm install
npm run build
```

---

### ❌ Styles Not Updating

**Problem:** CSS changes not reflecting

**Solution:**
```bash
# 1. Hard refresh browser
# Windows: Ctrl + Shift + R
# Mac: Cmd + Shift + R

# 2. Clear Next.js cache
rm -rf .next
npm run dev

# 3. Check Tailwind config
# Ensure files are in content array in tailwind.config.ts
```

---

### ❌ Hot Reload Not Working

**Problem:** Changes not reflecting automatically

**Solution:**
```bash
# 1. Restart dev server
# Ctrl+C then npm run dev

# 2. Check file watchers limit (Linux/Mac)
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# 3. Use polling (slower but more reliable)
# Add to package.json dev script:
"dev": "next dev --turbo"
```

---

### ❌ Environment Variables Not Loading

**Problem:** .env.local variables undefined

**Solution:**
```bash
# 1. Restart dev server (required after .env changes)
npm run dev

# 2. Check variable naming
# Must start with NEXT_PUBLIC_ for client-side
NEXT_PUBLIC_API_URL=...

# 3. Verify .env.local exists and is not in .gitignore
ls -la | grep .env
```

---

### ❌ Supabase Connection Issues

**Problem:** Can't connect to Supabase

**Solution:**
```bash
# 1. Check .env.local has correct values
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key

# 2. Verify Supabase project is running
# Check dashboard.supabase.com

# 3. Check network/firewall
# Ensure port 443 is open
```

---

### ❌ Face Detection Not Working

**Problem:** "No face detected" errors

**Solution:**
```bash
# 1. Check image quality
# - Good lighting
# - Clear face
# - Face size > 3% of image

# 2. Verify models loading
# Check browser console for errors

# 3. Try different image
# Use well-lit, clear photo

# See FACE_VERIFICATION_GUIDE.md for details
```

---

### ❌ Git Branch Issues

**Problem:** Can't switch branches or merge conflicts

**Solution:**
```bash
# Check current branch
git branch

# Discard local changes
git checkout .

# Switch branch
git checkout main

# Pull latest
git pull origin main

# If merge conflicts
git status
# Edit conflicted files
git add .
git commit -m "resolve conflicts"
```

---

### ❌ TypeScript Errors

**Problem:** Type errors in IDE

**Solution:**
```bash
# 1. Restart TypeScript server
# VS Code: Cmd/Ctrl + Shift + P > "TypeScript: Restart TS Server"

# 2. Check tsconfig.json
# Ensure paths are correct

# 3. Regenerate types
npm run build

# 4. Install missing types
npm install --save-dev @types/xyz
```

---

### ❌ Slow Build Times

**Problem:** Build takes too long

**Solution:**
```bash
# 1. Use Turbopack (faster)
npm run dev --turbo

# 2. Clear cache
rm -rf .next node_modules/.cache

# 3. Disable source maps in dev
# Add to next.config.ts:
productionBrowserSourceMaps: false

# 4. Reduce bundle size
# Check bundle analyzer
npm run build
```

---

## Quick Fixes Checklist

When something goes wrong, try these in order:

1. ✅ **Hard refresh browser** (Ctrl+Shift+R)
2. ✅ **Restart dev server** (Ctrl+C, then npm run dev)
3. ✅ **Clear .next cache** (rm -rf .next)
4. ✅ **Clear node cache** (rm -rf node_modules/.cache)
5. ✅ **Reinstall dependencies** (rm -rf node_modules && npm install)
6. ✅ **Check .env.local** (verify all variables)
7. ✅ **Check git branch** (git branch)
8. ✅ **Pull latest changes** (git pull)

---

## Getting Help

### Check Logs
```bash
# Dev server logs
npm run dev

# Build logs
npm run build

# Browser console
# F12 > Console tab
```

### Useful Commands
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check Next.js version
npm list next

# Check all dependencies
npm list

# Check for outdated packages
npm outdated
```

### Resources
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Tailwind Docs: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/

---

## Prevention Tips

### Best Practices
1. ✅ Always restart dev server after .env changes
2. ✅ Clear cache when switching branches
3. ✅ Commit changes before switching branches
4. ✅ Keep dependencies updated
5. ✅ Use TypeScript for type safety
6. ✅ Test in multiple browsers
7. ✅ Check console for errors
8. ✅ Use git branches for experiments

### Regular Maintenance
```bash
# Weekly
npm outdated
npm update

# Monthly
npm audit
npm audit fix

# Before deployment
npm run build
npm run lint
```

---

**Last Updated:** March 2024
**Next.js Version:** 15.5.12
