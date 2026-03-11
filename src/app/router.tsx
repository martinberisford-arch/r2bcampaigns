import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { OverviewPage } from './screens/OverviewPage';
import { ProjectsPage } from './screens/ProjectsPage';
import { CalendarPage } from './screens/CalendarPage';
import { ResourcesPage } from './screens/ResourcesPage';
import { StoriesPage } from './screens/StoriesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'calendar', element: <CalendarPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'stories', element: <StoriesPage /> }
    ]
  }
]);
