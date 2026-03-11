import { mockResources } from '../../lib/mockData';
import type { Resource } from '../../lib/types';

export async function listResources(): Promise<Resource[]> {
  return mockResources;
}
