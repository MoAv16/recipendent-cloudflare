import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { useAuth } from '../features/auth/hooks/useAuth';

export default function Sidebar() {
  const location = useLocation();
  const { userData } = useAuth();

  const navigation = [
    {
      name: 'Dashboard',
      href: ROUTES.DASHBOARD,
      icon: '/design-assets/icons/vuesaxboldbox.svg',
      active: location.pathname === '/dashboard' || location.pathname === '/'
    },
    {
      name: 'Aufträge',
      href: ROUTES.ORDERS,
      icon: '/design-assets/icons/vuesaxlinearrouting2.svg',
      active: location.pathname.startsWith('/orders')
    },
    {
      name: 'Nachrichten',
      href: '/messages',
      icon: '/design-assets/icons/vuesaxlinearmessages.svg',
      active: location.pathname.startsWith('/messages')
    },
    {
      name: 'Notizen',
      href: '/notes',
      icon: '/design-assets/icons/vuesaxlinearnote.svg',
      active: location.pathname.startsWith('/notes')
    },
    {
      name: 'Rezepte',
      href: ROUTES.RECIPES,
      icon: '/design-assets/icons/vuesaxlinearemptywallettick.svg',
      active: location.pathname.startsWith('/recipes')
    },
    {
      name: 'Kalender',
      href: '/calendar',
      icon: '/design-assets/icons/vuesaxlinearcalendartick.svg',
      active: location.pathname.startsWith('/calendar')
    },
  ];

  const bottomNavigation = [
    {
      name: 'Team',
      href: ROUTES.TEAM,
      icon: '/design-assets/icons/vuesaxlinearusersquare.svg',
      active: location.pathname.startsWith('/team')
    },
    {
      name: 'Einstellungen',
      href: ROUTES.SETTINGS,
      icon: '/design-assets/icons/vuesaxlinearsetting3.svg',
      active: location.pathname.startsWith('/settings')
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-[104px] bg-white border-r border-gray-200 shadow-soft flex flex-col items-center z-30">
      {/* Logo */}
      <div className="pt-9 pb-6 flex flex-col items-center">
        <div className="w-[46px] h-[46px] mb-2 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white text-2xl font-bold">R</span>
        </div>
        <span className="text-[16px] font-ropa-sans text-black">
          Recipendent
        </span>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-5 mt-12">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              w-[58px] h-[58px] rounded-lg flex items-center justify-center
              transition-all duration-200
              ${item.active
                ? 'bg-primary shadow-[0_8px_12px_0_rgba(134,144,232,0.3)]'
                : 'hover:bg-gray-100'
              }
            `}
            title={item.name}
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-6 h-6"
              style={item.active
                ? { filter: 'brightness(0) invert(1)' }
                : { filter: 'invert(1) brightness(0) opacity(0.8)' }
              }
            />
          </Link>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="flex flex-col items-center gap-5 mb-6">
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="w-6 h-6"
            title={item.name}
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-full h-full"
              style={{ filter: 'invert(1) brightness(0) opacity(0.8)' }}
            />
          </Link>
        ))}
      </div>

      {/* User Profile */}
      <div className="mb-12">
        <Link to={ROUTES.SETTINGS}>
          <div className="w-[52px] h-[52px] rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
            {userData?.first_name?.[0]}{userData?.last_name?.[0]}
          </div>
        </Link>
      </div>
    </div>
  );
}
