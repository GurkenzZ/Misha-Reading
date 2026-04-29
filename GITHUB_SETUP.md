# GitHub publish steps

The first local commit already exists on branch `feature/core-loop-obstacle-stops`.

To publish it to GitHub:

1. Create an empty GitHub repository.
2. Add it as `origin`:

   ```powershell
   git remote add origin https://github.com/<your-user>/<your-repo>.git
   ```

3. If you want the commit attributed to your GitHub account, amend the author before pushing:

   ```powershell
   git config user.name "<your name>"
   git config user.email "<your GitHub email or noreply email>"
   git commit --amend --reset-author --no-edit
   ```

4. Push the current branch:

   ```powershell
   git push -u origin feature/core-loop-obstacle-stops
   ```

If GitHub asks for credentials, use GitHub's browser login flow or a personal access token instead of a password.
