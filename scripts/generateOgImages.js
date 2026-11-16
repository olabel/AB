import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const brandDir = path.resolve(__dirname, "../public/brand");

if (!fs.existsSync(brandDir)) {
  fs.mkdirSync(brandDir, { recursive: true });
}

function buildOgSvg({ eyebrow, headlineLines, subtitle, footerLabel, variantAccent }) {
  const line1 = headlineLines[0] || "";
  const line2 = headlineLines[1] || "";

  return `
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#14211A"/>
  <!-- Outer editorial frame -->
  <rect x="40" y="40" width="1120" height="550" fill="#1A2C22" stroke="#D6C298" stroke-opacity="0.32" stroke-width="1.5"/>
  <!-- Warm brass hairline accent -->
  <rect x="40" y="40" width="1120" height="6" fill="#D6C298"/>

  <!-- Top identifier -->
  <text x="92" y="114" fill="#D6C298" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="18" font-weight="600" letter-spacing="3.2">${eyebrow}</text>

  <!-- Serif editorial headline -->
  <text x="92" y="230" fill="#F7F3EB" font-family="Georgia, 'Times New Roman', serif" font-size="60" font-weight="400">${line1}</text>
  ${line2 ? `<text x="92" y="304" fill="#F7F3EB" font-family="Georgia, 'Times New Roman', serif" font-size="60" font-weight="400">${line2}</text>` : ""}

  <!-- Subtitle -->
  <text x="92" y="${line2 ? 384 : 330}" fill="#ECE6DA" fill-opacity="0.86" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="25" font-weight="400">${subtitle}</text>

  <!-- Hairline divider -->
  <line x1="92" y1="486" x2="1108" y2="486" stroke="#D6C298" stroke-opacity="0.3"/>

  <!-- Signature footer row -->
  <text x="92" y="538" fill="#F7F3EB" font-family="Georgia, 'Times New Roman', serif" font-size="28" font-weight="400">Ahmed Bello</text>
  <text x="278" y="538" fill="#D6C298" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="19" font-weight="500">${footerLabel}</text>

  <!-- Right subtle page-type mark -->
  <text x="1108" y="538" text-anchor="end" fill="#ECE6DA" fill-opacity="0.72" font-family="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="18" font-weight="500">${variantAccent}</text>
</svg>
  `.trim();
}

const templates = [
  {
    filename: "og-home.png",
    eyebrow: "DIEPPE, NEW BRUNSWICK  |  ACROSS CANADA",
    headlineLines: [
      "Financial Planning &amp;",
      "Registered Account Strategy",
    ],
    subtitle: "Families, business owners, healthcare professionals &amp; newcomers.",
    footerLabel: "Financial Planning &amp; Protection",
    variantAccent: "ahmedbello.com",
  },
  {
    filename: "og-article.png",
    eyebrow: "CANADIAN FINANCIAL EDUCATION GUIDE",
    headlineLines: [
      "Plain-Language Canadian",
      "Tax &amp; Money Reference",
    ],
    subtitle: "Verified against CRA, Finance Canada &amp; statutory rules.",
    footerLabel: "Educational Reference",
    variantAccent: "ahmedbello.com/education",
  },
  {
    filename: "og-calculator.png",
    eyebrow: "INTERACTIVE CANADIAN TAX &amp; PLANNING TOOL",
    headlineLines: [
      "Canadian Financial",
      "Planning Estimators",
    ],
    subtitle: "TFSA, RRSP, FHSA, RESP grants &amp; Alternative Minimum Tax (AMT).",
    footerLabel: "Published CRA Figures",
    variantAccent: "ahmedbello.com/calculators",
  },
];

async function run() {
  for (const tpl of templates) {
    const svg = buildOgSvg(tpl);
    const outPath = path.join(brandDir, tpl.filename);
    await sharp(Buffer.from(svg)).png({ quality: 92 }).toFile(outPath);
  }
  console.log(`[OG Generator] Created ${templates.length} branded 1200x630 OG images in public/brand/.`);
}

run().catch((err) => {
  console.error("[OG Generator Error]", err);
  process.exit(1);
});
