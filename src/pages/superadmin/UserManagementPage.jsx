import React, { useState } from 'react';
import { Users, Plus, Search, Filter, Shield, CheckCircle2, XCircle, MoreVertical, Edit2, Key } from 'lucide-react';
import { INITIAL_USERS } from '../../data/adminData';
import { Modal } from '../../components/common/Modal';
import { useToast } from '../../context/ToastContext';

export const UserManagementPage = () => {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);
  const { showToast } = useToast();

  // Add User Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('general_user');
  const [newDept, setNewDept] = useState('Department of Physical Science');

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== 'All' && u.role !== roleFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
    }
    return true;
  });

  const handleToggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updated = u.status === 'Active' ? 'Suspended' : 'Active';
          showToast(`Account status for ${u.name} set to ${updated}`, 'info');
          return { ...u, status: updated };
        }
        return u;
      })
    );
  };

  const handleResetPassword = (name) => {
    showToast(`Password reset link dispatched to ${name}'s university email`, 'success');
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: newName,
      email: newEmail,
      role: newRole,
      roleLabel: newRole === 'general_user' ? 'General User / Staff' : newRole === 'technician' ? 'Technician' : 'Department Admin',
      department: newDept,
      faculty: 'Faculty of Applied Science',
      status: 'Active',
      lastLogin: 'Never',
      phone: '+94 24 222 0000'
    };

    setUsers([newUser, ...users]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
    showToast(`User account created for ${newName}`, 'success');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-card border border-brand-border shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-brand-text">
            User Directory & Access Control
          </h1>
          <p className="text-xs text-brand-text-secondary mt-0.5">
            Manage institutional credentials, assign operational maintenance roles, and enforce security policies.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New User</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-card border border-brand-border p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full pl-9 pr-3 py-2 text-xs text-brand-text bg-slate-50 border border-brand-border rounded-lg outline-none focus:bg-white focus:border-brand-blue"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-xs border border-brand-border rounded-lg bg-white outline-none"
          >
            <option value="All">All Roles</option>
            <option value="general_user">General Staff</option>
            <option value="dept_admin">Department Admin / HOD</option>
            <option value="technician">Technician</option>
            <option value="store_keeper">Store Keeper</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-card border border-brand-border shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-brand-border text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">User Name</th>
                <th className="py-3 px-4">Institutional Email</th>
                <th className="py-3 px-4">System Role</th>
                <th className="py-3 px-4">Faculty / Division</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/70">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-bold text-brand-text">{user.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{user.phone}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      {user.roleLabel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {user.department}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        user.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      <span>{user.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {user.lastLogin}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                    <button
                      onClick={() => handleResetPassword(user.name)}
                      className="p-1 text-slate-400 hover:text-brand-blue rounded"
                      title="Dispatch Password Reset"
                    >
                      <Key className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`px-2 py-1 text-[11px] font-medium rounded border ${
                        user.status === 'Active'
                          ? 'border-slate-200 text-rose-600 hover:bg-rose-50'
                          : 'border-slate-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Provision New University Account"
          subtitle="Add an authorized employee or technician to the Maintenance Request System"
          footer={
            <>
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-slate-300 text-xs font-semibold text-slate-700 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateUser}
                className="px-5 py-2 bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Create Account
              </button>
            </>
          }
        >
          <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-brand-text mb-1">Full Name & Title</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Dr. A. Vasanthakumar"
                className="w-full p-2.5 border border-brand-border rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-brand-text mb-1">University Email</label>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="vasanth@vau.ac.lk"
                className="w-full p-2.5 border border-brand-border rounded-lg outline-none font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-brand-text mb-1">Role Assignment</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full p-2.5 border border-brand-border rounded-lg outline-none"
                >
                  <option value="general_user">General Staff / Academic</option>
                  <option value="dept_admin">Department Admin / HOD</option>
                  <option value="technician">Technician / Specialist</option>
                  <option value="store_keeper">Store Keeper</option>
                  <option value="super_admin">System Super Admin</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-brand-text mb-1">Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full p-2.5 border border-brand-border rounded-lg outline-none"
                >
                  <option>Department of Physical Science</option>
                  <option>Department of Bio-Science</option>
                  <option>Department of ICT</option>
                  <option>Works & Maintenance Division</option>
                  <option>Central Maintenance Stores</option>
                </select>
              </div>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
