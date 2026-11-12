import { catalogSchema, type Catalog } from '../domain/catalog';
import catalogUrl from './catalog.json?url';

export async function loadCatalog(): Promise<Catalog> {
  // Fetch only the public local fixture. Search parameters never leave memory.
  // Unlike a rejected module import, a failed fetch can be retried successfully.
  const response = await fetch(catalogUrl);
  if (!response.ok) throw new Error('CATALOG_LOAD_FAILED');
  return catalogSchema.parse(await response.json());
}

export interface CatalogRepository { load(): Promise<Catalog> }
export const catalogRepository: CatalogRepository = { load: loadCatalog };
