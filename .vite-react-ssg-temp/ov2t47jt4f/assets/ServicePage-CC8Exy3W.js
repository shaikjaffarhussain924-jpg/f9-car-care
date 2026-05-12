import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Link, useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { c as cn, s as servicePages, N as Navbar, F as Footer, a as FloatingCTA } from "../main.mjs";
import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowLeft, VolumeX, Volume2, Phone, CheckCircle } from "lucide-react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import "vite-react-ssg";
import "@radix-ui/react-toast";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "next-themes";
import "sonner";
import "@radix-ui/react-tooltip";
import "@tanstack/react-query";
import "embla-carousel-react";
import "@radix-ui/react-slot";
const Accordion = AccordionPrimitive.Root;
const AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, { ref, className: cn("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, { className: "flex", children: /* @__PURE__ */ jsxs(
  AccordionPrimitive.Trigger,
  {
    ref,
    className: cn(
      "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
const AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(
  AccordionPrimitive.Content,
  {
    ref,
    className: "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsx("div", { className: cn("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
const renderInline = (text, keyBase) => {
  const nodes = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const tok = match[0];
    const k = `${keyBase}-${i++}`;
    if (tok.startsWith("**")) nodes.push(/* @__PURE__ */ jsx("strong", { children: tok.slice(2, -2) }, k));
    else if (tok.startsWith("`")) nodes.push(/* @__PURE__ */ jsx("code", { children: tok.slice(1, -1) }, k));
    else if (tok.startsWith("[")) {
      const m = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok);
      nodes.push(
        /* @__PURE__ */ jsx("a", { href: m[2], className: "underline", children: m[1] }, k)
      );
    } else nodes.push(/* @__PURE__ */ jsx("em", { children: tok.slice(1, -1) }, k));
    last = match.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};
const RawMarkdown = ({ source }) => {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks = [];
  let i = 0;
  let key = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }
    if (/^---+\s*$/.test(line)) {
      i++;
      continue;
    }
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const txt = h[2].replace(/^H\d:\s*/i, "");
      const cls = level === 1 ? "text-3xl md:text-5xl font-bold mt-10 mb-6 font-heading" : level === 2 ? "text-2xl md:text-3xl font-bold mt-10 mb-4 font-heading" : level === 3 ? "text-xl md:text-2xl font-semibold mt-8 mb-3 font-heading" : "text-lg font-semibold mt-6 mb-2 font-heading";
      const Tag = `h${Math.min(level, 6)}`;
      blocks.push(/* @__PURE__ */ jsx(Tag, { className: cls, children: renderInline(txt, `h${key}`) }, key++));
      i++;
      continue;
    }
    if (/^>\s?/.test(line)) {
      const buf2 = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf2.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        /* @__PURE__ */ jsx("div", { className: "my-4 pl-4 border-l-2 border-border text-muted-foreground space-y-2", children: buf2.map((b, bi) => /* @__PURE__ */ jsx("p", { children: renderInline(b, `bq${key}-${bi}`) }, bi)) }, key++)
      );
      continue;
    }
    if (/^\s*[-*+]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
        i++;
      }
      blocks.push(
        /* @__PURE__ */ jsx("ul", { className: "list-disc pl-6 my-4 space-y-2", children: items.map((it, ii) => /* @__PURE__ */ jsx("li", { children: renderInline(it, `li${key}-${ii}`) }, ii)) }, key++)
      );
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        /* @__PURE__ */ jsx("ol", { className: "list-decimal pl-6 my-4 space-y-2", children: items.map((it, ii) => /* @__PURE__ */ jsx("li", { children: renderInline(it, `ol${key}-${ii}`) }, ii)) }, key++)
      );
      continue;
    }
    if (/^\s*\|.*\|\s*$/.test(line)) {
      const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        const cells = lines[i].trim().slice(1, -1).split("|").map((c) => c.trim());
        rows.push(cells);
        i++;
      }
      const filtered = rows.filter((r) => !r.every((c) => /^:?-{2,}:?$/.test(c)));
      blocks.push(
        /* @__PURE__ */ jsx("div", { className: "my-4 space-y-2", children: filtered.map((r, ri) => /* @__PURE__ */ jsx("p", { children: renderInline(r.join(" — "), `tr${key}-${ri}`) }, ri)) }, key++)
      );
      continue;
    }
    if (/^```/.test(line)) {
      const buf2 = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        buf2.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++;
      blocks.push(
        /* @__PURE__ */ jsx("pre", { className: "my-4 p-4 bg-secondary/30 overflow-x-auto text-sm", children: /* @__PURE__ */ jsx("code", { children: buf2.join("\n") }) }, key++)
      );
      continue;
    }
    const buf = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^#{1,6}\s+/.test(lines[i]) && !/^>\s?/.test(lines[i]) && !/^\s*[-*+]\s+/.test(lines[i]) && !/^\s*\d+\.\s+/.test(lines[i]) && !/^\s*\|.*\|\s*$/.test(lines[i]) && !/^```/.test(lines[i]) && !/^---+\s*$/.test(lines[i])) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push(
      /* @__PURE__ */ jsx("p", { className: "my-4 leading-relaxed text-foreground", children: renderInline(buf.join(" "), `p${key}`) }, key++)
    );
  }
  return /* @__PURE__ */ jsx(Fragment, { children: blocks });
};
const ServiceDetailPage = ({ data }) => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  useEffect(() => {
    document.title = data.titleTag;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", data.metaDescription);
    window.scrollTo(0, 0);
  }, [data]);
  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  };
  if (data.rawContent) {
    return /* @__PURE__ */ jsxs("div", { className: "pt-20", children: [
      /* @__PURE__ */ jsx("section", { className: "section-padding bg-background", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsxs(
          Link,
          {
            to: "/",
            className: "inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-10",
            children: [
              /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
              "Back to Home"
            ]
          }
        ),
        (() => {
          const splitMarker = "premium-grade film.";
          const idx = data.rawContent.indexOf(splitMarker);
          const hasSplit = data.videoSrc && idx !== -1;
          const before = hasSplit ? data.rawContent.slice(0, idx + splitMarker.length) : data.rawContent;
          const after = hasSplit ? data.rawContent.slice(idx + splitMarker.length) : "";
          const VideoBlock = data.videoSrc ? /* @__PURE__ */ jsx("div", { className: "my-10 flex justify-center", children: /* @__PURE__ */ jsxs(
            "div",
            {
              className: "relative w-full bg-black overflow-hidden border border-border rounded-lg",
              style: { maxWidth: "340px", aspectRatio: "9 / 16" },
              children: [
                /* @__PURE__ */ jsx(
                  "video",
                  {
                    ref: videoRef,
                    src: data.videoSrc,
                    autoPlay: true,
                    loop: true,
                    muted,
                    playsInline: true,
                    preload: "auto",
                    className: "w-full h-full object-contain bg-black"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: toggleMute,
                    "aria-label": muted ? "Unmute video" : "Mute video",
                    className: "absolute bottom-3 right-3 bg-background/80 hover:bg-background text-foreground p-2 rounded-full transition-colors",
                    children: muted ? /* @__PURE__ */ jsx(VolumeX, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Volume2, { className: "w-4 h-4" })
                  }
                )
              ]
            }
          ) }) : null;
          return /* @__PURE__ */ jsxs(Fragment, { children: [
            !hasSplit && VideoBlock,
            /* @__PURE__ */ jsx(RawMarkdown, { source: before }),
            hasSplit && VideoBlock,
            after && /* @__PURE__ */ jsx(RawMarkdown, { source: after })
          ] });
        })()
      ] }) }),
      /* @__PURE__ */ jsx("section", { className: "bg-primary py-16 md:py-20 px-6 md:px-12", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [
        /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl md:text-4xl font-bold text-primary-foreground mb-4", children: data.ctaHeading }),
        /* @__PURE__ */ jsx("p", { className: "text-primary-foreground/80 text-lg mb-8", children: data.ctaSubtext }),
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
          /* @__PURE__ */ jsxs(
            Link,
            {
              to: data.ctaButton1Link,
              className: "text-xs tracking-[0.15em] uppercase bg-primary-foreground text-primary px-8 py-4 hover:bg-primary-foreground/90 transition-all font-medium inline-flex items-center gap-2",
              children: [
                data.ctaButton1,
                " →"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "a",
            {
              href: "tel:+917032674047",
              className: "text-xs tracking-[0.15em] uppercase border border-primary-foreground/50 text-primary-foreground px-8 py-4 hover:bg-primary-foreground/10 transition-all font-medium inline-flex items-center gap-2",
              children: [
                /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
                data.ctaButton2
              ]
            }
          )
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs("div", { className: "pt-20", children: [
    /* @__PURE__ */ jsx("section", { className: "section-padding bg-background", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 }, children: [
      /* @__PURE__ */ jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase text-muted-foreground hover:text-foreground transition-colors mb-10",
          children: [
            /* @__PURE__ */ jsx(ArrowLeft, { className: "w-4 h-4" }),
            "Back to Home"
          ]
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "luxury-divider mb-6 !mx-0" }),
      /* @__PURE__ */ jsx("h1", { className: "font-heading text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight", children: data.h1 }),
      /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-lg max-w-2xl mb-8", children: data.subheading }),
      /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: data.tags.map((tag) => /* @__PURE__ */ jsx(
        "span",
        {
          className: "text-xs tracking-[0.1em] uppercase px-4 py-2 border border-border bg-secondary text-foreground",
          children: tag
        },
        tag
      )) })
    ] }) }) }),
    /* @__PURE__ */ jsx("section", { className: "section-padding bg-secondary/30", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl md:text-3xl font-bold text-foreground mb-6", children: data.aboutTitle }),
          /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed text-base md:text-lg", children: data.aboutBody })
        ]
      }
    ) }) }),
    data.videoSrc && /* @__PURE__ */ jsx("section", { className: "bg-background pb-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto px-6 flex justify-center", children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "relative w-full bg-black overflow-hidden border border-border rounded-lg",
        style: { maxWidth: "340px", aspectRatio: "9 / 16" },
        children: [
          /* @__PURE__ */ jsx(
            "video",
            {
              ref: videoRef,
              src: data.videoSrc,
              autoPlay: true,
              loop: true,
              muted,
              playsInline: true,
              preload: "auto",
              className: "w-full h-full object-contain bg-black"
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: toggleMute,
              "aria-label": muted ? "Unmute video" : "Mute video",
              className: "absolute bottom-3 right-3 bg-background/80 hover:bg-background text-foreground p-2 rounded-full transition-colors",
              children: muted ? /* @__PURE__ */ jsx(VolumeX, { className: "w-4 h-4" }) : /* @__PURE__ */ jsx(Volume2, { className: "w-4 h-4" })
            }
          )
        ]
      }
    ) }) }),
    data.imageSrc && !data.videoSrc && /* @__PURE__ */ jsx("section", { className: "bg-background pb-8", children: /* @__PURE__ */ jsx("div", { className: "max-w-3xl mx-auto px-6 flex justify-center", children: /* @__PURE__ */ jsx(
      "div",
      {
        className: "relative w-full bg-black overflow-hidden border border-border rounded-lg",
        style: { maxWidth: "340px", aspectRatio: "9 / 16" },
        children: /* @__PURE__ */ jsx(
          "img",
          {
            src: data.imageSrc,
            alt: data.h1,
            loading: "lazy",
            className: "w-full h-full object-cover"
          }
        )
      }
    ) }) }),
    data.benefits.length > 0 && /* @__PURE__ */ jsx("section", { className: "section-padding bg-background", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        motion.h2,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "font-heading text-2xl md:text-3xl font-bold text-foreground mb-10 text-center",
          children: data.benefitsTitle
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: data.benefits.map((b, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: i * 0.08 },
          className: "metallic-card p-6",
          children: [
            /* @__PURE__ */ jsx("div", { className: "w-10 h-10 flex items-center justify-center border border-border bg-background/50 mb-4", children: /* @__PURE__ */ jsx(b.icon, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsx("h3", { className: "font-heading text-base font-semibold text-foreground mb-2", children: b.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: b.description })
          ]
        },
        b.title
      )) })
    ] }) }),
    data.checklist && data.checklist.length > 0 && /* @__PURE__ */ jsx("section", { className: "section-padding bg-background", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        motion.h2,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "font-heading text-2xl md:text-3xl font-bold text-foreground mb-10 text-center",
          children: data.checklistTitle
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: data.checklist.map((item, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -10 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          transition: { delay: i * 0.05 },
          className: "flex items-start gap-3 p-4 border border-border bg-secondary/30",
          children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-5 h-5 text-primary shrink-0 mt-0.5" }),
            /* @__PURE__ */ jsx("span", { className: "text-foreground text-sm", children: item.text })
          ]
        },
        i
      )) })
    ] }) }),
    data.materials && data.materials.length > 0 && /* @__PURE__ */ jsx("section", { className: "section-padding bg-background", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        motion.h2,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "font-heading text-2xl md:text-3xl font-bold text-foreground mb-10 text-center",
          children: data.materialsTitle
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: data.materials.map((m, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: i * 0.1 },
          className: "metallic-card p-6",
          children: [
            /* @__PURE__ */ jsx("h3", { className: "font-heading text-base font-semibold text-foreground mb-2", children: m.title }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: m.description })
          ]
        },
        m.title
      )) })
    ] }) }),
    data.process && data.process.length > 0 && /* @__PURE__ */ jsx("section", { className: "section-padding bg-secondary/30", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        motion.h2,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "font-heading text-2xl md:text-3xl font-bold text-foreground mb-10 text-center",
          children: data.processTitle
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "space-y-4", children: data.process.map((s, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, x: -20 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true },
          transition: { delay: i * 0.08 },
          className: "flex items-center gap-6 p-5 border border-border bg-background",
          children: [
            /* @__PURE__ */ jsx("span", { className: "font-heading text-2xl font-bold text-primary w-10 text-center shrink-0", children: s.step }),
            /* @__PURE__ */ jsx("span", { className: "text-foreground font-medium", children: s.title })
          ]
        },
        s.step
      )) })
    ] }) }),
    data.comparison && /* @__PURE__ */ jsx("section", { className: "section-padding bg-secondary/30", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        motion.h2,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "font-heading text-2xl md:text-3xl font-bold text-foreground mb-10 text-center",
          children: data.comparisonTitle
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "border border-border overflow-hidden", children: [
        /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 bg-secondary", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 text-xs tracking-[0.1em] uppercase font-semibold text-muted-foreground", children: "Feature" }),
          /* @__PURE__ */ jsx("div", { className: "p-4 text-xs tracking-[0.1em] uppercase font-semibold text-foreground border-l border-border", children: data.comparison.headers[0] }),
          /* @__PURE__ */ jsx("div", { className: "p-4 text-xs tracking-[0.1em] uppercase font-semibold text-primary border-l border-border", children: data.comparison.headers[1] })
        ] }),
        data.comparison.rows.map((row, i) => /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 border-t border-border", children: [
          /* @__PURE__ */ jsx("div", { className: "p-4 text-sm text-muted-foreground", children: row.feature }),
          /* @__PURE__ */ jsx("div", { className: "p-4 text-sm text-foreground border-l border-border", children: row.col1 }),
          /* @__PURE__ */ jsx("div", { className: "p-4 text-sm text-foreground border-l border-border", children: row.col2 })
        ] }, i))
      ] })
    ] }) }),
    data.richContent && data.richContent.length > 0 && data.richContent.map((section, idx) => /* @__PURE__ */ jsx("section", { className: `section-padding ${idx % 2 === 0 ? "bg-secondary/30" : "bg-background"}`, children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6 },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl md:text-3xl font-bold text-foreground mb-6", children: section.title }),
          section.paragraphs.map((p, pi) => /* @__PURE__ */ jsx("p", { className: "text-muted-foreground leading-relaxed text-base md:text-lg mb-4 last:mb-0", children: p }, pi)),
          section.listItems && section.listItems.length > 0 && /* @__PURE__ */ jsx("ul", { className: "mt-4 space-y-2", children: section.listItems.map((item, li) => /* @__PURE__ */ jsxs("li", { className: "flex items-center gap-3 text-foreground text-sm", children: [
            /* @__PURE__ */ jsx(CheckCircle, { className: "w-4 h-4 text-primary shrink-0" }),
            item
          ] }, li)) })
        ]
      }
    ) }) }, idx)),
    /* @__PURE__ */ jsx("section", { className: "section-padding bg-background", children: /* @__PURE__ */ jsxs("div", { className: "max-w-5xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        motion.h2,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "font-heading text-2xl md:text-3xl font-bold text-foreground mb-10 text-center",
          children: data.pricingTitle
        }
      ),
      /* @__PURE__ */ jsx("div", { className: `grid grid-cols-1 md:grid-cols-${data.pricing.length > 3 ? "2 lg:grid-cols-4" : data.pricing.length} gap-6`, children: data.pricing.map((p, i) => /* @__PURE__ */ jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { delay: i * 0.1 },
          className: `metallic-card p-8 text-center relative ${p.popular ? "border-primary/50" : ""}`,
          children: [
            p.popular && /* @__PURE__ */ jsx("span", { className: "absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.15em] uppercase bg-primary text-primary-foreground px-4 py-1 font-medium", children: "Most Popular" }),
            /* @__PURE__ */ jsx("h3", { className: "font-heading text-lg font-semibold text-foreground mb-3", children: p.title }),
            /* @__PURE__ */ jsx("p", { className: "font-heading text-3xl font-bold text-primary mb-3", children: p.price }),
            /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm", children: p.description })
          ]
        },
        p.title
      )) }),
      data.pricingNote && /* @__PURE__ */ jsx("p", { className: "text-muted-foreground text-sm text-center mt-6", children: data.pricingNote })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "section-padding bg-secondary/30", children: /* @__PURE__ */ jsxs("div", { className: "max-w-3xl mx-auto", children: [
      /* @__PURE__ */ jsx(
        motion.h2,
        {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          className: "font-heading text-2xl md:text-3xl font-bold text-foreground mb-10 text-center",
          children: data.faqTitle
        }
      ),
      /* @__PURE__ */ jsx(Accordion, { type: "single", collapsible: true, className: "space-y-3", children: data.faqs.map((faq, i) => /* @__PURE__ */ jsxs(
        AccordionItem,
        {
          value: `faq-${i}`,
          className: "border border-border bg-background px-6",
          children: [
            /* @__PURE__ */ jsx(AccordionTrigger, { className: "text-foreground text-sm md:text-base font-medium text-left hover:no-underline", children: faq.question }),
            /* @__PURE__ */ jsx(AccordionContent, { className: "text-muted-foreground text-sm leading-relaxed", children: faq.answer })
          ]
        },
        i
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "bg-primary py-16 md:py-20 px-6 md:px-12", children: /* @__PURE__ */ jsx("div", { className: "max-w-4xl mx-auto text-center", children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        children: [
          /* @__PURE__ */ jsx("h2", { className: "font-heading text-2xl md:text-4xl font-bold text-primary-foreground mb-4", children: data.ctaHeading }),
          /* @__PURE__ */ jsx("p", { className: "text-primary-foreground/80 text-lg mb-8", children: data.ctaSubtext }),
          /* @__PURE__ */ jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-4", children: [
            /* @__PURE__ */ jsxs(
              Link,
              {
                to: data.ctaButton1Link,
                className: "text-xs tracking-[0.15em] uppercase bg-primary-foreground text-primary px-8 py-4 hover:bg-primary-foreground/90 transition-all font-medium inline-flex items-center gap-2",
                children: [
                  data.ctaButton1,
                  " →"
                ]
              }
            ),
            /* @__PURE__ */ jsxs(
              "a",
              {
                href: "tel:+917032674047",
                className: "text-xs tracking-[0.15em] uppercase border border-primary-foreground/50 text-primary-foreground px-8 py-4 hover:bg-primary-foreground/10 transition-all font-medium inline-flex items-center gap-2",
                children: [
                  /* @__PURE__ */ jsx(Phone, { className: "w-4 h-4" }),
                  data.ctaButton2
                ]
              }
            )
          ] })
        ]
      }
    ) }) })
  ] });
};
const ServicePage = () => {
  const { slug } = useParams();
  const data = servicePages.find((s) => s.slug === slug);
  if (!data) return /* @__PURE__ */ jsx(Navigate, { to: "/", replace: true });
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(Helmet, { children: [
      /* @__PURE__ */ jsx("title", { children: data.titleTag }),
      /* @__PURE__ */ jsx("meta", { name: "description", content: data.metaDescription }),
      /* @__PURE__ */ jsx("link", { rel: "canonical", href: `https://www.f9carcare.co.in/services/${data.slug}` }),
      /* @__PURE__ */ jsx("meta", { property: "og:title", content: data.titleTag }),
      /* @__PURE__ */ jsx("meta", { property: "og:description", content: data.metaDescription }),
      /* @__PURE__ */ jsx("meta", { property: "og:url", content: `https://www.f9carcare.co.in/services/${data.slug}` }),
      /* @__PURE__ */ jsx("meta", { property: "og:type", content: "website" })
    ] }),
    /* @__PURE__ */ jsx(Navbar, {}),
    /* @__PURE__ */ jsx(ServiceDetailPage, { data }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(FloatingCTA, {})
  ] });
};
export {
  ServicePage as default
};
