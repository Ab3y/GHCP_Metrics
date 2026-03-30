import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import Papa from 'papaparse';

function dateSuffix(): string {
  return new Date().toISOString().slice(0, 10);
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function exportToPdf(
  element: HTMLElement,
  filename: string,
  orientation: 'landscape' | 'portrait' = 'landscape',
): Promise<void> {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation, unit: 'mm', format: 'a4' });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;

  // Title header
  pdf.setFontSize(14);
  pdf.setTextColor(0, 255, 247);
  pdf.text(`GHCP Metrics — ${filename}`, margin, margin + 4);

  pdf.setFontSize(9);
  pdf.setTextColor(160, 160, 160);
  pdf.text(`Generated ${new Date().toLocaleString()}`, margin, margin + 10);

  const headerHeight = 18;
  const availableWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - margin - headerHeight - margin;

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(availableWidth / imgWidth, availableHeight / imgHeight);

  const drawWidth = imgWidth * ratio;
  const drawHeight = imgHeight * ratio;

  pdf.addImage(imgData, 'PNG', margin, margin + headerHeight, drawWidth, drawHeight);

  const outputFilename = `${filename}-${dateSuffix()}.pdf`;
  pdf.save(outputFilename);
}

export async function exportToHtml(
  element: HTMLElement,
  filename: string,
): Promise<void> {
  const clone = element.cloneNode(true) as HTMLElement;

  // Inline computed styles for every element in the clone
  const sourceElements = element.querySelectorAll('*');
  const cloneElements = clone.querySelectorAll('*');

  const inlineStyles = (src: Element, dest: HTMLElement) => {
    const computed = window.getComputedStyle(src);
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      dest.style.setProperty(prop, computed.getPropertyValue(prop));
    }
  };

  // Inline root element styles
  inlineStyles(element, clone);

  sourceElements.forEach((srcEl, i) => {
    const destEl = cloneElements[i] as HTMLElement | undefined;
    if (destEl?.style) {
      inlineStyles(srcEl, destEl);
    }
  });

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>GHCP Metrics — ${filename}</title>
  <style>
    body { margin: 0; padding: 24px; font-family: 'Inter', -apple-system, sans-serif; }
    .export-header { padding: 12px 0 20px; border-bottom: 1px solid #2a2a3e; margin-bottom: 20px; }
    .export-header h1 { margin: 0; font-size: 18px; color: #00fff7; }
    .export-header p { margin: 4px 0 0; font-size: 12px; color: #a0a0a0; }
  </style>
</head>
<body>
  <div class="export-header">
    <h1>GHCP Metrics — ${filename}</h1>
    <p>Generated ${new Date().toLocaleString()}</p>
  </div>
  ${clone.outerHTML}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, `${filename}-${dateSuffix()}.html`);
}

export async function exportToCsv(
  data: Record<string, unknown>[],
  filename: string,
  columns?: string[],
): Promise<void> {
  const rows = columns
    ? data.map((row) => {
        const filtered: Record<string, unknown> = {};
        for (const col of columns) {
          filtered[col] = row[col];
        }
        return filtered;
      })
    : data;

  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, `${filename}-${dateSuffix()}.csv`);
}
