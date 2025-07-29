import React, { useState, useEffect } from 'react';

const CreateUserModal = ({ isOpen, onClose, onSubmit }) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/role/', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (data.status === 200) {
                    setRoles(data.data);
                }
            } catch (error) {
                console.error('Error :', error);
            }
        };

        if (isOpen) {
            fetchRoles();
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            email,
            username,
            password,
            roleId: Number(role),
        };

        onSubmit(payload);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-black">Create New User</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded bg-white text-black"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Username</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded bg-white text-black"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded bg-white text-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Role</label>
                        <select
                            className="w-full p-2 border rounded bg-white text-black"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required
                        >
                            <option value="">-- Pilih Role --</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name.toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full md:w-40 rounded px-2 py-2 bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;
