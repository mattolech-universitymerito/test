export type SignatureItemType = 'text' | 'link' | 'icon' | 'button' | 'table' | 'section'

export interface SignatureItem {
  id: string
  type: SignatureItemType
  content: string
  href: string
  fontSize: number
  color: string
  backgroundColor: string
  fontFamily: string
  bold: boolean
  italic: boolean
  underline: boolean
  align: 'left' | 'center' | 'right'
  padding: number
}

export const fontChoices = [
  { label: 'Arial', value: 'Arial, Helvetica, sans-serif' },
  { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Times New Roman', value: '"Times New Roman", Times, serif' },
  { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
  { label: 'Tahoma', value: 'Tahoma, sans-serif' },
  { label: 'Segoe UI', value: '"Segoe UI", Arial, sans-serif' },
]

const starterContent: Record<SignatureItemType, string> = {
  text: 'Dodaj tekst',
  link: 'Nowy link',
  icon: '✦',
  button: 'Kliknij tutaj',
  table: 'Kolumna 1 | Kolumna 2',
  section: 'Nowa sekcja',
}

export function createSignatureItem(type: SignatureItemType): SignatureItem {
  return {
    id: crypto.randomUUID(),
    type,
    content: starterContent[type],
    href: type === 'link' || type === 'button' ? 'https://' : '',
    fontSize: type === 'button' ? 13 : 14,
    color: type === 'button' ? '#ffffff' : '#34443a',
    backgroundColor: '#52785f',
    fontFamily: fontChoices[0].value,
    bold: type === 'button' || type === 'section',
    italic: false,
    underline: type === 'link',
    align: 'left',
    padding: 4,
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character)
}

function safeUrl(value: string): string {
  const trimmed = value.trim()
  return /^(https?:|mailto:|tel:)/i.test(trimmed) ? trimmed : ''
}

function inlineTextStyle(item: SignatureItem): string {
  const style = [
    `color:${item.color}`,
    `font-family:${item.fontFamily}`,
    `font-size:${item.fontSize}px`,
    `font-weight:${item.bold ? 'bold' : 'normal'}`,
    `font-style:${item.italic ? 'italic' : 'normal'}`,
    `text-decoration:${item.underline ? 'underline' : 'none'}`,
    `text-align:${item.align}`,
    `padding:${item.padding}px 0`,
    'line-height:1.5',
  ]
  if (item.type === 'button') {
    style.push(`background-color:${item.backgroundColor}`, 'border-radius:5px', 'display:inline-block', 'padding:10px 16px', 'text-decoration:none')
  }
  return style.join(';')
}

function exportItem(item: SignatureItem): string {
  const content = escapeHtml(item.content).replace(/\r?\n/g, '<br>')
  const style = inlineTextStyle(item)
  const href = safeUrl(item.href)

  if (item.type === 'table') {
    const cells = item.content.split('|').map((cell) => cell.trim())
    const cellHtml = cells.map((cell) =>
      `<td style="${escapeHtml(style)};vertical-align:top">${escapeHtml(cell) || '&nbsp;'}</td>`,
    ).join('')
    return `<tr><td style="padding:0"><table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border:0;border-collapse:collapse"><tbody><tr>${cellHtml}</tr></tbody></table></td></tr>`
  }

  if (item.type === 'button') {
    const button = `<a href="${escapeHtml(href || '#')}" target="_blank" rel="noopener noreferrer" style="${escapeHtml(style)}">${content}</a>`
    return `<tr><td style="padding:0">${button}</td></tr>`
  }

  if (item.type === 'link' || (item.type === 'icon' && href)) {
    const link = `<a href="${escapeHtml(href || '#')}" target="_blank" rel="noopener noreferrer" style="${escapeHtml(style)}">${content}</a>`
    return `<tr><td style="padding:0">${link}</td></tr>`
  }

  const sectionStyle = item.type === 'section' ? 'border-top:1px solid #e6eae7;' : ''
  return `<tr><td style="${escapeHtml(style)};${sectionStyle}">${content}</td></tr>`
}

export function exportSignatureHtml(items: SignatureItem[]): string {
  const rows = items.map(exportItem).join('')
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email signature</title>
</head>
<body style="margin:0;padding:0">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border:0;border-collapse:collapse;font-family:Arial,Helvetica,sans-serif">
    <tbody>${rows}</tbody>
  </table>
</body>
</html>`
}
