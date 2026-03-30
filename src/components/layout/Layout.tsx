import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FilterFlyout } from '../filters/FilterFlyout';
import { useThemeStore } from '../../store/themeStore';

export function Layout() {
  const { theme } = useThemeStore();

  return (
    <div className={theme}>
      <div
        className={`min-h-screen ${
          theme === 'dark' ? 'bg-dark-bg text-white' : 'bg-light-bg text-gray-900'
        }`}
      >
        <Sidebar />
        <Header />
        <FilterFlyout />
        <main className="lg:ml-64 pt-16">
          <div id="dashboard-content" className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
