// Development-only integration harness for catalog changes. Not a product route
// or bundled entry point. Exercises the real provider and comparison components.
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { AppStateProvider, useApp } from '../../../src/app/AppState';
import { Comparison } from '../../../src/features/search/SelectionViews';
import { catalogSchema, type Catalog } from '../../../src/domain/catalog';
import raw from '../../../src/data/catalog.json';
import '../../../src/styles.css';

const catalog = catalogSchema.parse(raw);
function Controls({ change }: { change: (catalog: Catalog) => void }) {
  const { toggleCompare, comparison } = useApp();
  return <>
    <button onClick={() => { toggleCompare('S01', 'O01'); toggleCompare('S02', 'O02'); toggleCompare('S03', 'O03'); }}>Pin three pairs</button>
    <button onClick={() => {
      const updated = structuredClone(catalog);
      updated.offers.find(o => o.id === 'O02')!.publicationStatus = 'withdrawn';
      updated.specialists.find(s => s.id === 'S03')!.publicationStatus = 'hidden';
      for (const s of updated.specialists) s.categoryIds = [...new Set(updated.offers
        .filter(o => o.specialistId === s.id && o.publicationStatus === 'published').map(o => o.categoryId))];
      change(updated);
    }}>Withdraw offer and hide provider</button>
    <button onClick={() => { toggleCompare('S01', 'O02'); toggleCompare('missing', 'O01'); toggleCompare('S12', 'missing'); }}>Try forged pairs</button>
    <output data-testid="pairs">{JSON.stringify(comparison)}</output>
    <Comparison />
  </>;
}
function Harness() {
  const [data, setData] = useState(catalog);
  return <MemoryRouter><AppStateProvider catalog={data}><Controls change={setData} /></AppStateProvider></MemoryRouter>;
}
createRoot(document.getElementById('root')!).render(<Harness />);
