import React, { useState, useEffect } from 'react';

//component update modal dengan props
const UpdateUserModal = ({ isOpen, onClose, onSubmit, user }) => {
    //state untuk menyimpan fields dari form
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [roles, setRoles] = useState([]);

    //untuk mengisi form dg data user saat modal dibuka
    useEffect(() => {
        if (user) {
            //jika user ada maka isi dg yg tersedia 
            setEmail(user.email || '');
            setUsername(user.username || '');
            setPassword('');
            setRole(user.roleId?.toString() || '');
        }
    }, [user]); //dirender apabila user berubah

    //untuk mengambil data role untuk dimapping di dropwdown
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
                    setRoles(data.data);//set role jika berhasil
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (isOpen) {
            fetchRoles();//jalankan hanya saat modal dibuka
        }
    }, [isOpen]);

    //func untuk submit form update
    const handleSubmit = (e) => {
        e.preventDefault();//mencegah reload halaman saat submit

        const payload = {
            id: user.id, //id user yg akan diupdate
            email,
            username,
            password: password || undefined,//jika password tidak diisi tidak dikirim
            roleId: Number(role),//convert to number
        };

        onSubmit(payload);//panggil fungsi onSubmit dari parent
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-black">Edit User</h2>
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
                        <label className="block text-sm text-gray-700">Password (kosongkan jika tidak ingin ubah)</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded bg-white text-black"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserModal;
