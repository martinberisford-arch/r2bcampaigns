import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from './layouts/AppShell';
import { CalendarPage } from './screens/CalendarPage';
import { HomePage } from './screens/HomePage';
import { OutcomesPage } from './screens/OutcomesPage';
import { ProjectDetailPage } from './screens/ProjectDetailPage';
import { ProjectsPage } from './screens/ProjectsPage';
import { ResourcesPage } from './screens/ResourcesPage';
import { SettingsPage } from './screens/SettingsPage';
import { SignInPage } from './screens/SignInPage';

export const router = createBrowserRouter([
  { path: '/sign-in', element: <SignInPage /> },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'projects/:projectId', element: <ProjectDetailPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'outcomes', element: <OutcomesPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'settings', element: <SettingsPage /> }
    ]
  }
]);
