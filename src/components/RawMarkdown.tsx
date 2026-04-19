// Minimal plain-text markdown renderer.
// Renders headings (h1/h2/h3/h4), paragraphs, lists, blockquotes, tables, and
// horizontal rules as semantic HTML — NO cards, boxes, borders, or highlights.
// Inline: **bold**, *italic*, `code`, and [text](url) links.

interface Props {
  source: string;
}

const renderInline = (text: string, keyBase: string): (string | JSX.Element)[] => {
  const nodes: (string | JSX.Element)[] = [];
  // Tokenize on **bold**, *italic*, `code`, [link](url)
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) nodes.push(text.slice(last, match.index));
    const tok = match[0];
    const k = `${keyBase}-${i++}`;
    if (tok.startsWith("**")) nodes.push(<strong key={k}>{tok.slice(2, -2)}</strong>);
    else if (tok.startsWith("`")) nodes.push(<code key={k}>{tok.slice(1, -1)}</code>);
    else if (tok.startsWith("[")) {
      const m = /\[([^\]]+)\]\(([^)]+)\)/.exec(tok)!;
      nodes.push(
        <a key={k} href={m[2]} className="underline">
          {m[1]}
        </a>
      );
    } else nodes.push(<em key={k}>{tok.slice(1, -1)}</em>);
    last = match.index + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
};

const RawMarkdown = ({ source }: Props) => {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const blocks: JSX.Element[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip blank
    if (/^\s*$/.test(line)) { i++; continue; }

    // Horizontal rule
    if (/^---+\s*$/.test(line)) { i++; continue; }

    // Headings
    const h = /^(#{1,6})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length;
      const txt = h[2].replace(/^H\d:\s*/i, "");
      const cls =
        level === 1 ? "text-3xl md:text-5xl font-bold mt-10 mb-6 font-heading" :
        level === 2 ? "text-2xl md:text-3xl font-bold mt-10 mb-4 font-heading" :
        level === 3 ? "text-xl md:text-2xl font-semibold mt-8 mb-3 font-heading" :
        "text-lg font-semibold mt-6 mb-2 font-heading";
      const Tag = (`h${Math.min(level, 6)}`) as keyof JSX.IntrinsicElements;
      blocks.push(<Tag key={key++} className={cls}>{renderInline(txt, `h${key}`)}</Tag>);
      i++;
      continue;
    }

    // Blockquote (collect contiguous)
    if (/^>\s?/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ""));
        i++;
      }
      blocks.push(
        <div key={key++} className="my-4 pl-4 border-l-2 border-border text-muted-foreground space-y-2">
          {buf.map((b, bi) => (
            <p key={bi}>{renderInline(b, `bq${key}-${bi}`)}</p>
          ))}
        </div>
      );
      continue;
    }

    // Unordered list
    if (/^\s*[-*+]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc pl-6 my-4 space-y-2">
          {items.map((it, ii) => (
            <li key={ii}>{renderInline(it, `li${key}-${ii}`)}</li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++} className="list-decimal pl-6 my-4 space-y-2">
          {items.map((it, ii) => (
            <li key={ii}>{renderInline(it, `ol${key}-${ii}`)}</li>
          ))}
        </ol>
      );
      continue;
    }

    // Table (pipe). Render as plain text rows separated by " — ".
    if (/^\s*\|.*\|\s*$/.test(line)) {
      const rows: string[][] = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        const cells = lines[i].trim().slice(1, -1).split("|").map(c => c.trim());
        rows.push(cells);
        i++;
      }
      // Drop separator row (---|---)
      const filtered = rows.filter(r => !r.every(c => /^:?-{2,}:?$/.test(c)));
      blocks.push(
        <div key={key++} className="my-4 space-y-2">
          {filtered.map((r, ri) => (
            <p key={ri}>{renderInline(r.join(" — "), `tr${key}-${ri}`)}</p>
          ))}
        </div>
      );
      continue;
    }

    // Code fence
    if (/^```/.test(line)) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
      if (i < lines.length) i++;
      blocks.push(
        <pre key={key++} className="my-4 p-4 bg-secondary/30 overflow-x-auto text-sm">
          <code>{buf.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Paragraph (collect until blank/structural)
    const buf: string[] = [];
    while (
      i < lines.length &&
      !/^\s*$/.test(lines[i]) &&
      !/^#{1,6}\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^\s*[-*+]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^\s*\|.*\|\s*$/.test(lines[i]) &&
      !/^```/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key++} className="my-4 leading-relaxed text-foreground">
        {renderInline(buf.join(" "), `p${key}`)}
      </p>
    );
  }

  return <>{blocks}</>;
};

export default RawMarkdown;
