import { describe, it, beforeEach, expect, vi } from 'vitest';
import { fetchCrewTabs, updateCrewTabs, type CrewTab } from '../src/lib/crew';

declare global {
  var fetch: any;
}

describe('crew tab api', () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  it('fetchCrewTabs requests tabs', async () => {
    (global.fetch as any).mockResolvedValue({ ok: true, json: async () => [] });
    await fetchCrewTabs('1');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/crews/1/tabs'),
      expect.objectContaining({ cache: 'no-store' })
    );
  });

  it('updateCrewTabs sends PUT with body', async () => {
    (global.fetch as any).mockResolvedValue({ ok: true, json: async () => [] });
    const tabs: CrewTab[] = [
      { id: 1, crewId: 1, title: 'Posts', type: 'posts', isVisible: true, order: 0 },
    ];
    await updateCrewTabs('2', tabs);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/crews/2/tabs'),
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tabs),
      })
    );
  });
});
