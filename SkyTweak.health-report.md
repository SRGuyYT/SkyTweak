# SkyTweak Repository Health Report

Generated: 2026-06-18

## Summary

- JSON syntax: PASS
- App entries preserved: 17
- Featured apps generated: 6
- Categories generated: entertainment, social, utilities, developer, games
- Empty marketplaceID/patreon noise removed: PASS
- Missing buildVersion/minOSVersion fields filled: PASS
- Empty screenshots after cleanup: PASS
- Automatic validation script: validate-altstore-source.mjs

## Category Distribution

- developer: 4
- entertainment: 6
- games: 1
- social: 2
- utilities: 4

## Issues Ranked By Severity

- CRITICAL: Facebook++ 502.2.0 uses a temporary GitHub signed asset URL expiring at 2026-06-18T15:01:19Z. Replace with a stable releases/download URL or durable mirror.
- CRITICAL: Messenger++ 390.0 uses a temporary GitHub signed asset URL expiring at 2026-06-18T15:15:09Z. Replace with a stable releases/download URL or durable mirror.
- CRITICAL: Spotify++ 9.0.20 uses a temporary GitHub signed asset URL expiring at 2026-06-18T15:04:52Z. Replace with a stable releases/download URL or durable mirror.
- CRITICAL: OldOS 1.0 uses a temporary GitHub signed asset URL expiring at 2026-06-18T15:05:09Z. Replace with a stable releases/download URL or durable mirror.
- CRITICAL: SoundCloud++ 6.20.0 uses a temporary GitHub signed asset URL expiring at 2026-06-17T22:16:18Z. Replace with a stable releases/download URL or durable mirror.

## URL Validation Notes

- Static URL validation detected 5 temporary GitHub signed download URLs. These are treated as broken for repository distribution because they expire and include authentication query parameters.
- Live network URL checks can be run with: node validate-altstore-source.mjs SkyTweak.json --check-urls
- This execution environment blocked direct outbound fetches during analysis, so live HEAD checks were not used as the source of truth.

## Changes Applied

- Normalized repository branding and header metadata.
- Generated featuredApps from flagship/recent apps.
- Generated the five requested categories and normalized every app category into that set.
- Added developerURL and sourceURL to every app entry.
- Filled missing buildVersion and minOSVersion values.
- Added fallback screenshot imagery for entries that had empty screenshot arrays.
- Replaced mojibake sequences in descriptions/changelogs with ASCII-safe text.
- Removed empty marketplaceID and patreon objects to reduce repetitive data.

## Remaining Required Maintainer Action

Replace or re-host the temporary GitHub signed download URLs for:

- Facebook++ 502.2.0: expires 2026-06-18T15:01:19Z
- Messenger++ 390.0: expires 2026-06-18T15:15:09Z
- Spotify++ 9.0.20: expires 2026-06-18T15:04:52Z
- OldOS 1.0: expires 2026-06-18T15:05:09Z
- SoundCloud++ 6.20.0: expires 2026-06-17T22:16:18Z
