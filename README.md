# CampusShare

Catalog web pentru comunitatea școlară: elevii pot găsi, împrumuta și oferi materiale de studiu colegilor.

## Funcționalități

- Catalog de manuale, culegeri, echipamente și beletristică
- Căutare instant și filtrare după categorie
- Sortare după cele mai recente sau alfabetic
- Adăugare, editare, schimbare status și ștergere cu confirmare
- Statistici pentru resursele disponibile și cele împrumutate
- Stări de încărcare, eroare, listă goală și notificări
- Date persistente prin API REST local cu `json-server`

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

## Tehnologii

React, Vite, CSS, lucide-react și json-server.
