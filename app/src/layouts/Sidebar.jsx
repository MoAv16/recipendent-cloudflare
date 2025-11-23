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
      <div className="pt-9 pb-6 px-6 flex items-center relative">
        <div className="w-[46px] h-[46px] bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-2xl font-bold">R</span>
        </div>
        <span
          className={`ml-3 text-[16px] font-ropa-sans text-black whitespace-nowrap transition-opacity duration-300 ${
            isExpanded ? 'opacity-100 delay-150' : 'opacity-0'
          }`}
        >
          Recipendent
        </span>
      </div>

      {/* Toggle Button - Fixed to right edge */}
      <div className="relative mb-4 h-10">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute right-4 w-10 h-10 rounded-lg bg-purple-light hover:bg-purple-200 flex items-center justify-center transition-colors"
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
      <nav className="flex-1 flex flex-col gap-3 px-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              rounded-lg flex items-center transition-all duration-200 h-[58px]
              ${isExpanded ? 'px-4' : 'justify-center'}
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
            <span
              className={`ml-3 font-cabin font-semibold whitespace-nowrap transition-opacity duration-300 ${
                isExpanded ? 'opacity-100 delay-150' : 'opacity-0 w-0'
              } ${item.active ? 'text-white' : 'text-text-dark'}`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <div className="flex flex-col gap-3 mb-6 px-4">
        {bottomNavigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className={`
              rounded-lg flex items-center transition-all duration-200 hover:bg-gray-100 h-10
              ${isExpanded ? 'px-4' : 'justify-center'}
            `}
            title={!isExpanded ? item.name : undefined}
          >
            <img
              src={item.icon}
              alt={item.name}
              className="w-6 h-6 flex-shrink-0"
              style={{ filter: 'invert(1) brightness(0) opacity(0.8)' }}
            />
            <span
              className={`ml-3 font-cabin font-semibold text-text-dark whitespace-nowrap transition-opacity duration-300 ${
                isExpanded ? 'opacity-100 delay-150' : 'opacity-0 w-0'
              }`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </div>

      {/* User Profile */}
      <div className="mb-12 px-4">
        <Link to="/account">
          <div className={`flex items-center gap-3 transition-all duration-200 ${
            isExpanded ? 'hover:bg-gray-100 rounded-lg p-2' : 'justify-center'
          }`}>
            <div className="w-[52px] h-[52px] rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
              {userData?.first_name?.[0]}{userData?.last_name?.[0]}
            </div>
            <div
              className={`flex flex-col transition-opacity duration-300 ${
                isExpanded ? 'opacity-100 delay-150' : 'opacity-0 w-0'
              }`}
            >
              <span className="font-cabin font-semibold text-text-dark text-sm">
                {userData?.first_name} {userData?.last_name}
              </span>
              <span className="font-cabin text-xs text-text-gray">
                Mein Konto
              </span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
