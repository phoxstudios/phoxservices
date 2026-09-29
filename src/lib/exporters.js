/* CSV export, download helper, and a print-ready services PDF — all client-side. */

function csvCell(value) {
  const v = String(value ?? '');
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

export function leadsToCsv(leads) {
  const header = [
    'Date',
    'Status',
    'Service',
    'Name',
    'Email',
    'Phone',
    'Budget',
    'Message',
  ];
  const rows = leads.map((l) => [
    new Date(l.createdAt).toLocaleString(),
    l.status,
    l.serviceTitle || 'General enquiry',
    l.name,
    l.email,
    l.phone || '',
    l.budget || '',
    l.message || '',
  ]);
  return [header, ...rows].map((r) => r.map(csvCell).join(',')).join('\r\n');
}

export function download(filename, content, mime = 'text/plain') {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/*
 * Opens a clean, print-optimised document in a new tab and triggers the
 * browser print dialog — "Save as PDF" gives a real services PDF.
 */
export function openServicesPdf(categories, packageGroups) {
  const total = categories.reduce((n, c) => n + c.services.length, 0);

  const catHtml = categories
    .map(
      (cat) => `
      <section>
        <h2>${esc(cat.name)} <small>(${cat.services.length} services)</small></h2>
        <p class="intro">${esc(cat.intro)}</p>
        ${cat.services
          .map(
            (s) => `
          <div class="svc">
            <h3>${String(s.num).padStart(2, '0')} · ${esc(s.title)}</h3>
            <p>${esc(s.what)}</p>
            <p class="del"><strong>Deliverables:</strong> ${s.deliverables
              .map(esc)
              .join(' · ')}</p>
            <p class="for"><strong>Ideal for:</strong> ${esc(s.idealFor)}</p>
          </div>`
          )
          .join('')}
      </section>`
    )
    .join('');

  const pkgHtml = packageGroups
    .map(
      (g) => `
      <section>
        <h2>${esc(g.name)}</h2>
        ${g.tiers
          .map(
            (t) => `
          <div class="svc">
            <h3>${esc(t.name)}${t.popular ? ' ★' : ''}</h3>
            <p>${esc(t.for)}</p>
            <p class="del"><strong>Includes:</strong> ${t.includes
              .map(esc)
              .join(' · ')}</p>
          </div>`
          )
          .join('')}
      </section>`
    )
    .join('');

  const doc = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Phox Digital — Services List 2026</title>
<style>
  @page { margin: 18mm; }
  * { box-sizing: border-box; }
  body { font: 13px/1.5 Inter, Arial, sans-serif; color: #1c1f1a; margin: 0; }
  header { border-bottom: 3px solid #163300; padding-bottom: 14px; margin-bottom: 22px; }
  h1 { font-size: 30px; letter-spacing: -1px; color: #163300; margin: 0 0 4px; }
  header p { margin: 0; color: #55604e; }
  section { break-inside: avoid-page; margin-bottom: 26px; }
  h2 { font-size: 19px; color: #163300; border-left: 5px solid #9fe870; padding-left: 10px; margin: 0 0 6px; }
  h2 small { color: #8a8f86; font-weight: 400; }
  .intro { margin: 0 0 12px; color: #55604e; }
  .svc { border: 1px solid #e2e6df; border-radius: 8px; padding: 12px 14px; margin-bottom: 10px; break-inside: avoid; }
  .svc h3 { margin: 0 0 4px; font-size: 14px; color: #0e0f0c; }
  .svc p { margin: 2px 0; }
  .del, .for { font-size: 12px; color: #454745; }
  footer { margin-top: 30px; border-top: 2px solid #163300; padding-top: 10px; font-size: 12px; color: #163300; }
</style>
</head>
<body>
  <header>
    <h1>PHOX DIGITAL STUDIO</h1>
    <p>Every service we offer — ${total} services across ${categories.length} disciplines · Fixed-scope · GCC &amp; India · hello@phox.digital</p>
  </header>
  ${catHtml}
  <section>
    <h1 style="font-size:22px;margin-bottom:14px">Bundled packages</h1>
    ${pkgHtml}
  </section>
  <footer>© 2026 Phox Digital — every service listed with its deliverables, so you know exactly what you are buying. · hello@phox.digital</footer>
</body>
</html>`;

  // Hidden iframe + print dialog: no popups, no navigation, no blockers.
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
  document.body.appendChild(frame);

  const cleanup = () => {
    setTimeout(() => frame.remove(), 1000);
  };

  frame.addEventListener('load', () => {
    try {
      const win = frame.contentWindow;
      win.focus();
      win.onafterprint = cleanup;
      win.print();
      // Fallback cleanup if onafterprint never fires (some browsers).
      setTimeout(cleanup, 60000);
    } catch {
      cleanup();
    }
  });

  frame.srcdoc = doc;
}
