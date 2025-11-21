# How to Push to GitHub

Since your project is already initialized locally, follow these steps to get it on GitHub.

## 1. Create a Repository on GitHub
1. Go to [github.com/new](https://github.com/new).
2. Enter a **Repository name** (e.g., `file-organizer`).
3. Choose **Public** or **Private**.
4. **Do not** check "Initialize this repository with a README" (you already have one).
5. Click **Create repository**.

## 2. Run these commands in your terminal
Copy the URL of your new repository (it looks like `https://github.com/username/repo-name.git`).

Then run the following commands in your terminal:

```bash
# 1. Stage all files
git add .

# 2. Commit changes
git commit -m "Initial commit: Complete file organizer app with sci-fi UI"

# 3. Rename branch to main (if not already)
git branch -M main

# 4. Link your local repo to GitHub (REPLACE THE URL below)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 5. Push your code
git push -u origin main
```

## 3. Verify
Refresh your GitHub page, and you should see your code!
