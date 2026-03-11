export const queryKeys = {
  projects: ['projects'] as const,
  project: (id: string) => ['projects', id] as const,
  actions: ['actions'] as const,
  calendar: ['calendar'] as const,
  outcomes: ['outcomes'] as const,
  resources: ['resources'] as const,
  profile: ['profile'] as const
};
