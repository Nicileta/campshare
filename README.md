# CampusShare

CampusShare este un catalog web pentru comunitatea școlară. Elevii pot găsi, împrumuta și oferi materiale de studiu colegilor.

## Problema rezolvată

Materialele educaționale circulă adesea informale, prin mesaje sau discuții individuale. Aplicarea centralizează resursele disponibile într-un catalog căutabil și filtrabil, cu informații despre proprietar și status.

## Funcționalități

- Catalog de manuale, culegeri, echipamente și beletristică
- Căutare instant și filtrare după categorie
- Sortare după cele mai recente sau alfabetic
- Adăugare, editare, schimbare status și ștergere cu confirmare
- Statistici pentru resursele disponibile și cele împrumutate
- Stări de încărcare, eroare, listă goală și notificări
- Date persistente prin API REST local cu `json-server`
- Validarea câmpurilor obligatorii la adăugarea și editarea resurselor
- Confirmare înainte de ștergere

## Utilizatori și User Stories

- Elevul caută și filtrează resursele după titlu, materie sau categorie.
- Proprietarul adaugă, editează și șterge resursele personale.
- Proprietarul schimbă statusul unei resurse între disponibil și împrumutat.
- Utilizatorul urmărește statisticile totale și disponibile.

Criteriile de acceptare și planificarea completă sunt în [docs/requirements.md](docs/requirements.md).

## Pornire

Necesită Node.js și npm.

```bash
npm install
npm run dev
```

Comanda pornește API-ul `json-server` pe portul `3001` și Vite pe portul `5173`, apoi deschide aplicația în browser. API-ul este disponibil prin proxy la `/api/resources`; datele inițiale sunt în `db.json`.

Pentru a porni separat procesele:

```bash
npm run api
npm run web
```

## Testare

```bash
npm install
npm test
npm run lint
npm run build
```

Testele acoperă filtrarea, căutarea, sortarea, vizualizarea resurselor personale și calcularea statisticilor.

## Tehnologii

React, Vite, CSS, lucide-react și json-server.

## Structura proiectului

- `src/App.jsx` — interfața și gestionarea stărilor aplicației
- `src/App.css` și `src/index.css` — stiluri responsive
- `src/services/api.js` — comunicarea cu API-ul REST
- `src/utils/resources.js` — reguli pure pentru filtrare, sortare și statistici
- `src/utils/resources.test.js` — teste automate Vitest
- `db.json` — datele locale inițiale și modificările persistente
- `docs/requirements.md` — problema, User Stories și criterii de acceptare
