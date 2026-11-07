import { catalogSchema, type Catalog } from '../domain/catalog';

export async function loadCatalog(): Promise<Catalog> {
  // Локальная зависимость: нет сетевой передачи параметров семьи.
  const { default: raw } = await import('./catalog.json');
  return catalogSchema.parse(raw);
}
