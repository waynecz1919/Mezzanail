import { readFile } from "node:fs/promises";
import { join } from "node:path";
import PDFDocument from "pdfkit/js/pdfkit.standalone";
import type { JobApplicationInput } from "@/lib/job/types";
import { jobApplicationFilename } from "@/lib/job/reference";

const A4 = { width: 595.28, height: 841.89 };
const MARGIN = 48;
const CONTENT_WIDTH = A4.width - MARGIN * 2;
const CREAM = "#FBF7EF";
const BURGUNDY = "#621829";
const NUDE_PINK = "#EED1CC";
const INK = "#292629";
const MUTED = "#665E5E";
const LINE = "#D2C2B8";
const FONT_NAME = "NotoSansSC";
const FONT_FILE = "NotoSansSC_400Regular.ttf";
const LOGO_FILE = "mezzanail-circle-logo.png";

let pdfAssetSources:
  | Promise<{ font: Uint8Array; logo: Uint8Array }>
  | undefined;

const skillLabels: Record<keyof JobApplicationInput["nailSkills"], string> = {
  manicure: "Manicure",
  pedicure: "Pedicure",
  gelColor: "Gel Color",
  nailArt: "Nail Art",
  nailExtension: "Nail Extension",
  nailRemoval: "Nail Removal",
};

export type GeneratedJobApplicationPdf = {
  bytes: Uint8Array;
  filename: string;
  submittedAtDisplay: string;
};

export function pdfGenerationFailureCode(error: unknown) {
  const code =
    error && typeof error === "object" && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
  if (code === "ENOENT") return "PDF_ASSET_MISSING";
  if (code === "PDF_ASSET_FETCH_FAILED") return "PDF_ASSET_FETCH_FAILED";
  if (code === "ENOMEM") return "PDF_MEMORY_EXHAUSTED";
  if (error instanceof RangeError) return "PDF_RANGE_ERROR";
  return "PDF_RENDER_FAILED";
}

function deploymentOrigin() {
  return "https://www.mezzanail.com";
}

async function readPdfAsset(filename: string) {
  try {
    return await readFile(join(process.cwd(), "public", "pdf-assets", filename));
  } catch (error) {
    if (
      !error ||
      typeof error !== "object" ||
      !("code" in error) ||
      String((error as { code: unknown }).code) !== "ENOENT"
    ) {
      throw error;
    }
  }

  const response = await fetch(`${deploymentOrigin()}/pdf-assets/${filename}`, {
    cache: "force-cache",
    redirect: "error",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw Object.assign(new Error("PDF runtime asset could not be loaded."), {
      code: "PDF_ASSET_FETCH_FAILED",
    });
  }
  return new Uint8Array(await response.arrayBuffer());
}

async function loadPdfAssets() {
  pdfAssetSources ??= Promise.all([readPdfAsset(FONT_FILE), readPdfAsset(LOGO_FILE)])
    .then(([font, logo]) => ({ font: new Uint8Array(font), logo: new Uint8Array(logo) }))
    .catch((error) => {
      pdfAssetSources = undefined;
      throw error;
    });
  const sources = await pdfAssetSources;
  return {
    font: Buffer.from(sources.font),
    logo: `data:image/png;base64,${Buffer.from(sources.logo).toString("base64")}`,
  };
}

function formatSubmittedAt(date: Date) {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    dateStyle: "long",
    timeStyle: "medium",
    hour12: true,
  }).format(date);
}

function pdfSafeText(value: string) {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\p{Extended_Pictographic}|\uFE0F/gu, "")
    .trim();
}

export async function generateJobApplicationPdf({
  application,
  applicationReference,
  submittedAt = new Date(),
}: {
  application: JobApplicationInput;
  applicationReference: string;
  submittedAt?: Date;
}): Promise<GeneratedJobApplicationPdf> {
  const { font: fontBytes, logo: logoBytes } = await loadPdfAssets();
  const submittedAtDisplay = formatSubmittedAt(submittedAt);
  const document = new PDFDocument({
    autoFirstPage: false,
    bufferPages: true,
    compress: true,
    info: {
      Title: `Mezzanail Job Application ${applicationReference}`,
      Author: "Mezzanail Nail Studio",
      Subject: "Job application",
      Keywords: `Mezzanail, job application, ${application.position}`,
      CreationDate: submittedAt,
    },
  });
  document.registerFont(FONT_NAME, fontBytes);
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const completed = new Promise<Buffer>((resolve, reject) => {
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);
  });
  let decorating = false;
  let currentY = MARGIN;

  function decoratePage() {
    if (decorating) return;
    decorating = true;
    document.save();
    document.rect(0, 0, A4.width, A4.height).fill(CREAM);
    document
      .rect(24, 24, A4.width - 48, A4.height - 48)
      .lineWidth(0.65)
      .strokeColor(LINE)
      .stroke();
    document.restore();
    decorating = false;
  }

  function addPage() {
    document.addPage({ size: "A4", margins: { top: MARGIN, right: MARGIN, bottom: 54, left: MARGIN } });
    currentY = MARGIN;
  }

  document.on("pageAdded", decoratePage);
  addPage();
  document.font(FONT_NAME);

  function ensureSpace(height: number) {
    if (currentY + height > A4.height - 58) addPage();
  }

  function wrapText(text: string, size: number, maxWidth: number) {
    document.font(FONT_NAME).fontSize(size);
    const lines: string[] = [];
    for (const paragraph of pdfSafeText(text).replace(/\r\n?/g, "\n").split("\n")) {
      if (!paragraph) {
        lines.push("");
        continue;
      }
      const tokens = paragraph.match(/\s+|[\p{Script=Han}]|[^\s\p{Script=Han}]+/gu) || [];
      let line = "";
      for (const token of tokens) {
        const candidate = line + token;
        if (line && document.widthOfString(candidate) > maxWidth) {
          lines.push(line.trimEnd());
          line = token.trimStart();
          if (document.widthOfString(line) <= maxWidth) continue;
        } else if (document.widthOfString(candidate) <= maxWidth) {
          line = candidate;
          continue;
        }
        for (const character of Array.from(line || token)) {
          const characterCandidate = line === token ? character : line + character;
          if (line && document.widthOfString(characterCandidate) > maxWidth) {
            lines.push(line.trimEnd());
            line = character.trimStart();
          } else {
            line = characterCandidate;
          }
        }
      }
      lines.push(line || " ");
    }
    return lines;
  }

  function drawText(
    text: string,
    options: {
      size?: number;
      color?: string;
      width?: number;
      lineGap?: number;
      indent?: number;
    } = {},
  ) {
    const size = options.size ?? 9.5;
    const lineGap = options.lineGap ?? 4;
    const width = options.width ?? CONTENT_WIDTH;
    const indent = options.indent ?? 0;
    const lineHeight = size * 1.25 + lineGap;
    const lines = wrapText(text || "—", size, width);
    for (const line of lines) {
      ensureSpace(lineHeight);
      const top = currentY;
      document
        .font(FONT_NAME)
        .fontSize(size)
        .fillColor(options.color ?? INK)
        .text(line || " ", MARGIN + indent, top, {
          width,
          lineBreak: false,
        });
      currentY = top + lineHeight;
    }
  }

  function section(title: string, chinese: string, minimumFollowingSpace = 70) {
    ensureSpace(50 + minimumFollowingSpace);
    currentY += 8;
    const top = currentY;
    document.save().rect(MARGIN, top, CONTENT_WIDTH, 27).fill(NUDE_PINK).restore();
    document
      .font(FONT_NAME)
      .fontSize(10.5)
      .fillColor(BURGUNDY)
      .text(`${title}  /  ${chinese}`, MARGIN + 12, top + 7, {
        width: CONTENT_WIDTH - 24,
        lineBreak: false,
      });
    currentY = top + 39;
  }

  function field(label: string, value: string) {
    const content = pdfSafeText(value) || "N/A";
    ensureSpace(44);
    document
      .fontSize(7.8)
      .fillColor(MUTED)
      .text(label, MARGIN, currentY, { width: CONTENT_WIDTH, lineBreak: false });
    currentY += 17;
    drawText(content);
    currentY += 5;
    document
      .moveTo(MARGIN, currentY)
      .lineTo(MARGIN + CONTENT_WIDTH, currentY)
      .lineWidth(0.45)
      .strokeColor(LINE)
      .stroke();
    currentY += 12;
  }

  const logoSize = 48;
  const headerTop = currentY;
  document.image(logoBytes, MARGIN, headerTop, {
    fit: [logoSize, logoSize],
    align: "center",
    valign: "center",
  });
  document
    .font(FONT_NAME)
    .fillColor(BURGUNDY)
    .fontSize(10)
    .text("MEZZANAIL NAIL STUDIO", MARGIN + 64, headerTop + 2, {
      width: CONTENT_WIDTH - 64,
      lineBreak: false,
    });
  document
    .fontSize(20)
    .text("JOB APPLICATION", MARGIN + 64, headerTop + 22, {
      width: CONTENT_WIDTH - 64,
      lineBreak: false,
    });
  document
    .fontSize(9)
    .fillColor(MUTED)
    .text("工作申请表", MARGIN + 64, headerTop + 47, {
      width: CONTENT_WIDTH - 64,
      lineBreak: false,
    });
  currentY = headerTop + 78;

  field("Application Reference / 申请编号", applicationReference);
  field("Submitted At / 提交时间", submittedAtDisplay);
  field("Timezone / 时区", "Asia/Kuala_Lumpur");

  section("SECTION 1 · BASIC INFORMATION", "基本资料");
  field("Full Name", application.fullName);
  field("WhatsApp Number", application.whatsappNumber);
  field("Current Area", application.currentArea);
  field("18 Years Old or Above", application.isAdult ? "Yes" : "No");
  field("Available Start Date", application.availableStartDate);
  field("Position Applied For", application.position);
  field("Working Arrangement", application.workingArrangement);
  field("Transportation", application.transportation);

  section("SECTION 2 · EXPERIENCE", "相关经验");
  field("Skill Level", application.skillLevel);
  field("Work Experience", application.workExperience);
  field("Previous Workplace", application.previousWorkplace || "N/A");
  field("Current Employment Status", application.employmentStatus);
  field("Reason for Applying", application.reasonForApplying);

  section("SECTION 3 · NAIL SKILLS", "美甲技能");
  for (const [name, value] of Object.entries(application.nailSkills)) {
    field(skillLabels[name as keyof JobApplicationInput["nailSkills"]], value);
  }

  section("SECTION 4 · ADDITIONAL INFORMATION", "附加资料");
  field("Languages Spoken", application.languagesSpoken.join(", "));
  field("Portfolio / Instagram", application.portfolio || "N/A");
  field("Additional Notes", application.additionalNotes || "N/A");

  section("SECTION 5 · APPLICANT DECLARATION", "申请人确认", 90);
  drawText(
    "I confirm that the information provided is accurate and I agree that Mezzanail may contact me regarding this job application.",
  );
  currentY += 8;
  drawText("Confirmed / 已确认", { color: BURGUNDY });

  const pageRange = document.bufferedPageRange();
  for (let index = pageRange.start; index < pageRange.start + pageRange.count; index += 1) {
    document.switchToPage(index);
    document.page.margins.bottom = 20;
    const footer = `${applicationReference}   ·   Page ${index + 1 - pageRange.start} of ${pageRange.count}`;
    document
      .save()
      .rect(24, 24, A4.width - 48, A4.height - 48)
      .lineWidth(0.65)
      .strokeColor(LINE)
      .stroke()
      .restore();
    document.font(FONT_NAME).fontSize(7.5);
    const footerX = A4.width - MARGIN - document.widthOfString(footer);
    document
      .fillColor(MUTED)
      .text(footer, footerX, A4.height - 64, {
        lineBreak: false,
      });
  }
  document.end();
  const bytes = await completed;
  fontBytes.fill(0);

  return {
    bytes: new Uint8Array(bytes),
    filename: jobApplicationFilename(applicationReference, application.fullName),
    submittedAtDisplay,
  };
}
