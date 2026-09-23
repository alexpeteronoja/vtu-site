import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Edit2, 
  Trash2, 
  X, 
  AlertTriangle,
  UserCheck,
  ShieldAlert
} from 'lucide-react';
import { useAllUsers } from '../../datahooks/adminHooks';
import { useUpdateUser, useDeleteUser } from '../../datahooks/userHooks';

const ManageUsers = () => {
  const { data: usersData, isLoading } = useAllUsers({ limit: 500, sort: '-createdAt' });
  const usersList = usersData?.user || [];

  const { updateUserMutate, isPending: updatePending } = useUpdateUser();
  const { deleteUserMutate, isPending: deletePending } = useDeleteUser();

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  // Selected user
  const [selectedUser, setSelectedUser] = useState(null);

  // Form setup
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm();

  // Open Edit Modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setValue('fullname', user.fullname);
    setValue('email', user.email);
    setValue('phone', user.phone);
    setValue('role', user.role);
    setValue('walletBalance', user.walletBalance || 0);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    reset();
  };

  // Open Delete Modal
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedUser(null);
  };

  // Submit Handler
  const onSubmitForm = (data) => {
    const payload = {
      ...data,
      walletBalance: Number(data.walletBalance)
    };

    updateUserMutate(
      { id: selectedUser._id || selectedUser.id, data: payload },
      { onSuccess: closeEditModal }
    );
  };

  // Delete Handler
  const confirmDelete = () => {
    if (selectedUser) {
      deleteUserMutate(selectedUser._id || selectedUser.id, {
        onSuccess: closeDeleteModal
      });
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary">Manage Users</h1>
          <p className="text-gray-500 mt-1">View and manage platform users.</p>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-max">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-sm border-b border-gray-100">
                <th className="p-4 font-medium">User Details</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Wallet Bal (₦)</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </td>
                </tr>
              ) : usersList.length > 0 ? (
                usersList.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{user.fullname}</p>
                      <p className="text-xs text-gray-500 truncate max-w-[150px]">{user._id || user.id}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      <p className="text-xs text-gray-500">{user.phone}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider flex items-center gap-1 w-max ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role === 'admin' ? <ShieldAlert className="w-3 h-3" /> : <UserCheck className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-gray-900">
                      ₦{(user.walletBalance || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => openEditModal(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(user)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* EDIT MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-8 shadow-2xl relative">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-secondary">Edit User</h2>
              <button onClick={closeEditModal} className="text-gray-400 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmitForm)} className="p-6">
              <div className="space-y-4">
                
                {/* Fullname */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${errors.fullname ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('fullname', { required: 'Full name is required' })}
                  />
                  {errors.fullname && <p className="text-red-500 text-xs mt-1">{errors.fullname.message}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('email', { required: 'Email is required' })}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Role */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select 
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                      {...register('role', { required: 'Role is required' })}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>}
                  </div>

                  {/* Wallet Balance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Balance (₦)</label>
                    <input
                      type="number"
                      step="0.01"
                      className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-primary outline-none ${errors.walletBalance ? 'border-red-500' : 'border-gray-300'}`}
                      {...register('walletBalance', { required: 'Wallet balance is required' })}
                    />
                    {errors.walletBalance && <p className="text-red-500 text-xs mt-1">{errors.walletBalance.message}</p>}
                  </div>
                </div>

              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={closeEditModal}
                  className="px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={updatePending}
                  className={`px-6 py-3 rounded-xl font-bold text-white bg-primary shadow-md hover:bg-orange-600 transition-colors ${updatePending ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {updatePending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden text-center p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete User</h3>
            <p className="text-gray-500 mb-8">
              Are you sure you want to delete <span className="font-bold text-gray-800">{selectedUser?.fullname}</span>? This will permanently remove their account and wallet balance.
            </p>
            <div className="flex gap-3 justify-center">
              <button 
                onClick={closeDeleteModal}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                disabled={deletePending}
                className={`flex-1 px-6 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md transition-colors ${deletePending ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {deletePending ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManageUsers;
