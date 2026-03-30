import { useState } from 'react';
import { Shield, Trash2, Plus } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useOrgStore } from '../store/orgStore';
import { useThemeStore } from '../store/themeStore';

export function Settings() {
  const { token, baseUrl, demoMode, setToken, setBaseUrl, setDemoMode } = useAuthStore();
  const { savedOrgs, addOrg, removeOrg } = useOrgStore();
  const { theme } = useThemeStore();
  const isDark = theme === 'dark';

  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] = useState<'org' | 'enterprise'>('org');

  function handleAddOrg() {
    if (newOrgName.trim()) {
      addOrg({ type: newOrgType, name: newOrgName.trim() });
      setNewOrgName('');
    }
  }

  const cardClasses = `rounded-xl border p-6 ${
    isDark ? 'bg-dark-card border-dark-border' : 'bg-light-card border-light-border'
  }`;
  const labelClasses = `block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`;
  const inputClasses = `w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors ${
    isDark
      ? 'bg-dark-surface border-dark-border text-white placeholder-gray-500 focus:border-neon-cyan'
      : 'bg-light-surface border-light-border text-gray-900 placeholder-gray-400 focus:border-neon-cyan'
  }`;

  return (
    <div className="max-w-2xl">
      <h1 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
        Settings
      </h1>

      <div className="space-y-6">
        {/* Authentication */}
        <div className={cardClasses}>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={18} className="text-neon-cyan" />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Authentication
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className={labelClasses}>Personal Access Token</label>
              <input
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className={inputClasses}
              />
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Requires <code className="text-neon-cyan">copilot</code>,{' '}
                <code className="text-neon-cyan">manage_billing:copilot</code>, and{' '}
                <code className="text-neon-cyan">read:org</code> scopes.
              </p>
            </div>

            <div>
              <label className={labelClasses}>Base URL</label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.github.com"
                className={inputClasses}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Demo Mode
                </label>
                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Use mock data without a token
                </p>
              </div>
              <button
                onClick={() => setDemoMode(!demoMode)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  demoMode ? 'bg-neon-cyan' : isDark ? 'bg-dark-border' : 'bg-light-border'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform shadow-sm ${
                    demoMode ? 'translate-x-5.5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Organizations */}
        <div className={cardClasses}>
          <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Organizations
          </h2>

          {/* Add new org */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Organization name"
              className={`flex-1 ${inputClasses}`}
              onKeyDown={(e) => e.key === 'Enter' && handleAddOrg()}
            />
            <select
              value={newOrgType}
              onChange={(e) => setNewOrgType(e.target.value as 'org' | 'enterprise')}
              className={`px-3 py-2 rounded-xl border text-sm outline-none ${
                isDark
                  ? 'bg-dark-surface border-dark-border text-white'
                  : 'bg-light-surface border-light-border text-gray-900'
              }`}
            >
              <option value="org">Org</option>
              <option value="enterprise">Enterprise</option>
            </select>
            <button
              onClick={handleAddOrg}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-neon-cyan text-black text-sm font-medium hover:bg-neon-cyan/80 transition-colors"
            >
              <Plus size={14} />
              Add
            </button>
          </div>

          {/* Saved orgs list */}
          {savedOrgs.length === 0 ? (
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              No organizations added. Add one to get started.
            </p>
          ) : (
            <div className="space-y-2">
              {savedOrgs.map((org) => (
                <div
                  key={org.name}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl ${
                    isDark ? 'bg-dark-surface' : 'bg-light-surface'
                  }`}
                >
                  <div>
                    <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {org.name}
                    </span>
                    <span className={`text-xs ml-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {org.type}
                    </span>
                  </div>
                  <button
                    onClick={() => removeOrg(org.name)}
                    className="p-1 text-gray-400 hover:text-neon-magenta transition-colors"
                    aria-label={`Remove ${org.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
