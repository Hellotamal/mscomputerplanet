// Official M/S COMPUTER PLANET Brand Logo & Printable Header

export const COMPANY_LOGO_SVG = `<svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:inline-block; vertical-align:middle; flex-shrink:0;">
  <defs>
    <linearGradient id="printLogoBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="50%" stop-color="#0b3b60"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="printLogoIT" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0284c7"/>
    </linearGradient>
    <linearGradient id="printLogoSolar" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
    <linearGradient id="printLogoText" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#34d399"/>
    </linearGradient>
  </defs>
  <!-- Rounded Emblem Shield Tile -->
  <rect x="4" y="4" width="92" height="92" rx="20" fill="#0f172a" stroke="url(#printLogoBorder)" stroke-width="4"/>
  <!-- Planet Orbit / Technology Rings -->
  <ellipse cx="50" cy="50" rx="38" ry="18" stroke="url(#printLogoIT)" stroke-width="2.5" stroke-dasharray="6 3" transform="rotate(-25 50 50)"/>
  <ellipse cx="50" cy="50" rx="38" ry="18" stroke="url(#printLogoSolar)" stroke-width="2.5" stroke-dasharray="6 3" transform="rotate(25 50 50)"/>
  <!-- Solar Ray Nodes -->
  <circle cx="50" cy="12" r="3.2" fill="#38bdf8"/>
  <circle cx="50" cy="88" r="3.2" fill="#34d399"/>
  <circle cx="12" cy="50" r="3.2" fill="#34d399"/>
  <circle cx="88" cy="50" r="3.2" fill="#38bdf8"/>
  <!-- Central CP Monogram Badge -->
  <circle cx="50" cy="50" r="21" fill="#0b3b60" stroke="#38bdf8" stroke-width="2"/>
  <text x="50" y="58" text-anchor="middle" font-family="'Segoe UI', Arial, sans-serif" font-weight="900" font-size="20" fill="url(#printLogoText)" letter-spacing="-0.5">CP</text>
</svg>`;

export function getCompanyPrintHeaderHtml({
  documentTitle = "",
  rightBadgeText = "",
  rightBadgeSubtext = "",
  showBorder = true
} = {}) {
  return `
    <div style="display: flex; justify-content: space-between; align-items: center; ${showBorder ? 'border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 15px;' : ''}">
      <div style="display: flex; align-items: center; gap: 14px;">
        ${COMPANY_LOGO_SVG}
        <div>
          <div style="font-size: 21px; font-weight: 900; color: #0b3b60; letter-spacing: -0.5px; line-height: 1.15; margin: 0;">
            M/S COMPUTER PLANET
          </div>
          <div style="font-size: 11px; font-weight: 700; color: #059669; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px;">
            IT Solutions, Banking AMC & Renewable Energy
          </div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">
            West Kachudharam, Chincoorie, Silchar, Cachar, Assam - 788007 | Tel: +91-8638083712
          </div>
          <div style="font-size: 10.5px; font-weight: bold; color: #0f172a; margin-top: 2px;">
            MSME Reg: UDYAM-AS-05-0019941 | GSTIN: 18ASTPR6755J1Z0
          </div>
        </div>
      </div>
      ${(rightBadgeText || rightBadgeSubtext) ? `
        <div style="text-align: right; shrink-0;">
          ${rightBadgeSubtext ? `<div style="font-size: 10px; color: #64748b; font-weight: 600; text-transform: uppercase;">${rightBadgeSubtext}</div>` : ''}
          ${rightBadgeText ? `<div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-top: 3px;">${rightBadgeText}</div>` : ''}
        </div>
      ` : ''}
    </div>
    ${documentTitle ? `
      <div style="text-align: center; margin: 12px 0 10px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; background: #f1f5f9; padding: 5px; border-radius: 4px;">
        ${documentTitle}
      </div>
    ` : ''}
  `;
}
