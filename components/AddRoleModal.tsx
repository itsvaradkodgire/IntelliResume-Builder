import React, { useState } from 'react';
import type { RoleData } from '../types.ts';

interface AddRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRole: (roleName: string, copyFromId?: string) => void;
  existingRoles: RoleData[];
}

const AddRoleModal: React.FC<AddRoleModalProps> = ({ isOpen, onClose, onAddRole, existingRoles }) => {
  const [roleName, setRoleName] = useState('');
  const [copyFromId, setCopyFromId] = useState<string>('__none__');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roleName.trim()) {
      onAddRole(roleName, copyFromId === '__none__' ? undefined : copyFromId);
      setRoleName('');
      setCopyFromId('__none__');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 no-print">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Create New Role Resume</h2>
        <p className="text-slate-600 mb-6">Create a new tailored resume. You can start fresh or copy the content from an existing role.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="roleName" className="block text-sm font-medium text-slate-700 mb-1">Role Name</label>
            <input
              type="text"
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="copyFrom" className="block text-sm font-medium text-slate-700 mb-1">Start with content from...</label>
            <select
              id="copyFrom"
              value={copyFromId}
              onChange={(e) => setCopyFromId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="__none__">Start with a blank slate</option>
              {existingRoles.map(role => (
                <option key={role.id} value={role.id}>Copy from "{role.roleName}"</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300" disabled={!roleName.trim()}>
              Create Resume
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoleModal;