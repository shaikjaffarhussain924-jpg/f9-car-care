// Post-build prerender: generates static HTML files for every public route in dist/.
// Crawlers (Google, GPTBot, ClaudeBot, PerplexityBot, etc.) read real content from these files.
// On the client, React hydrates and replaces #root content for normal SPA behavior.

import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { servicePages, type ServicePageData } from "../src/data/servicePages";

const BASE_URL = "https://www.f9carcare.co.in";
const DIST = resolve("dist");

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
  bodyHtml: string;
  jsonLd?: object;
}

function renderHead(meta: PageMeta): string {
  const og = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(meta.canonical)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
  ].join("\n    ");
  const ld = meta.jsonLd
    ? `\n    <script type="application/ld+json">${JSON.stringify(meta.jsonLd)}</script>`
    : "";
  return `
    <title>${esc(meta.title)}</title>
    <meta name="description" content="${esc(meta.description)}" />
    <link rel="canonical" href="${esc(meta.canonical)}" />
    ${og}${ld}`;
}

function applyToTemplate(template: string, meta: PageMeta): string {
  let html = template;
  // Strip existing title + description + canonical + og/twitter tags from index.html
  html = html.replace(/<title>[\s\S]*?<\/title>/i, "");
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/gi, "");
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, "");
  html = html.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, "");
  html = html.replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, "");

  // Inject route-specific tags before </head>
  html = html.replace(/<\/head>/i, `${renderHead(meta)}\n  </head>`);

  // Replace empty root with prerendered content visually hidden (still crawlable),
  // plus a brief loading splash so users don't see raw text before React mounts.
  const wrapped = `<div id="prerender-seo" aria-hidden="true" style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;">${meta.bodyHtml}</div><div id="prerender-splash" style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#000;color:#facc15;font-family:system-ui,sans-serif;font-size:14px;letter-spacing:0.2em;text-transform:uppercase;z-index:9999;">Loading…</div>`;
  html = html.replace(
    /<div id="root">\s*<\/div>/,
    `<div id="root">${wrapped}</div>`,
  );

  return html;
}

function paragraphsHtml(paragraphs: string[]): string {
  return paragraphs
    .map((p) => `<p>${esc(p).replace(/\n/g, "<br />")}</p>`)
    .join("\n");
}

function renderServiceBody(s: ServicePageData): string {
  const parts: string[] = [];
  parts.push(`<header><h1>${esc(s.h1)}</h1>`);
  if (s.subheading) parts.push(`<p>${esc(s.subheading)}</p>`);
  if (s.tags?.length)
    parts.push(
      `<ul>${s.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`,
    );
  parts.push(`</header>`);

  if (s.aboutTitle) parts.push(`<section><h2>${esc(s.aboutTitle)}</h2>`);
  if (s.aboutBody) parts.push(paragraphsHtml(s.aboutBody.split(/\n\n+/)));
  if (s.aboutTitle) parts.push(`</section>`);

  if (s.richContent?.length) {
    for (const r of s.richContent) {
      parts.push(`<section>`);
      if (r.title) parts.push(`<h2>${esc(r.title)}</h2>`);
      if (r.paragraphs?.length) parts.push(paragraphsHtml(r.paragraphs));
      if (r.listItems?.length)
        parts.push(
          `<ul>${r.listItems.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`,
        );
      parts.push(`</section>`);
    }
  }

  if (s.benefits?.length) {
    parts.push(`<section><h2>${esc(s.benefitsTitle || "Benefits")}</h2><ul>`);
    for (const b of s.benefits) {
      parts.push(
        `<li><strong>${esc(b.title)}:</strong> ${esc(b.description)}</li>`,
      );
    }
    parts.push(`</ul></section>`);
  }

  if (s.process?.length) {
    parts.push(
      `<section><h2>${esc(s.processTitle || "Process")}</h2><ol>${s.process
        .map((p) => `<li>${esc(p.title)}</li>`)
        .join("")}</ol></section>`,
    );
  }

  if (s.checklist?.length) {
    parts.push(
      `<section><h2>${esc(s.checklistTitle || "Includes")}</h2><ul>${s.checklist
        .map((c) => `<li>${esc(c.text)}</li>`)
        .join("")}</ul></section>`,
    );
  }

  if (s.materials?.length) {
    parts.push(`<section><h2>${esc(s.materialsTitle || "Materials")}</h2><ul>`);
    for (const m of s.materials) {
      parts.push(
        `<li><strong>${esc(m.title)}:</strong> ${esc(m.description)}</li>`,
      );
    }
    parts.push(`</ul></section>`);
  }

  if (s.pricing?.length) {
    parts.push(`<section><h2>${esc(s.pricingTitle)}</h2><ul>`);
    for (const p of s.pricing) {
      parts.push(
        `<li><strong>${esc(p.title)} — ${esc(p.price)}:</strong> ${esc(p.description)}</li>`,
      );
    }
    parts.push(`</ul>`);
    if (s.pricingNote) parts.push(`<p>${esc(s.pricingNote)}</p>`);
    parts.push(`</section>`);
  }

  if (s.faqs?.length) {
    parts.push(`<section><h2>${esc(s.faqTitle)}</h2><dl>`);
    for (const f of s.faqs) {
      parts.push(`<dt>${esc(f.question)}</dt><dd>${esc(f.answer)}</dd>`);
    }
    parts.push(`</dl></section>`);
  }

  parts.push(
    `<section><h2>${esc(s.ctaHeading)}</h2><p>${esc(s.ctaSubtext)}</p>` +
      `<p><a href="${esc(s.ctaButton1Link)}">${esc(s.ctaButton1)}</a> · ${esc(s.ctaButton2)}</p></section>`,
  );

  if (s.rawContent) {
    parts.push(
      `<section>${paragraphsHtml(s.rawContent.split(/\n\n+/))}</section>`,
    );
  }

  return parts.join("\n");
}

function serviceJsonLd(s: ServicePageData) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: s.h1,
    description: s.metaDescription,
    url: `${BASE_URL}/services/${s.slug}`,
    provider: {
      "@type": "AutoRepair",
      name: "F9 Car Care & Detailing Studio",
      telephone: "+91-7032674047",
      url: BASE_URL,
      address: {
        "@type": "PostalAddress",
        streetAddress: "Near Gopal Nagar Kamaan, Manjeera Pipeline Road",
        addressLocality: "Hyderabad",
        addressRegion: "Telangana",
        postalCode: "500085",
        addressCountry: "IN",
      },
    },
    areaServed: "Hyderabad",
  };
}

function writePage(routePath: string, html: string) {
  const out =
    routePath === "/"
      ? resolve(DIST, "index.html")
      : resolve(DIST, routePath.replace(/^\//, ""), "index.html");
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log(`prerendered ${routePath} → ${out.replace(DIST, "dist")}`);
}

function main() {
  const template = readFileSync(resolve(DIST, "index.html"), "utf-8");

  const home: PageMeta = {
    title: "F9 Car Care – Professional Detailing & Car Wash in Hyderabad",
    description:
      "F9 Car Care & Detailing Studio in Hafeezpet, Hyderabad. Ceramic coating, PPF, Teflon, nano coating, denting & painting, sun film and more. Call +91 7032674047.",
    canonical: `${BASE_URL}/`,
    bodyHtml: `
      <header>
        <h1>F9 Car Care &amp; Detailing Studio — Hyderabad</h1>
        <p>Premium car detailing, ceramic coating, PPF, Teflon coating, nano coating, denting &amp; painting, deep interior wash, sun film and more in Hafeezpet, Hyderabad.</p>
      </header>
      <nav><h2>Our Services</h2><ul>${servicePages
        .map(
          (s) =>
            `<li><a href="/services/${s.slug}">${esc(s.h1.split("|")[0].trim())}</a></li>`,
        )
        .join("")}</ul></nav>
      <section><h2>Contact</h2><p>Near Gopal Nagar Kamaan, Manjeera Pipeline Road, Hafeezpet, Hyderabad 500085. Phone: +91 7032674047.</p></section>`,
  };

  const book: PageMeta = {
    title:
      "Book Car Detailing | F9 Car Care, Hafeezpet, Hyderabad",
    description:
      "Book ceramic coating, PPF, Teflon, denting & painting or any detailing service at F9 Car Care, Hafeezpet, Hyderabad. Call or WhatsApp +91 7032674047.",
    canonical: `${BASE_URL}/book`,
    bodyHtml: `
      <header><h1>Book an Appointment</h1>
      <p>Book ceramic coating, PPF, Teflon coating, nano coating, deep interior wash, denting &amp; painting, restoration, sun film, seat covers, and general service at F9 Car Care, Hafeezpet, Hyderabad.</p>
      </header>
      <section><h2>How to reach us</h2><p>Call or WhatsApp +91 7032674047. We are at Near Gopal Nagar Kamaan, Manjeera Pipeline Road, Hafeezpet, Hyderabad 500085.</p></section>`,
  };

  const contact: PageMeta = {
    title: "Contact F9 Car Care | Hyderabad",
    description:
      "Contact F9 Car Care in Hafeezpet, Hyderabad. Call, WhatsApp, or send a message — we respond quickly.",
    canonical: `${BASE_URL}/contact`,
    bodyHtml: `
      <header><h1>Contact F9 Car Care</h1>
      <p>Get in touch with F9 Car Care &amp; Detailing Studio. We respond on WhatsApp, email or phone.</p></header>
      <section><h2>Address</h2><p>Near Gopal Nagar Kamaan, Beside Line F9 Pharmacy, Manjeera Pipeline Road, Gopal Nagar, Hafeezpet, Hyderabad 500085.</p></section>
      <section><h2>Phone &amp; WhatsApp</h2><p>+91 7032674047</p></section>`,
  };

  const privacy: PageMeta = {
    title: "Privacy Policy | F9 Car Care & Detailing Studio",
    description:
      "Privacy policy for F9 Car Care & Detailing Studio describing how we collect, use, and protect customer information.",
    canonical: `${BASE_URL}/privacy-policy`,
    bodyHtml: `
      <header><h1>Privacy Policy</h1>
      <p>F9 Car Care &amp; Detailing Studio respects your privacy. This policy explains how we collect, use, and protect your information when you use our website or services.</p></header>`,
  };

  writePage("/", applyToTemplate(template, home));
  writePage("/book", applyToTemplate(template, book));
  writePage("/contact", applyToTemplate(template, contact));
  writePage("/privacy-policy", applyToTemplate(template, privacy));

  for (const s of servicePages) {
    const meta: PageMeta = {
      title: s.titleTag,
      description: s.metaDescription,
      canonical: `${BASE_URL}/services/${s.slug}`,
      bodyHtml: renderServiceBody(s),
      jsonLd: serviceJsonLd(s),
    };
    writePage(`/services/${s.slug}`, applyToTemplate(template, meta));
  }

  console.log("Prerender complete.");
}

main();
