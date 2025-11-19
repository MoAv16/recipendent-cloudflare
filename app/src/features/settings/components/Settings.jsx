import { useState } from 'react';
import ProfileSettings from './ProfileSettings';
import CompanySettings from './CompanySettings';
import SecuritySettings from './SecuritySettings';
import SupportTicketForm from '../../support/components/SupportTicketForm';
import { useAuth } from '../../auth/hooks/useAuth';

export default function Settings() {
  const { isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profil', icon: '👤' },
    ...(isAdmin ? [{ id: 'company', label: 'Firma', icon: '🏢' }] : []),
    { id: 'security', label: 'Sicherheit', icon: '🔒' },
    { id: 'support', label: 'Support', icon: '💬' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Einstellungen</h1>
        <p className="mt-1 text-sm text-gray-600">
          Verwalte deine persönlichen und Unternehmenseinstellungen
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'profile' && <ProfileSettings />}
          {activeTab === 'company' && <CompanySettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'support' && <SupportTicketForm />}
        </div>
      </div>
    </div>
  );
}
