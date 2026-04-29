# GitHub access setup

Local repository state:

- Branch: `feature/core-loop-obstacle-stops`
- Remote: `git@github.com:GurkenzZ/Misha-Reading.git`
- SSH key path: `.local-secrets/github_deploy_key`
- Public key path: `.local-secrets/github_deploy_key.pub`

The private key is stored only locally and `.local-secrets/` is ignored by git.

## One-time action required

Add this public key to the GitHub repository as a deploy key with write access:

```text
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFx3HrPGdn92Bj5VAnKocIq8JjozMkaSl7wGhhm+ogh3 codex-misha-reading-deploy
```

GitHub path:

1. Open `https://github.com/GurkenzZ/Misha-Reading/settings/keys`.
2. Click `Add deploy key`.
3. Title: `Codex Misha Reading`.
4. Paste the public key above.
5. Enable `Allow write access`.
6. Click `Add key`.

After that, tell Codex that the deploy key is added. Codex can then run:

```powershell
git push -u origin feature/core-loop-obstacle-stops
```

Future commits and pushes should work without additional user action as long as the deploy key remains enabled.
