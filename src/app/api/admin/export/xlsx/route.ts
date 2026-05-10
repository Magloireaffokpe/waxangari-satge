import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { rows } = await req.json();

  const formatDate = (d: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("fr-FR");
  };

  const headers = [
    "ID",
    "Nom",
    "Prénom",
    "Email",
    "Téléphone",
    "École / Université",
    "Filière",
    "Niveau d'étude",
    "Type de stage",
    "Date début",
    "Date fin",
    "Durée (mois)",
    "Lieu de provenance",
    "Sexe",
    "Statut",
    "Date inscription",
    "CV",
  ];

  const dataRows = rows.map((r: any) => [
    r.id,
    r.nom,
    r.prenom,
    r.email,
    r.telephone || "",
    r.ecoleUniversite,
    r.filiere,
    r.niveauEtude || "",
    r.typeStage === "ACADEMIQUE" ? "Académique" : "Professionnel",
    formatDate(r.dateDebut),
    formatDate(r.dateFin),
    r.dureeMois,
    r.lieuProvenance,
    r.sexe,
    r.statutAvancement === "EN_COURS" ? "En cours" : "Terminé",
    formatDate(r.dateInscription),
    r.cvUrl || "",
  ]);

  const xlsx = buildXlsx(headers, dataRows);

  // Blob est le seul type accepté par NextResponse dans Next.js 14 App Router
  const blob = new Blob([xlsx.buffer as ArrayBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  return new NextResponse(blob, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="stagiaires_${new Date().toISOString().split("T")[0]}.xlsx"`,
    },
  });
}

// ── Builder XLSX (OpenXML + ZIP) — retourne Uint8Array ─────────────────────

function buildXlsx(headers: string[], rows: any[][]): Uint8Array {
  const escXml = (v: any) =>
    String(v ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  // Shared strings registry
  const strings: string[] = [];
  const si = (s: string): number => {
    const e = escXml(s);
    let i = strings.indexOf(e);
    if (i < 0) {
      strings.push(e);
      i = strings.length - 1;
    }
    return i;
  };

  const colLetter = (n: number): string => {
    let s = "";
    n++;
    while (n > 0) {
      s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
      n = Math.floor((n - 1) / 26);
    }
    return s;
  };

  const allRows = [headers, ...rows];
  const sheetRows = allRows
    .map(
      (row, ri) =>
        `<row r="${ri + 1}">${row
          .map((cell, ci) => {
            const ref = `${colLetter(ci)}${ri + 1}`;
            if (typeof cell === "number")
              return `<c r="${ref}" t="n"><v>${cell}</v></c>`;
            const style = ri === 0 ? ` s="1"` : "";
            return `<c r="${ref}" t="s"${style}><v>${si(String(cell ?? ""))}</v></c>`;
          })
          .join("")}</row>`,
    )
    .join("");

  const colDefs = headers
    .map(
      (_, i) =>
        `<col min="${i + 1}" max="${i + 1}" width="24" customWidth="1"/>`,
    )
    .join("");

  const files: Record<string, string> = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`,

    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`,

    "xl/workbook.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Stagiaires" sheetId="1" r:id="rId1"/></sheets>
</workbook>`,

    "xl/_rels/workbook.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/>
<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`,

    "xl/worksheets/sheet1.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetFormatPr defaultRowHeight="15"/>
<cols>${colDefs}</cols>
<sheetData>${sheetRows}</sheetData>
</worksheet>`,

    "xl/sharedStrings.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="${strings.length}" uniqueCount="${strings.length}">
${strings.map((s) => `<si><t xml:space="preserve">${s}</t></si>`).join("")}
</sst>`,

    "xl/styles.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2">
  <font><sz val="11"/><name val="Calibri"/></font>
  <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
</fonts>
<fills count="3">
  <fill><patternFill patternType="none"/></fill>
  <fill><patternFill patternType="gray125"/></fill>
  <fill><patternFill patternType="solid"><fgColor rgb="FF4CAF18"/></patternFill></fill>
</fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="2">
  <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
  <xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
</cellXfs>
</styleSheet>`,
  };

  return buildZip(files);
}

// ── ZIP minimal — retourne Uint8Array (pas Buffer) ─────────────────────────

function buildZip(files: Record<string, string>): Uint8Array {
  const enc = new TextEncoder();

  // Table CRC32
  const CRC_TABLE = (() => {
    const t = new Uint32Array(256);
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      t[i] = c;
    }
    return t;
  })();

  const crc32 = (data: Uint8Array): number => {
    let crc = 0xffffffff;
    for (const b of data) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ b) & 0xff];
    return (crc ^ 0xffffffff) >>> 0;
  };

  // Helpers pour écrire en little-endian dans un Uint8Array
  const u16 = (n: number): Uint8Array => {
    const b = new Uint8Array(2);
    b[0] = n & 0xff;
    b[1] = (n >> 8) & 0xff;
    return b;
  };
  const u32 = (n: number): Uint8Array => {
    const v = n >>> 0;
    const b = new Uint8Array(4);
    b[0] = v & 0xff;
    b[1] = (v >> 8) & 0xff;
    b[2] = (v >> 16) & 0xff;
    b[3] = (v >> 24) & 0xff;
    return b;
  };

  const concat = (...parts: Uint8Array[]): Uint8Array => {
    const total = parts.reduce((s, p) => s + p.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const p of parts) {
      out.set(p, off);
      off += p.length;
    }
    return out;
  };

  const sig = (a: number, b: number, c: number, d: number) =>
    new Uint8Array([a, b, c, d]);

  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const data = enc.encode(content);
    const nameBytes = enc.encode(name);
    const crc = crc32(data);
    const size = data.length;

    const local = concat(
      sig(0x50, 0x4b, 0x03, 0x04),
      u16(20),
      u16(0),
      u16(0), // version needed, flags, compression (store=0)
      u16(0),
      u16(0), // mod time, mod date
      u32(crc),
      u32(size),
      u32(size), // compressed = uncompressed (store)
      u16(nameBytes.length),
      u16(0),
      nameBytes,
    );

    const central = concat(
      sig(0x50, 0x4b, 0x01, 0x02),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(size),
      u32(size),
      u16(nameBytes.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      nameBytes,
    );

    localParts.push(local, data);
    centralParts.push(central);
    offset += local.length + size;
  }

  const centralBuf = concat(...centralParts);
  const eocd = concat(
    sig(0x50, 0x4b, 0x05, 0x06),
    u16(0),
    u16(0),
    u16(centralParts.length),
    u16(centralParts.length),
    u32(centralBuf.length),
    u32(offset),
    u16(0),
  );

  return concat(...localParts, centralBuf, eocd);
}
