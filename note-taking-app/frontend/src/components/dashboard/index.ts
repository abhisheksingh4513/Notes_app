// Explicit import and export to help TypeScript resolve the Dashboard module
import DashboardModule from './Dashboard';
// Support both ES default export and CommonJS default property
const Dashboard = (DashboardModule as any)?.default ?? DashboardModule;

export default Dashboard;
