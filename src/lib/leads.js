const KEY = '***';

export function loadLeads() {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function saveLeads(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* storage full or blocked — fail quietly */
  }
}

export function addLead(lead) {
  const entry = {
    id:
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    createdAt: new Date().toISOString(),
    status: 'new',
    ...lead,
  };
  const list = loadLeads();
  list.unshift(entry);
  saveLeads(list);
  return entry;
}

export function updateLead(id, patch) {
  const list = loadLeads().map((l) => (l.id === id ? { ...l, ...patch } : l));
  saveLeads(list);
  return list;
}

export function removeLead(id) {
  const list = loadLeads().filter((l) => l.id !== id);
  saveLeads(list);
  return list;
}

export function clearLeads() {
  saveLeads([]);
  return [];
}

/* Build a mailto link for a lead so "send" actually reaches the studio. */
export function leadMailto(lead) {
  const subject = lead.serviceTitle
    ? `Quote request — ${lead.serviceTitle}`
    : 'Quote request — Phox services';
  const lines = [
    lead.serviceTitle ? `Service: ${lead.serviceTitle}` : 'Service: General enquiry',
    `Name: ${lead.name || '-'}`,
    `Email: ${lead.email || '-'}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.budget ? `Budget: ${lead.budget}` : null,
    '',
    lead.message || '(no extra details)',
    '',
    '— sent from phox.services listing',
  ].filter((l) => l !== null);

  return `mailto:hello@phox.digital?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(lines.join('\n'))}`;
}
