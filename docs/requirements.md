# Cerințe și planificare CampusShare

## Identificarea problemei

Elevii au dificultăți în a găsi rapid manuale, culegeri, echipamente și cărți disponibile în comunitatea școlară. CampusShare centralizează resursele și permite oferirea, împrumutarea și returnarea lor într-un catalog ușor de utilizat.

## Obiectiv

O aplicație web responsive care permite utilizatorilor să publice resurse, să le caute, să le filtreze, să urmărească disponibilitatea și să își gestioneze materialele proprii.

## User Stories

1. Ca elev, vreau să caut o resursă după titlu, materie sau proprietar.
2. Ca elev, vreau să filtrez resursele după categorie.
3. Ca elev, vreau să sortez resursele alfabetic sau după cele mai recente.
4. Ca proprietar, vreau să adaug o resursă cu titlu, categorie, materie, proprietar, contact și descriere.
5. Ca proprietar, vreau să editez o resursă existentă.
6. Ca proprietar, vreau să marchez o resursă ca împrumutată sau disponibilă.
7. Ca proprietar, vreau să șterg o resursă după confirmare.
8. Ca utilizator, vreau să văd statisticile resurselor totale, disponibile și împrumutate.
9. Ca utilizator, vreau să văd stări clare de încărcare și eroare.

## Criterii de acceptare

- Căutarea și filtrarea produc rezultate corecte și actualizate imediat.
- Adăugarea este permisă doar după completarea câmpurilor obligatorii.
- Editarea și ștergerea păstrează datele consistente în API.
- Ștergerea cere confirmare explicită.
- Statusul disponibil/împrumutat se actualizează vizual și persistent.
- Statisticile se recalculează după fiecare modificare.
- Interfața este utilizabilă pe desktop și pe mobil.
- O eroare de API este afișată în mod vizibil utilizatorului.

## Structură tehnică

- Frontend: React, Vite, CSS și lucide-react.
- Backend local: json-server.
- Persistență: `db.json`.
- Porturi: API `3001`, interfață `5173`.
