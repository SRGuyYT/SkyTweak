#!/usr/bin/env node
import fs from 'node:fs';
const path = process.argv[2] || 'SkyTweak.json';
const source = JSON.parse(fs.readFileSync(path, 'utf8'));
const issues = [];
const validCategories = new Set(['entertainment', 'social', 'utilities', 'developer', 'games']);
const requiredTop = ['name', 'subtitle', 'description', 'iconURL', 'headerURL', 'website', 'tintColor', 'featuredApps', 'apps'];
const requiredApp = ['name', 'bundleIdentifier', 'developerName', 'subtitle', 'localizedDescription', 'iconURL', 'tintColor', 'category', 'screenshots', 'versions', 'developerURL', 'sourceURL'];
const requiredVersion = ['version', 'date', 'localizedDescription', 'downloadURL', 'size', 'buildVersion', 'minOSVersion'];
function add(severity, location, message) { issues.push({ severity, location, message }); }
function empty(value) { return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0); }
for (const field of requiredTop) if (empty(source[field])) add('critical', 'repository', 'Missing or empty top-level ' + field);
if (!Array.isArray(source.apps)) add('critical', 'repository.apps', 'apps must be an array');
if (!Array.isArray(source.featuredApps)) add('high', 'repository.featuredApps', 'featuredApps must be an array of bundle identifiers');
const bundleIds = new Set();
for (const [index, app] of (source.apps || []).entries()) {
  const location = 'apps[' + index + '] ' + (app.name || '(unnamed)');
  for (const field of requiredApp) if (empty(app[field])) add('high', location, 'Missing or empty app field ' + field);
  if (app.category && !validCategories.has(app.category)) add('medium', location, 'Unexpected category ' + app.category);
  if (bundleIds.has(app.bundleIdentifier)) add('high', location, 'Duplicate bundleIdentifier ' + app.bundleIdentifier);
  bundleIds.add(app.bundleIdentifier);
  if (!Array.isArray(app.versions) || app.versions.length === 0) add('critical', location + '.versions', 'At least one version is required');
  for (const [versionIndex, version] of (app.versions || []).entries()) {
    const versionLocation = location + '.versions[' + versionIndex + ']';
    for (const field of requiredVersion) if (empty(version[field])) add(field === 'downloadURL' ? 'critical' : 'high', versionLocation, 'Missing or empty version field ' + field);
    if (version.downloadURL && /release-assets\.githubusercontent\.com/.test(version.downloadURL)) add('critical', versionLocation, 'Temporary GitHub release asset URL; replace with stable github.com/.../releases/download/... URL');
    if (version.downloadURL && /[?&](se|ske|sig|jwt)=/.test(version.downloadURL)) add('critical', versionLocation, 'Signed URL contains expiration/authentication query parameters');
    if (version.date && Number.isNaN(Date.parse(version.date))) add('high', versionLocation, 'Invalid ISO date');
  }
}
for (const bundleIdentifier of source.featuredApps || []) {
  if (!bundleIds.has(bundleIdentifier)) add('high', 'repository.featuredApps', 'Unknown featured app bundleIdentifier ' + bundleIdentifier);
}
async function checkUrl(url, location) {
  try {
    const response = await fetch(url, { method: 'HEAD', redirect: 'follow' });
    if (!response.ok) add('high', location, 'URL returned HTTP ' + response.status + ': ' + url);
  } catch (error) {
    add('medium', location, 'URL check failed: ' + url + ' (' + error.message + ')');
  }
}
async function main() {
  if (process.argv.includes('--check-urls')) {
    const checks = [];
    checks.push(checkUrl(source.iconURL, 'repository.iconURL'));
    checks.push(checkUrl(source.headerURL, 'repository.headerURL'));
    for (const [index, app] of (source.apps || []).entries()) {
      checks.push(checkUrl(app.iconURL, 'apps[' + index + '].iconURL'));
      const screenshots = Array.isArray(app.screenshots) ? app.screenshots : [ ...(app.screenshots?.iphone || []), ...(app.screenshots?.ipad || []).map(s => typeof s === 'string' ? s : s.imageURL) ];
      screenshots.filter(Boolean).forEach((url, screenshotIndex) => checks.push(checkUrl(url, 'apps[' + index + '].screenshots[' + screenshotIndex + ']')));
      for (const [versionIndex, version] of (app.versions || []).entries()) checks.push(checkUrl(version.downloadURL, 'apps[' + index + '].versions[' + versionIndex + '].downloadURL'));
    }
    await Promise.all(checks);
  }
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  issues.sort((a, b) => order[a.severity] - order[b.severity] || a.location.localeCompare(b.location));
  console.log(JSON.stringify({ ok: issues.length === 0, issueCount: issues.length, issues }, null, 2));
  process.exit(issues.some(issue => issue.severity === 'critical' || issue.severity === 'high') ? 1 : 0);
}
main();

