import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@heroicons/react/24/outline'

const CreateTaskModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [selectedContributors, setSelectedContributors] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [collaborators, setCollaborators] = useState([]);
    const [roles, setRoles] = useState({});

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/user/username', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                if (data.status === 200) {
                    setCollaborators(data.data);
                }
            } catch (error) {
                console.error('Error : ', error);
            }
        };

        const fetchRoles = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/role', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                if (data.status === 200) {

                    const rolesMap = {};
                    data.data.forEach(role => {
                        rolesMap[role.id] = role.name;
                    });
                    setRoles(rolesMap);
                }
            } catch (error) {
                console.error('Error : ', error);
            }
        };

        fetchCollaborators();
        fetchRoles();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskData = {
            title,
            description,
            status,
            contributors: selectedContributors,
            startDate: startDate,
            endDate: endDate
        };

        onSubmit(taskData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-black">Create New Task</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">✕</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-700">Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-black"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border rounded bg-white text-black"
                        >
                            <option value="todo">Todo</option>
                            <option value="on progress">On Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Contributors</label>
                        <select
                            multiple
                            value={selectedContributors}
                            onChange={(e) =>
                                setSelectedContributors(Array.from(e.target.selectedOptions, (option) => option.value))
                            }
                            className="w-full p-2 border rounded bg-white text-black"
                        >
                            {collaborators.map((c) => (
                                <option key={c.username} value={c.username}>
                                    {c.username} - {roles[c.roleId].toUpperCase()}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">Start Date</label>
                            <div className="relative">
                                <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="dd-MM-yyyy"
                                className="w-full p-2 pr-10 border rounded bg-white text-black"
                                />
                                <CalendarIcon className="absolute right-2 top-1/2 h-5 w-5 text-gray-500 transform -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">End Date</label>
                            <div className="relative">
                                <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="dd-MM-yyyy"
                                className="w-full p-2 pr-10 border rounded bg-white text-black"
                                />
                                <CalendarIcon className="absolute right-2 top-1/2 h-5 w-5 text-gray-500 transform -translate-y-1/2 pointer-events-none" />
                            </div>
                        </div>
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

export default CreateTaskModal;
