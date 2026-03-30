import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPdf(elementId: string, filename = 'copilot-metrics-report') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element #${elementId} not found`);

  const canvas = await html2canvas(element, {
    backgroundColor: '#0a0a0f',
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
  pdf.save(`${filename}.pdf`);
}

export async function exportPanelToPdf(panelElement: HTMLElement, title: string) {
  const canvas = await html2canvas(panelElement, {
    backgroundColor: '#0a0a0f',
    scale: 2,
    useCORS: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [canvas.width + 40, canvas.height + 40],
  });

  pdf.addImage(imgData, 'PNG', 20, 20, canvas.width, canvas.height);
  pdf.save(`${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
}
