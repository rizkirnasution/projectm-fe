import React, { useEffect, useState } from 'react';
import TopMenu from '../layouts/TopMenu';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import CreateUserModal from './ModalCreateUser';
import EditUserModal from './ModalUpdateUser';
import DeleteUserModal from './ModalDeleteUser'
import SuccessDialog from '../components/ModalSuccess';

interface User {
    id: string;
    email: string;
    username: string;
    roleId: number;
}

const Users: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreateUserOpen, setCreateUserOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isEditUserOpen, setEditUserOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/user/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const json = await response.json();
            const result = json.data;
            setUsers(result);
        } catch (error) {
            console.error('Error :', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenCreateUser = () => {
        setCreateUserOpen(true);
    };

    const handleCloseModalCreateUser = () => {
        setCreateUserOpen(false);
    };

    const handleCloseSuccessDialog = () => {
        setIsSuccessDialogOpen(false);
        fetchUsers();
    };

    const handleSubmitUser = async (userData: {
        email: string;
        username: string;
        password: string;
        roleId: number;
    }) => {
        try {
            const response = await fetch('http://localhost:5000/api/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Failed ');
            }

            setCreateUserOpen(false);
            setIsSuccessDialogOpen(true);
            fetchUsers();

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleOpenEditUser = (user: User) => {
        setSelectedUser(user);
        setEditUserOpen(true);
    };

    const handleEditUser = async (user) => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (!response.ok) throw new Error('Failed');

            setEditUserOpen(false);

            fetchUsers();

        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleOpenDeleteModal = (userId: string) => {
        setUserIdToDelete(userId);
        setIsDeleteModalOpen(true);
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed ');
            fetchUsers();
        } catch (error) {
            console.error('Error :', error);
        }
    };

    return (
        <div>
            <TopMenu />
            <div className="p-6">
                <div className="flex justify-between items-center mb-4 mt-10 p-4">
                    <h2 className="text-2xl font-bold">Users</h2>
                    <button
                        onClick={handleOpenCreateUser}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Create New User
                    </button>
                </div>
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-4">No</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Username</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && users.length > 0 ? (
                                users.map((user, index) => (
                                    <tr key={user.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                        <td className="p-4">{index + 1}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.username}</td>
                                        <td className="px-6 py-4">
                                            {user.roleId === 1
                                                ? 'PM'
                                                : user.roleId === 2
                                                    ? 'Developer'
                                                    : user.roleId === 3
                                                        ? 'QA'
                                                        : ''}
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleOpenEditUser(user)}
                                                    className="text-blue-600 hover:text-blue-800">
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleOpenDeleteModal(user.id)}
                                                    className="text-red-600 hover:text-red-800">
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-4">
                                        {loading ? 'Loading users...' : 'User Not Found'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <CreateUserModal
                isOpen={isCreateUserOpen}
                onClose={handleCloseModalCreateUser}
                onSubmit={handleSubmitUser}
            />

            {isSuccessDialogOpen && (
                <SuccessDialog onClose={handleCloseSuccessDialog} />
            )}

            {isEditUserOpen && selectedUser && (
                <EditUserModal
                    isOpen={isEditUserOpen}
                    onClose={() => {
                        setEditUserOpen(false);
                        setSelectedUser(null);
                    }}
                    onSubmit={(user) => {
                        handleEditUser(user);
                        setEditUserOpen(false);
                        setSelectedUser(null);
                        setIsSuccessDialogOpen(true);
                    }}
                    user={selectedUser}
                />
            )}

            {isDeleteModalOpen && userIdToDelete && (
                <DeleteUserModal
                    isOpen={isDeleteModalOpen}
                    onConfirm={() => {
                        handleDeleteUser(userIdToDelete);
                        setIsDeleteModalOpen(false);
                        setIsSuccessDialogOpen(true);
                    }}
                    onCancel={() => {
                        setIsDeleteModalOpen(false);
                        setUserIdToDelete(null);
                    }}
                />
            )}

        </div>
    );
};

export default Users;
