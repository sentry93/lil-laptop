# lil laptop

The public lil laptop homepage, trailer, support and privacy pages by New Air LLC.

Primary website: https://sentry93.github.io/lil-laptop/

Publish `main` → `/ (root)` using GitHub Pages. Keep this repository website-only: no app source, signing files, credentials, customer content or internal release material.

The buildless site uses HTML, CSS and local images. The 20-second approved Hyper World header trailer is compressed for the web and loaded only when requested through the native video controls. Music credit is in `video-credits.txt`. A small local script powers the model and lid switches, desktop previews, sticker playground, and motion. The default page loads no analytics, external web fonts, third-party embeds or tracking cookies. An optional X video backup is published disabled and unconfigured; see below. Playground choices stay in the current browser page and are not transmitted or saved.

Support and privacy remain at `support.html` and `privacy.html`. The original support repository and issue tracker stay available so existing links continue to work.

All screenshot and hero artwork depicts iPhone Duo. The model gallery uses the exact bundled CollectionPreviews assets and the app’s native Duo projection. Every model and colour variant has a front and a lid preview. No App Store screenshot panels are used in the page.

## Emergency video backup

`video-backup-config.js` ships with `enabled: false` and an empty `postUrl`. The normal trailer and purple window frame stay visible. The X template is inert: no iframe or X requests are created while disabled or unconfigured.

To activate during a traffic surge, upload our trailer to a public X post, put its full HTTPS post URL in `postUrl`, set `enabled: true`, and publish the config change to `main`. Bump the config cache version in `index.html` with each switch so returning visitors receive it immediately. No sample post or third-party clip is configured in production. To switch back, set `enabled: false`, clear `postUrl`, and bump that cache version again. Changes take effect after GitHub Pages deploys and visitors reload. This is a manual switch, not an automatic traffic monitor.

The backup replaces the local video inside the existing full-width purple window. It removes the local MP4 source before mounting the X iframe, so this mode serves video traffic from X. A Watch on X link appears only when the backup is active. Invalid or empty configuration leaves the normal trailer intact.

The player-only appearance crops the official X post iframe to its video region, scaling a 518 × 291.375 viewport to the frame width. It assumes the tested one-line post layout. Verify the actual trailer post at desktop and mobile sizes before enabling; X can change its embed layout. Longer post text can require adjusting the crop offset in `video-backup.css`. X controls its own embedded player and third-party data practices when active.
