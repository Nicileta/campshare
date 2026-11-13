import { useEffect, useState } from 'react'
import {
  AlertCircle,
  ArrowDownUp,
  BookMarked,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Clock3,
  Laptop,
  Library,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import {
  createResource,
  deleteResource,
  getResources,
  updateResource,
} from './services/api.js'
import './App.css'

const categories = [
  { id: 'all', label: 'Toate', icon: Library },
  { id: 'manual', label: 'Manuale', icon: BookOpen },
  { id: 'workbook', label: 'Culegeri', icon: BookMarked },
  { id: 'equipment', label: 'Echipamente', icon: Laptop },
  { id: 'literature', label: 'Beletristică', icon: BookMarked },
]

const categoryLabels = {
  manual: 'Manual',
  workbook: 'Culegere',
  equipment: 'Echipament',
  literature: 'Beletristică',
}

const categoryIcons = {
  manual: BookOpen,
  workbook: BookMarked,
  equipment: Laptop,
  literature: BookMarked,
}

const emptyResource = {
  title: '',
  category: 'manual',
  subject: '',
  owner: 'Ana Popescu',
  contact: '',
  description: '',
  status: 'available',
}

function App() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [sort, setSort] = useState('recent')
  const [view, setView] = useState('catalog')
  const [editing, setEditing] = useState(null)
  const [confirming, setConfirming] = useState(null)
  const [toast, setToast] = useState('')
  const [actionError, setActionError] = useState('')

  useEffect(() => {
    let active = true
    getResources()
      .then((data) => {
        if (active) setResources(data)
      })
      .catch(() => {
        if (active) setLoadError('Nu ne-am putut conecta la catalog. Verifică dacă serverul API este pornit.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const availableCount = resources.filter((resource) => resource.status === 'available').length
  const borrowedCount = resources.length - availableCount
  const visibleResources = resources
    .filter((resource) => view !== 'mine' || resource.owner === 'Ana Popescu')
    .filter((resource) => category === 'all' || resource.category === category)
    .filter((resource) => {
      const searchable = `${resource.title} ${resource.subject} ${resource.owner} ${resource.description}`
      return searchable.toLocaleLowerCase('ro').includes(query.toLocaleLowerCase('ro'))
    })
    .sort((first, second) => {
      if (sort === 'alphabetical') return first.title.localeCompare(second.title, 'ro')
      return new Date(second.createdAt || 0) - new Date(first.createdAt || 0)
    })

  function showToast(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2800)
  }

  async function saveResource(values) {
    if (editing?.id) {
      const updated = await updateResource(editing.id, values)
      setResources((current) => current.map((item) => item.id === updated.id ? updated : item))
      showToast('Resursa a fost actualizată.')
    } else {
      const created = await createResource({ ...values, createdAt: new Date().toISOString() })
      setResources((current) => [created, ...current])
      showToast('Resursa a fost adăugată cu succes!')
    }
    setEditing(null)
  }

  async function toggleStatus(resource) {
    setActionError('')
    const status = resource.status === 'available' ? 'borrowed' : 'available'
    try {
      const updated = await updateResource(resource.id, { status })
      setResources((current) => current.map((item) => item.id === updated.id ? updated : item))
    } catch {
      setActionError('Statusul nu a putut fi actualizat. Verifică serverul API.')
    }
  }

  async function removeResource() {
    if (!confirming) return
    setActionError('')
    try {
      await deleteResource(confirming.id)
      setResources((current) => current.filter((item) => item.id !== confirming.id))
      setConfirming(null)
      showToast('Resursa a fost ștearsă din catalog.')
    } catch {
      setActionError('Resursa nu a putut fi ștearsă. Încearcă din nou.')
      setConfirming(null)
    }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#catalog" onClick={() => setView('catalog')} aria-label="CampusShare, catalog">
          <span className="brand-mark"><BookOpen size={20} strokeWidth={2.2} /></span>
          <span>campus<span>share</span></span>
        </a>

        <label className="search-box">
          <Search size={18} aria-hidden="true" />
          <input
            aria-label="Caută în catalog"
            placeholder="Caută manual, culegere, autor..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && <button className="clear-search" type="button" onClick={() => setQuery('')} aria-label="Șterge căutarea"><X size={15} /></button>}
        </label>

        <nav className="top-nav" aria-label="Navigare principală">
          <button className={view === 'catalog' ? 'nav-link active' : 'nav-link'} onClick={() => setView('catalog')}>Catalog</button>
          <button className={view === 'mine' ? 'nav-link active' : 'nav-link'} onClick={() => setView('mine')}>Resursele mele</button>
        </nav>
        <button className="button button-primary add-button" onClick={() => setEditing({ ...emptyResource })}>
          <Plus size={17} /> <span>Adaugă resursă</span>
        </button>
      </header>

      <main id="catalog" className="main-content">
        <section className="welcome-row">
          <div>
            <p className="eyebrow">BIBLIOTECA COMUNITĂȚII</p>
            <h1>{view === 'mine' ? 'Resursele mele' : 'Învățăm mai bine împreună.'}</h1>
            <p className="welcome-copy">Împrumută ce-ți trebuie. Dă mai departe ce nu-ți mai folosești.</p>
          </div>
          <div className="welcome-note"><span className="note-icon"><CircleHelp size={17} /></span><span>Un catalog creat de elevi,<br />pentru elevi.</span></div>
        </section>

        <section className="stats-row" aria-label="Statistici catalog">
          <Stat icon={Library} label="Resurse în catalog" value={resources.length} detail="toate materialele" />
          <Stat icon={CheckCircle2} label="Disponibile acum" value={availableCount} detail="gata de împrumut" tone="green" />
          <Stat icon={Clock3} label="În circulație" value={borrowedCount} detail="împrumutate acum" tone="amber" />
        </section>

        <div className="catalog-heading">
          <div>
            <h2>{view === 'mine' ? 'Materialele mele' : 'Explorează catalogul'}</h2>
            <p>{visibleResources.length} {visibleResources.length === 1 ? 'resursă găsită' : 'resurse găsite'}</p>
          </div>
          <label className="sort-control">
            <ArrowDownUp size={15} />
            <select aria-label="Sortează resursele" value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="recent">Cele mai recente</option>
              <option value="alphabetical">Alfabetic</option>
            </select>
            <ChevronDown size={14} />
          </label>
        </div>

        <div className="filter-row" role="group" aria-label="Filtrează după categorie">
          <div className="category-tabs">
            {categories.map(({ id, label, icon: Icon }) => (
              <button key={id} className={category === id ? 'category-tab selected' : 'category-tab'} onClick={() => setCategory(id)}>
                <Icon size={15} />{label}
              </button>
            ))}
          </div>
          <span className="filter-hint"><span className="status-dot available-dot" /> Disponibil <span className="hint-divider">·</span> <span className="status-dot borrowed-dot" /> Împrumutat</span>
        </div>

        {(loadError || actionError) && (
          <div className="error-banner" role="alert">
            <AlertCircle size={18} />
            <span>{loadError || actionError}</span>
            {loadError && <button onClick={() => window.location.reload()}>Reîncearcă</button>}
            {actionError && <button className="error-dismiss" onClick={() => setActionError('')} aria-label="Închide"><X size={16} /></button>}
          </div>
        )}

        {loading ? (
          <div className="resource-grid" aria-label="Se încarcă resursele">
            {Array.from({ length: 6 }, (_, index) => <div className="skeleton-card" key={index}><div className="skeleton-cover" /><div className="skeleton-line" /><div className="skeleton-line short" /></div>)}
          </div>
        ) : visibleResources.length ? (
          <div className="resource-grid">
            {visibleResources.map((resource, index) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                index={index}
                onToggle={() => toggleStatus(resource)}
                onEdit={() => setEditing({ ...resource })}
                onDelete={() => setConfirming(resource)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon"><Search size={24} /></span>
            <h3>Nu am găsit nicio resursă</h3>
            <p>Încearcă alți termeni sau schimbă filtrele selectate.</p>
            <button className="button button-secondary" onClick={() => { setQuery(''); setCategory('all') }}>Resetează filtrele</button>
          </div>
        )}
      </main>

      <footer className="page-footer"><span>CampusShare</span><span>Împărțim resurse. Construim comunitate.</span><span>© 2026</span></footer>

      {editing && <ResourceModal resource={editing} onClose={() => setEditing(null)} onSave={saveResource} />}
      {confirming && <ConfirmDialog resource={confirming} onCancel={() => setConfirming(null)} onConfirm={removeResource} />}
      {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  )
}

function Stat({ icon: Icon, label, value, detail, tone = 'blue' }) {
  return (
    <div className="stat-item">
      <span className={`stat-icon ${tone}`}><Icon size={19} /></span>
      <div className="stat-copy"><span className="stat-label">{label}</span><strong>{value}</strong></div>
      <span className="stat-detail">{detail}</span>
    </div>
  )
}

function ResourceCard({ resource, index, onToggle, onEdit, onDelete }) {
  const Icon = categoryIcons[resource.category] || BookOpen
  const borrowed = resource.status === 'borrowed'
  return (
    <article className="resource-card" style={{ '--card-order': index }}>
      <div className={`resource-cover cover-${resource.category}`}>
        <span className="cover-pattern" />
        <span className="cover-category">{categoryLabels[resource.category] || 'Resursă'}</span>
        <Icon className="cover-icon" size={48} strokeWidth={1.2} aria-hidden="true" />
        <span className={`status-badge ${borrowed ? 'borrowed' : 'available'}`}><span className="status-dot" />{borrowed ? 'Împrumutat' : 'Disponibil'}</span>
      </div>
      <div className="resource-body">
        <h3 title={resource.title}>{resource.title}</h3>
        <p className="resource-subject">{resource.subject || 'Materie nespecificată'}</p>
        <div className="resource-owner"><span className="owner-avatar">{(resource.owner || '?').split(' ').map((part) => part[0]).slice(0, 2).join('')}</span><span><strong>{resource.owner}</strong><small>{resource.contact || 'Proprietar'}</small></span></div>
        <p className="resource-description">{resource.description || 'Detalii disponibile la contact.'}</p>
        <div className="card-actions">
          <button className="status-action" onClick={onToggle}>{borrowed ? <><Check size={15} /> Marchează returnat</> : <><Clock3 size={15} /> Marchează împrumutat</>}</button>
          <button className="icon-button" onClick={onEdit} aria-label={`Editează ${resource.title}`} title="Editează"><Pencil size={16} /></button>
          <button className="icon-button delete-action" onClick={onDelete} aria-label={`Șterge ${resource.title}`} title="Șterge"><Trash2 size={16} /></button>
        </div>
      </div>
    </article>
  )
}

function ResourceModal({ resource, onClose, onSave }) {
  const [form, setForm] = useState({ ...emptyResource, ...resource })
  const [errors, setErrors] = useState({})
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)
  const isEditing = Boolean(resource.id)

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: '' }))
  }

  async function submit(event) {
    event.preventDefault()
    const nextErrors = {}
    if (form.title.trim().length < 3) nextErrors.title = 'Titlul trebuie să aibă cel puțin 3 caractere.'
    if (!form.category) nextErrors.category = 'Alege o categorie.'
    if (!form.owner.trim()) nextErrors.owner = 'Completează numele proprietarului.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    setSaving(true)
    setSaveError('')
    try {
      await onSave({ ...form, title: form.title.trim(), owner: form.owner.trim() })
    } catch {
      setSaveError('Nu am putut salva modificările. Verifică serverul API și încearcă din nou.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="resource-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-heading"><div><p className="eyebrow">CATALOG CAMPUSSHARE</p><h2 id="modal-title">{isEditing ? 'Editează resursa' : 'Adaugă o resursă'}</h2><p>Ajută un coleg să găsească ce-i trebuie.</p></div><button className="icon-button modal-close" onClick={onClose} aria-label="Închide"><X size={19} /></button></div>
        <form onSubmit={submit} noValidate>
          <label className="form-field full-field"><span>Titlu <b>*</b></span><input autoFocus name="title" value={form.title} onChange={updateField} placeholder="ex. Culegere de matematică, clasa a XI-a" aria-invalid={Boolean(errors.title)} />{errors.title && <small className="field-error">{errors.title}</small>}</label>
          <div className="form-columns">
            <label className="form-field"><span>Categorie <b>*</b></span><select name="category" value={form.category} onChange={updateField}><option value="manual">Manual</option><option value="workbook">Culegere</option><option value="equipment">Instrumente / Echipamente</option><option value="literature">Beletristică</option></select>{errors.category && <small className="field-error">{errors.category}</small>}</label>
            <label className="form-field"><span>Materie / Profil</span><input name="subject" value={form.subject} onChange={updateField} placeholder="ex. Matematică" /></label>
          </div>
          <div className="form-columns">
            <label className="form-field"><span>Proprietar <b>*</b></span><input name="owner" value={form.owner} onChange={updateField} placeholder="Numele tău" aria-invalid={Boolean(errors.owner)} />{errors.owner && <small className="field-error">{errors.owner}</small>}</label>
            <label className="form-field"><span>Contact</span><input name="contact" value={form.contact} onChange={updateField} placeholder="Telefon, Telegram, grupă..." /></label>
          </div>
          <label className="form-field full-field"><span>Descriere / Stare</span><textarea name="description" value={form.description} onChange={updateField} placeholder="Spune câteva detalii utile despre resursă..." rows="3" /></label>
          {isEditing && <label className="form-field full-field"><span>Status</span><select name="status" value={form.status} onChange={updateField}><option value="available">Disponibil</option><option value="borrowed">Împrumutat</option></select></label>}
          {saveError && <p className="field-error" role="alert">{saveError}</p>}
          <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Anulează</button><button type="submit" className="button button-primary" disabled={saving}>{saving ? <LoaderCircle className="spin" size={17} /> : <Plus size={17} />}{isEditing ? 'Salvează modificările' : 'Salvează resursa'}</button></div>
        </form>
      </section>
    </div>
  )
}

function ConfirmDialog({ resource, onCancel, onConfirm }) {
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onCancel() }}>
      <section className="confirm-dialog" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-copy">
        <span className="confirm-icon"><Trash2 size={21} /></span>
        <h2 id="confirm-title">Ștergi această resursă?</h2>
        <p id="confirm-copy">„{resource.title}” va fi eliminată din catalog. Acțiunea nu poate fi anulată.</p>
        <div className="modal-actions"><button className="button button-secondary" onClick={onCancel}>Păstrează</button><button className="button button-danger" onClick={onConfirm}><Trash2 size={16} />Șterge resursa</button></div>
      </section>
    </div>
  )
}

export default App
