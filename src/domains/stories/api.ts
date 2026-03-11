import { mockStories } from '../../lib/mockData';
import type { Story } from '../../lib/types';

export async function listStories(): Promise<Story[]> {
  return mockStories;
}
