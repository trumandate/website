# Branching — preview and production

Two long-lived branches. Nothing else is needed for a site this size.

| Branch | Role | Deploys to |
|---|---|---|
| `main` | **Production.** Only ever receives merges from `preview`, and only when a release is intended. | `www.trumandate.com` (custom domain) |
| `preview` | **Working branch.** All development, agent work, and verification lands here first. | Preview URL (versioned `*.workers.dev` deployment) |

## The rule

**Never commit directly to `main`.** Work happens on `preview`; production
changes only when someone deliberately merges.

```bash
# day-to-day work
git checkout preview
# ... changes, verification ...
git commit -m "feat: ..."
git push                      # deploys to the preview URL only

# release to the live site, once preview is verified
git checkout main
git merge --ff-only preview
git push                      # deploys to www.trumandate.com
git checkout preview          # go back to working
```

`--ff-only` is deliberate: it fails loudly rather than creating a merge commit
if `main` has drifted (which it should not, since nothing commits to `main`
directly). If it fails, something bypassed this rule — investigate before
forcing anything.

## Cloudflare configuration (one-time, done in the dashboard)

Workers Builds settings for the `trumandate-website` project:

1. **Production branch:** `main` — the branch whose builds serve the custom
   domain.
2. **Non-production branch builds:** enabled — so pushes to `preview` build and
   publish a preview version with its own URL, without touching production.
3. Optionally put **Cloudflare Access** in front of the preview URL if the
   in-progress work should not be publicly reachable while sales reviews.

## What this buys

The live site stops changing on every push. A change reaches
`www.trumandate.com` only when someone merges `preview` into `main` on purpose
— so an in-progress agent run, a half-finished design wave, or a failed
verification can never appear in front of a government buyer.
