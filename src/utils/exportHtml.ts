export function exportToHtml(elementId: string, filename = 'copilot-metrics-report') {
  const element = document.getElementById(elementId);
  if (!element) throw new Error(`Element #${elementId} not found`);

  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules)
          .map((rule) => rule.cssText)
          .join('\n');
      } catch {
        return '';
      }
    })
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Abe's GHCP Metrics Report</title>
  <style>${styles}</style>
</head>
<body class="dark" style="background-color: #0a0a0f; color: #e4e4e7; padding: 2rem;">
  <h1 style="color: #00fff7; font-family: Inter, sans-serif; margin-bottom: 1rem;">Abe's GHCP Metrics Report</h1>
  <p style="color: #888; font-family: Inter, sans-serif; margin-bottom: 2rem;">Generated on ${new Date().toLocaleDateString()}</p>
  ${element.innerHTML}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  a.click();
  URL.revokeObjectURL(url);
}
