import { expect, test, type Page } from '@playwright/test';

async function rows(page: Page) {
  return page.evaluate(() => {
    // Use native IndexedDB to count persisted rows independently of UI state.
    return new Promise<Record<string, unknown>[]>((resolve, reject) => {
      const open = indexedDB.open('qoldau-demo-v1', 1);
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const db = open.result; const tx = db.transaction('requests');
        const read = tx.objectStore('requests').getAll();
        tx.oncomplete = () => { db.close(); resolve(read.result); };
        tx.onabort = () => { db.close(); reject(tx.error); };
      };
    });
  });
}
async function ready(page: Page) {
  await page.goto('/request/O01');
  await expect(page.locator('[data-request-phase]')).toHaveAttribute('data-request-phase', 'draft');
}
async function save(page: Page) {
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Сохранить демозапрос', exact: true }).click();
  await expect(page).toHaveURL(/\/request-status\//u);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Демозапрос сохранён на этом устройстве');
}
async function abortOperation(page: Page, method: 'add' | 'put' | 'clear') {
  await page.evaluate(method => {
    const original = IDBObjectStore.prototype[method];
    Object.defineProperty(IDBObjectStore.prototype, method, { configurable: true, writable: true, value: function (this: IDBObjectStore, ...args: unknown[]) {
      const request = Reflect.apply(original, this, args) as IDBRequest;
      if (this.name === 'requests') request.addEventListener('success', () => this.transaction.abort());
      return request;
    } });
  }, method);
}

test('S08 ack defaults false, has no personal inputs; double click commits once; S09 reload/back/cancel', async ({ page }) => {
  await ready(page);
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await expect(page.locator('input:not([type="checkbox"]), textarea')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Сохранить демозапрос', exact: true })).toBeDisabled();
  await expect(page.getByTestId('request-offer')).toContainText('O01');
  await page.getByRole('checkbox').check();
  const sends: string[] = [];
  page.on('request', request => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method()) || !new URL(request.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/u)) sends.push(request.url());
  });
  await page.getByRole('button', { name: 'Сохранить демозапрос', exact: true }).evaluate((element: HTMLButtonElement) => { element.click(); element.click(); });
  await expect(page).toHaveURL(/\/request-status\//u);
  await expect(page.getByText('Специалисту ничего не отправлено', { exact: true })).toBeVisible();
  await expect(page.getByText('Реальная запись не создана', { exact: true })).toBeVisible();
  const result = await rows(page); expect(result).toHaveLength(1);
  expect(Object.keys(result[0]).sort()).toEqual(['catalogVersion', 'createdAt', 'id', 'idempotencyKey', 'nonPersonalOfferSnapshot', 'offerId', 'specialistId', 'status', 'updatedAt']);
  expect(Object.keys(result[0].nonPersonalOfferSnapshot as object).sort()).toEqual(['currency', 'durationMinutes', 'format', 'languages', 'priceAmountKzt', 'priceConfirmedAt', 'priceKind', 'title', 'unit']);
  const id = await page.getByTestId('request-id').innerText();
  await page.reload();
  await expect(page.getByTestId('request-id')).toHaveText(id);
  await expect(page.getByTestId('request-metadata')).toHaveAttribute('data-status', 'recorded_demo');
  await page.getByRole('button', { name: 'Отменить демозапрос', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Отменить демозапрос', exact: true }).click();
  await expect(page.getByTestId('request-metadata')).toHaveAttribute('data-status', 'cancelled_demo');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Демозапрос отменён на этом устройстве');
  await expect(page.getByTestId('request-id')).toHaveText(id);
  await expect(page.getByRole('button', { name: 'Отменить демозапрос', exact: true })).toHaveCount(0);
  await page.goto('/request/O01');
  await expect(page.getByRole('link', { name: 'Открыть сохранённый демозапрос' })).toHaveAttribute('href', `/request-status/${id}`);
  expect(await rows(page)).toHaveLength(1); expect(sends).toEqual([]);
});

test('add success then commit abort shows error, no success route or row; reload retries the same key', async ({ page }) => {
  await ready(page); await abortOperation(page, 'add');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Сохранить демозапрос', exact: true }).click();
  await expect(page.locator('[data-request-phase]')).toHaveAttribute('data-request-phase', 'error');
  await expect(page).toHaveURL('/request/O01'); expect(await rows(page)).toHaveLength(0);
  const key = await page.evaluate(() => JSON.parse(sessionStorage.getItem('qoldau.demo-request-attempt')!).idempotencyKey);
  await page.reload();
  await expect(page.locator('[data-request-phase]')).toHaveAttribute('data-request-phase', 'draft');
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await save(page); expect((await rows(page))[0].idempotencyKey).toBe(key);
});

test('uncertain commit checks the same key and resolves to the actual committed record', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function (...args) {
      const request = original.apply(this, args);
      // The DB commits, but the caller misses completion: simulate a lost outcome.
      request.addEventListener('success', () => { this.transaction.oncomplete = null; });
      return request;
    };
  });
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Сохранить демозапрос', exact: true }).click();
  await expect(page.locator('[data-request-phase]')).toHaveAttribute('data-request-phase', 'submitting');
  await expect.poll(async () => (await rows(page)).length).toBe(1);
  await expect(page.getByRole('heading', { level: 1 })).not.toHaveText('Демозапрос сохранён на этом устройстве');
  await expect(page).toHaveURL(/\/request-status\//u, { timeout: 12000 });
  expect(await rows(page)).toHaveLength(1);
});

test('reload during a lost outcome recovers the existing result, never auto inserts', async ({ page }) => {
  await ready(page);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.add;
    IDBObjectStore.prototype.add = function (...args) {
      const request = original.apply(this, args);
      request.addEventListener('success', () => { this.transaction.oncomplete = null; }); return request;
    };
  });
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Сохранить демозапрос', exact: true }).click();
  await expect.poll(async () => (await rows(page)).length).toBe(1);
  await page.reload();
  await page.getByRole('link', { name: 'Открыть сохранённый демозапрос' }).click();
  await expect(page.getByTestId('request-metadata')).toHaveAttribute('data-status', 'recorded_demo');
  expect(await rows(page)).toHaveLength(1);
});

test('failed cancellation keeps confirmed status and offers retry; reload proves rollback', async ({ page }) => {
  await ready(page); await save(page); await abortOperation(page, 'put');
  await page.getByRole('button', { name: 'Отменить демозапрос', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Отменить демозапрос', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Не удалось подтвердить отмену');
  await expect(page.getByTestId('request-metadata')).toHaveAttribute('data-status', 'recorded_demo');
  expect((await rows(page))[0].status).toBe('recorded_demo');
  await page.reload();
  await expect(page.getByTestId('request-metadata')).toHaveAttribute('data-status', 'recorded_demo');
});

test('missing and expired request never create records; expired row is removed at startup', async ({ page }) => {
  await ready(page); await save(page);
  const id = (await rows(page))[0].id as string;
  await page.evaluate(id => new Promise<void>((resolve, reject) => {
    const open = indexedDB.open('qoldau-demo-v1', 1);
    open.onsuccess = () => {
      const db = open.result; const tx = db.transaction('requests', 'readwrite'); const store = tx.objectStore('requests');
      const read = store.get(id); read.onsuccess = () => store.put({ ...read.result, createdAt: new Date(Date.now() - 7 * 86400000 - 1).toISOString() });
      tx.oncomplete = () => { db.close(); resolve(); }; tx.onabort = () => { db.close(); reject(tx.error); };
    };
  }), id);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Демозапрос не найден на этом устройстве');
  expect(await rows(page)).toHaveLength(0);
  await page.goto('/request-status/unknown');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Демозапрос не найден на этом устройстве');
  expect(await rows(page)).toHaveLength(0);
});

test('read failure is not missing or success; denied IndexedDB never saves in memory', async ({ page }) => {
  await page.addInitScript(() => { IDBFactory.prototype.open = () => { throw new DOMException('denied', 'SecurityError'); }; });
  await page.goto('/request-status/unknown');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Не удалось прочитать демозапрос');
  await page.goto('/request/O01');
  await expect(page.locator('[data-request-phase]')).toHaveAttribute('data-request-phase', 'error');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Сохранить демозапрос', exact: true }).click();
  await expect(page.locator('[data-request-phase]')).toHaveAttribute('data-request-phase', 'error');
  await expect(page).toHaveURL('/request/O01');
});

test('cleanup needs confirmation, handles abort and preserves other applications and settings', async ({ page }) => {
  await ready(page); await save(page);
  await page.evaluate(() => { localStorage.setItem('other.app', 'keep'); sessionStorage.setItem('other.app', 'keep'); });
  await page.getByRole('button', { name: 'Очистить демозапросы на этом устройстве', exact: true }).click();
  await page.getByRole('button', { name: 'Оставить данные', exact: true }).click();
  expect(await rows(page)).toHaveLength(1);
  await abortOperation(page, 'clear');
  await page.getByRole('button', { name: 'Очистить демозапросы на этом устройстве', exact: true }).click();
  await page.getByRole('button', { name: 'Удалить демозапросы', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Очистка не подтверждена'); expect(await rows(page)).toHaveLength(1);
  await page.reload();
  await page.getByRole('button', { name: 'Очистить демозапросы на этом устройстве', exact: true }).click();
  await page.getByRole('button', { name: 'Удалить демозапросы', exact: true }).click();
  await expect(page.getByText('Локальные демозапросы удалены.', { exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Демозапрос не найден на этом устройстве');
  expect(await rows(page)).toHaveLength(0);
  expect(await page.evaluate(() => [localStorage.getItem('other.app'), sessionStorage.getItem('other.app'), sessionStorage.getItem('qoldau.demo-request-attempt'), !!sessionStorage.getItem('qoldau.demo-search')])).toEqual(['keep', 'keep', null, true]);
});

test('KK, keyboard, 320px and 200% text: service, status, cancellation and cleanup stay operable', async ({ page }) => {
  await ready(page);
  await page.getByRole('button', { name: 'Қаз', exact: true }).click();
  await expect(page.getByRole('checkbox')).not.toBeChecked();
  await page.getByRole('checkbox').focus(); await page.keyboard.press('Space'); await page.keyboard.press('Tab'); await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Демосұрау осы құрылғыда сақталды');
  await expect(page.getByText('Маманға ештеңе жіберілген жоқ', { exact: true })).toBeVisible();
  for (const width of [320, 844]) {
    await page.setViewportSize({ width, height: width === 320 ? 740 : 390 });
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.evaluate(() => { document.documentElement.style.fontSize = ''; });
  await page.getByRole('button', { name: 'Демосұраудан бас тарту', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Демосұрауды қалдыру', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Демосұраудан бас тарту', exact: true })).toBeFocused();
});

test('uncertain cleanup refreshes S09 instead of leaving a stale saved claim', async ({ page }) => {
  await ready(page); await save(page);
  await page.evaluate(() => {
    const original = IDBObjectStore.prototype.clear;
    IDBObjectStore.prototype.clear = function () {
      const request = original.call(this);
      request.addEventListener('success', () => { this.transaction.oncomplete = null; }); return request;
    };
  });
  await page.getByRole('button', { name: 'Очистить демозапросы на этом устройстве', exact: true }).click();
  await page.getByRole('button', { name: 'Удалить демозапросы', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Очистка не подтверждена', { timeout: 12000 });
  await page.getByRole('button', { name: 'Оставить данные', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Демозапрос не найден на этом устройстве');
  await expect(page.getByText('Локальные демозапросы удалены.', { exact: true })).toHaveCount(0);
  expect(await rows(page)).toHaveLength(0);
});
