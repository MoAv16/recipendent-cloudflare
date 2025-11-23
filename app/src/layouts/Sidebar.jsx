import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { useAuth } from '../features/auth/hooks/useAuth';
import { useSidebar } from '../contexts/SidebarContext';

export default function Sidebar() {
  const location = useLocation();
  const { userData } = useAuth();
  const { isExpanded, setIsExpanded } = useSidebar();

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
    {
      name: 'Team',
      href: ROUTES.TEAM,
      icon: '/design-assets/icons/vuesaxlinearusersquare.svg',
      active: location.pathname.startsWith('/team')
    },
  ];

  const bottomNavigation = [
    {
      name: 'Einstellungen',
      href: '/settings',
      icon: '/design-assets/icons/vuesaxlinearsetting3.svg',
      active: location.pathname.startsWith('/settings')
    },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-soft flex flex-col z-30 transition-all duration-300 ${
        isExpanded ? 'w-[240px]' : 'w-[104px]'
      }`}
    >
      {/* Logo */}
      <div className={`pt-9 pb-6 flex items-center transition-all duration-300 ${
        isExpanded ? 'px-6 justify-start' : 'flex-col justify-center'
      }`}>
        <div className="w-[46px] h-[46px] bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-2xl font-bold">R</span>
        </div>
        {isExpanded && (
          <span className="ml-3 text-[16px] font-ropa-sans text-black whitespace-nowrap">
            Recipendent
          </span>
        )}
        {!isExpanded && (
          <span className="mt-2 text-[16px] font-ropa-sans text-black">
            Recipendent
          </span>
        )}
      </div>

      {/* Toggle Button */}
      <div className={`flex justify-center mb-4 ${isExpanded ? 'px-6' : ''}`}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-10 h-10 rounded-lg bg-purple-light hover:bg-purple-200 flex items-center justify-center transition-colors"
          title={isExpanded ? 'Einklappen' : 'Ausklappen'}
        >
          <svg
            className={`w-5 h-5 text-primary transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className={`flex-1 flex flex-col gap-3 ${isExpanded ? 'px-4' : 'items-center'}`}>
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              rounded-lg flex items-center transition-all duration-200
              ${isExpanded ? 'px-4 py-3 gap-3' : 'w-[58px] h-[58px] justify-center'}
              ${item.active
                ? 'bg-primary shadow-[0_8px_12px_0_rgba(134,144,232,0.3)]'
                : 'hover:bg-gray-100'
              }
            `}
            title={!isExpanded ? item.name : undefined}
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-6 h-6 flex-shrink-0"
              style={item.active
                ? { filter: 'brightness(0) invert(1)' }
                : { filter: 'invert(1) brightness(0) opacity(0.8)' }
              }
            />
            {isExpanded && (
              <span className={`font-cabin font-semibold whitespace-nowrap ${
                item.active ? 'text-white' : 'text-text-dark'
              }`}>
                {item.name}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className={`flex flex-col gap-3 mb-6 ${isExpanded ? 'px-4' : 'items-center'}`}>
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              rounded-lg flex items-center transition-all duration-200 hover:bg-gray-100
              ${isExpanded ? 'px-4 py-3 gap-3' : 'w-10 h-10 justify-center'}
            `}
            title={!isExpanded ? item.name : undefined}
          >
            <img
              src={item.icon}
              alt={item.name}
              className={isExpanded ? 'w-6 h-6' : 'w-6 h-6'}
              style={{ filter: 'invert(1) brightness(0) opacity(0.8)' }}
            />
            {isExpanded && (
              <span className="font-cabin font-semibold text-text-dark whitespace-nowrap">
                {item.name}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* User Profile */}
      <div className={`mb-12 ${isExpanded ? 'px-4' : 'flex justify-center'}`}>
        <Link to="/account">
          <div className={`flex items-center gap-3 transition-all duration-200 ${
            isExpanded ? 'hover:bg-gray-100 rounded-lg p-2' : ''
          }`}>
            <div className="w-[52px] h-[52px] rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {userData?.first_name?.[0]}{userData?.last_name?.[0]}
            </div>
            {isExpanded && (
              <div className="flex flex-col">
                <span className="font-cabin font-semibold text-text-dark text-sm">
                  {userData?.first_name} {userData?.last_name}
                </span>
                <span className="font-cabin text-xs text-text-gray">
                  Mein Konto
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}
