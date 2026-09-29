import { useMemo, useState } from 'react'
import './App.css'
import {
  createSignatureItem,
  exportSignatureHtml,
  fontChoices,
  type SignatureItem,
  type SignatureItemType,
} from './signature'

const starterItems: SignatureItem[] = [
  {
    ...createSignatureItem('text'),
    content: 'Olivia Rhye',
    fontSize: 22,
    color: '#17211c',
    bold: true,
  },
  {
    ...createSignatureItem('text'),
    content: 'Brand designer · Studio North',
    fontSize: 13,
    color: '#78827c',
  },
  {
    ...createSignatureItem('table'),
    content: '+1 (555) 012-3456 | olivia@studionorth.co',
    fontSize: 12,
    color: '#3c4840',
  },
  {
    ...createSignatureItem('icon'),
    content: 'in   ↗   ◎',
    href: 'https://www.linkedin.com',
    fontSize: 16,
    color: '#52785f',
  },
  {
    ...createSignatureItem('button'),
    content: 'Book a meeting',
    href: 'https://cal.com',
    fontSize: 12,
    color: '#ffffff',
  },
]

const tools: { type: SignatureItemType; label: string; icon: string }[] = [
  { type: 'text', label: 'Tekst', icon: 'T' },
  { type: 'link', label: 'Link', icon: '↗' },
  { type: 'icon', label: 'Ikona', icon: '✳' },
  { type: 'button', label: 'Przycisk', icon: '▰' },
  { type: 'table', label: 'Tabela', icon: '▦' },
  { type: 'section', label: 'Sekcja', icon: '▤' },
]

function ItemPreview({ item }: { item: SignatureItem }) {
  const style = {
    color: item.color,
    fontFamily: item.fontFamily,
    fontSize: `${item.fontSize}px`,
    fontWeight: item.bold ? 700 : 400,
    fontStyle: item.italic ? 'italic' : 'normal',
    textDecoration: item.underline ? 'underline' : 'none',
    textAlign: item.align,
    padding: `${item.padding}px 0`,
  } as const

  if (item.type === 'table') {
    const cells = item.content.split('|').map((cell) => cell.trim())
    return (
      <table className="preview-table" role="presentation">
        <tbody>
          <tr>
            {cells.map((cell, index) => (
              <td key={`${cell}-${index}`} style={style}>{cell || 'Kolumna'}</td>
            ))}
          </tr>
        </tbody>
      </table>
    )
  }

  if (item.type === 'button') {
    return (
      <a className="preview-button" href={item.href || '#'} style={style}>
        {item.content}
      </a>
    )
  }

  if (item.type === 'icon' && item.href) {
    return <a href={item.href} style={style}>{item.content}</a>
  }

  if (item.type === 'link') {
    return <a href={item.href || '#'} style={style}>{item.content}</a>
  }

  return <div style={style}>{item.content}</div>
}

function App() {
  const [items, setItems] = useState(starterItems)
  const [selectedId, setSelectedId] = useState(starterItems[0].id)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')
  const [copied, setCopied] = useState(false)
  const selectedItem = items.find((item) => item.id === selectedId) ?? items[0]
  const html = useMemo(() => exportSignatureHtml(items), [items])

  const addItem = (type: SignatureItemType) => {
    const item = createSignatureItem(type)
    setItems((current) => [...current, item])
    setSelectedId(item.id)
  }

  const updateItem = (key: keyof SignatureItem, value: string | number | boolean) => {
    if (!selectedItem) return
    setItems((current) =>
      current.map((item) => item.id === selectedItem.id ? { ...item, [key]: value } : item),
    )
  }

  const removeItem = () => {
    if (!selectedItem) return
    const nextItems = items.filter((item) => item.id !== selectedItem.id)
    setItems(nextItems)
    setSelectedId(nextItems[0]?.id ?? '')
  }

  const moveItem = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return
    const reordered = [...items]
    const from = reordered.findIndex((item) => item.id === draggedId)
    const to = reordered.findIndex((item) => item.id === targetId)
    if (from < 0 || to < 0) return
    const [moved] = reordered.splice(from, 1)
    reordered.splice(to, 0, moved)
    setItems(reordered)
    setDraggedId(null)
  }

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      setCopied(false)
    }
  }

  const downloadHtml = () => {
    const file = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = url
    link.download = 'stopka-email.html'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" aria-label="Mailcraft, strona główna">
          <span className="brand-mark">m</span>
          <span>mailcraft</span>
        </a>
        <div className="document-name"><span className="status-dot" /> Nowa stopka <span className="saved-label">· Zapisano lokalnie</span></div>
        <div className="topbar-actions">
          <button className="button button-light" onClick={copyHtml}>{copied ? 'Skopiowano!' : '⧉  Kopiuj HTML'}</button>
          <button className="button button-primary" onClick={downloadHtml}>Pobierz HTML <span aria-hidden="true">↓</span></button>
        </div>
      </header>

      <div className="workspace">
        <aside className="tool-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">KOMPONENTY</span>
              <h1>Dodaj element</h1>
            </div>
            <span className="panel-heading-icon">＋</span>
          </div>
          <p className="panel-intro">Zbuduj swoją stopkę z gotowych bloków.</p>
          <div className="tool-grid">
            {tools.map((tool) => (
              <button className="tool-card" key={tool.type} onClick={() => addItem(tool.type)}>
                <span className={`tool-icon tool-icon-${tool.type}`}>{tool.icon}</span>
                <span>{tool.label}</span>
                <span className="tool-plus">+</span>
              </button>
            ))}
          </div>

          <div className="panel-divider" />
          <div className="tips-card">
            <span className="tips-icon">✦</span>
            <div><strong>Stworzone dla emaila</strong><p>Tabele i style inline gwarantują świetny wygląd w skrzynce odbiorczej.</p></div>
          </div>
          <div className="left-footer"><span className="tiny-check">✓</span> Wszystkie zmiany są lokalne</div>
        </aside>

        <section className="canvas-panel" aria-label="Edytor stopki">
          <div className="canvas-toolbar">
            <div>
              <span className="eyebrow">OBSZAR ROBOCZY</span>
              <strong>Twoja stopka</strong>
            </div>
            <div className="canvas-meta"><span className="desktop-chip">✉</span> Podgląd desktopowy <span className="canvas-zoom">100%</span></div>
          </div>
          <div className="canvas-stage">
            <div className="email-card">
              <div className="email-card-bar">
                <div className="window-dots"><i /><i /><i /></div>
                <span>Podgląd wiadomości</span>
                <span className="more-icon">···</span>
              </div>
              <div className="email-content">
                <div className="email-greeting"><span className="avatar">J</span><div><strong>Jordan Lee</strong><small>do mnie&nbsp; · &nbsp;teraz</small></div></div>
                <p className="email-copy">Cześć Olivia,<br /><br />Dzięki za rozmowę. Przesyłam szczegóły i pozostaję w kontakcie!<br /><br />Pozdrawiam,</p>
                <div className="signature-canvas">
                  {items.length === 0 && <p className="empty-state">Dodaj pierwszy element z panelu po lewej</p>}
                  {items.map((item) => (
                    <div
                      className={`canvas-item ${selectedId === item.id ? 'is-selected' : ''} ${draggedId === item.id ? 'is-dragging' : ''}`}
                      key={item.id}
                      draggable
                      onClick={() => setSelectedId(item.id)}
                      onDragStart={() => setDraggedId(item.id)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => moveItem(item.id)}
                      onDragEnd={() => setDraggedId(null)}
                    >
                      <span className="drag-handle" aria-hidden="true">⠿</span>
                      <ItemPreview item={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="canvas-hint"><span>↕</span> Przeciągnij element, aby zmienić kolejność</p>
          </div>

          <section className="output-panel">
            <div className="output-heading">
              <div className="tabs" role="tablist" aria-label="Widok wyniku">
                <button role="tab" aria-selected={activeTab === 'preview'} className={activeTab === 'preview' ? 'active' : ''} onClick={() => setActiveTab('preview')}>Podgląd</button>
                <button role="tab" aria-selected={activeTab === 'code'} className={activeTab === 'code' ? 'active' : ''} onClick={() => setActiveTab('code')}>Kod HTML <span className="code-count">{html.length}</span></button>
              </div>
              <span className="email-safe"><span>✓</span> Gotowe do emaila</span>
            </div>
            {activeTab === 'preview'
              ? <div className="mini-preview">{items.map((item) => <ItemPreview item={item} key={item.id} />)}</div>
              : <pre className="html-code"><code>{html}</code></pre>}
          </section>
        </section>

        <aside className="properties-panel">
          <div className="panel-heading property-heading">
            <div><span className="eyebrow">PERSONALIZACJA</span><h2>Właściwości</h2></div>
            {selectedItem && <button className="icon-button delete-button" onClick={removeItem} aria-label="Usuń element">⌫</button>}
          </div>
          {!selectedItem ? (
            <div className="properties-empty">Wybierz element na obszarze roboczym, aby edytować jego właściwości.</div>
          ) : (
            <>
              <div className="field-group">
                <label htmlFor="content">{selectedItem.type === 'table' ? 'Treść kolumn' : 'Treść'}</label>
                {selectedItem.type === 'table'
                  ? <textarea id="content" value={selectedItem.content} onChange={(event) => updateItem('content', event.target.value)} rows={2} />
                  : <input id="content" value={selectedItem.content} onChange={(event) => updateItem('content', event.target.value)} />}
                {selectedItem.type === 'table' && <small>Oddziel kolumny znakiem |</small>}
              </div>
              {['link', 'icon', 'button'].includes(selectedItem.type) && (
                <div className="field-group">
                  <label htmlFor="href">Adres URL</label>
                  <div className="input-with-icon"><span>↗</span><input id="href" value={selectedItem.href} placeholder="https://" onChange={(event) => updateItem('href', event.target.value)} /></div>
                </div>
              )}
              <div className="field-row">
                <div className="field-group">
                  <label htmlFor="fontSize">Rozmiar</label>
                  <div className="unit-input"><input id="fontSize" type="number" min="8" max="48" value={selectedItem.fontSize} onChange={(event) => updateItem('fontSize', Number(event.target.value))} /><span>px</span></div>
                </div>
                <div className="field-group">
                  <label htmlFor="fontFamily">Krój pisma</label>
                  <select id="fontFamily" value={selectedItem.fontFamily} onChange={(event) => updateItem('fontFamily', event.target.value)}>
                    {fontChoices.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="field-group">
                <label>Kolor tekstu</label>
                <div className="color-control"><input type="color" value={selectedItem.color} onChange={(event) => updateItem('color', event.target.value)} aria-label="Wybierz kolor tekstu" /><input value={selectedItem.color.toUpperCase()} onChange={(event) => updateItem('color', event.target.value)} aria-label="Kod koloru tekstu" /></div>
              </div>
              {selectedItem.type === 'button' && (
                <div className="field-group">
                  <label>Kolor przycisku</label>
                  <div className="color-control"><input type="color" value={selectedItem.backgroundColor} onChange={(event) => updateItem('backgroundColor', event.target.value)} aria-label="Wybierz kolor przycisku" /><input value={selectedItem.backgroundColor.toUpperCase()} onChange={(event) => updateItem('backgroundColor', event.target.value)} aria-label="Kod koloru przycisku" /></div>
                </div>
              )}
              <div className="field-group">
                <label>Formatowanie</label>
                <div className="format-controls">
                  <button className={selectedItem.bold ? 'format-active' : ''} onClick={() => updateItem('bold', !selectedItem.bold)} aria-label="Pogrubienie"><strong>B</strong></button>
                  <button className={selectedItem.italic ? 'format-active' : ''} onClick={() => updateItem('italic', !selectedItem.italic)} aria-label="Kursywa"><em>I</em></button>
                  <button className={selectedItem.underline ? 'format-active' : ''} onClick={() => updateItem('underline', !selectedItem.underline)} aria-label="Podkreślenie"><u>U</u></button>
                  <span className="format-divider" />
                  {(['left', 'center', 'right'] as const).map((align, index) => (
                    <button className={selectedItem.align === align ? 'format-active' : ''} key={align} onClick={() => updateItem('align', align)} aria-label={`Wyrównaj ${align}`}>{['☰', '☷', '☰'][index]}</button>
                  ))}
                </div>
              </div>
              <div className="field-group">
                <label htmlFor="spacing">Odstępy <span className="value-label">{selectedItem.padding}px</span></label>
                <input className="range-input" id="spacing" type="range" min="0" max="24" value={selectedItem.padding} onChange={(event) => updateItem('padding', Number(event.target.value))} />
                <div className="range-labels"><span>Brak</span><span>Więcej</span></div>
              </div>
              <div className="property-note"><span>ⓘ</span> Wybierz bezpieczny dla emaila font z listy. Każdy styl jest osadzany inline.</div>
            </>
          )}
          <div className="right-footer"><span className="green-pulse" /> Podgląd aktualizuje się na żywo</div>
        </aside>
      </div>
      <footer className="app-footer"><span>mailcraft <span>·</span> Prosty kreator stopek</span><span>Eksport HTML&nbsp; <b>✦</b></span></footer>
    </main>
  )
}

export default App
