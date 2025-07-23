import React from 'react';
import type { RoleData } from '../types.ts';
import { PlusIcon } from './icons.tsx';

interface TabBarProps {
  roles: RoleData[];
  activeRoleId: string;
  onSelectRole: (id: string) => void;
  onAddRoleClick: () => void;
}

const TabBar: React.FC<TabBarProps> = ({ roles, activeRoleId, onSelectRole, onAddRoleClick }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 mb-4 no-print">
      <div className="border-b border-slate-300 flex items-center">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => onSelectRole(role.id)}
              className={`
                ${
                  role.id === activeRoleId
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              `}
            >
              {role.roleName}
            </button>
          ))}
        </nav>
        <button
            onClick={onAddRoleClick}
            className="ml-auto flex items-center justify-center w-9 h-9 bg-slate-200 text-slate-600 rounded-full hover:bg-slate-300 hover:text-slate-800 transition-all"
            aria-label="Add new role"
        >
            <PlusIcon className="w-5 h-5"/>
        </button>
      </div>
    </div>
  );
};

export default TabBar;