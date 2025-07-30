import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@heroicons/react/24/outline';

const CreateTaskModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [selectedContributors, setSelectedContributors] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [collaborators, setCollaborators] = useState([]);
    const [roles, setRoles] = useState({});
    const [formErrors, setFormErrors] = useState({
        title: "",
        description: "",
        status: "",
        contributors: "",
        startDate: "",
        endDate: ""
    });

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
        let hasError = false;
        const newErrors = {...formErrors};

        if (!title) {
            newErrors.title = "Please fill title";
            hasError = true;
        }
        if (!description) {
            newErrors.description = "Please fill description";
            hasError = true;
        }
        if (!status) {
            newErrors.status = "Please select status";
            hasError = true;
        }
        if (selectedContributors.length === 0) {
            newErrors.contributors = "Please select at least one contributor";
            hasError = true;
        }
        if (!startDate) {
            newErrors.startDate = "Please select start date";
            hasError = true;
        }
        if (!endDate) {
            newErrors.endDate = "Please select end date";
            hasError = true;
        }

        setFormErrors(newErrors);

        if (hasError) return;

        const taskData = {
            title,
            description,
            status,
            contributors: selectedContributors,
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };

        onSubmit(taskData);
        onClose();
    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setFormErrors({...formErrors, title: ""});
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setFormErrors({...formErrors, description: ""});
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setFormErrors({...formErrors, status: ""});
    };

    const handleContributorsChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedContributors(selected);
        setFormErrors({...formErrors, contributors: ""});
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        setFormErrors({...formErrors, startDate: ""});
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        setFormErrors({...formErrors, endDate: ""});
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
                            onChange={handleTitleChange}
                            className={`w-full p-2 border rounded bg-white text-black ${formErrors.title ? 'border-red-500' : ''}`}
                        />
                        {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={handleDescriptionChange}
                            className={`w-full p-2 border rounded bg-white text-black ${formErrors.description ? 'border-red-500' : ''}`}
                        />
                        {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Status</label>
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            className={`w-full p-2 border rounded bg-white text-black ${formErrors.status ? 'border-red-500' : ''}`}
                        >
                            <option value="todo">Todo</option>
                            <option value="on progress">On Progress</option>
                            <option value="done">Done</option>
                        </select>
                        {formErrors.status && <p className="text-red-500 text-xs mt-1">{formErrors.status}</p>}
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700">Contributors</label>
                        <select
                            multiple
                            value={selectedContributors}
                            onChange={handleContributorsChange}
                            className={`w-full p-2 border rounded bg-white text-black ${formErrors.contributors ? 'border-red-500' : ''}`}
                        >
                            {collaborators.map((c) => (
                                <option key={c.username} value={c.username}>
                                    {c.username} - {roles[c.roleId]?.toUpperCase()}
                                </option>
                            ))}
                        </select>
                        {formErrors.contributors && <p className="text-red-500 text-xs mt-1">{formErrors.contributors}</p>}
                    </div>
                    <div className="flex gap-2">
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">Start Date</label>
                            <div className="relative">
                                <DatePicker
                                    selected={startDate}
                                    onChange={handleStartDateChange}
                                    dateFormat="dd-MM-yyyy"
                                    className={`w-full p-2 pr-10 border rounded bg-white text-black ${formErrors.startDate ? 'border-red-500' : ''}`}
                                />
                                <CalendarIcon className="absolute right-2 top-1/2 h-5 w-5 text-gray-500 transform -translate-y-1/2 pointer-events-none" />
                            </div>
                            {formErrors.startDate && <p className="text-red-500 text-xs mt-1">{formErrors.startDate}</p>}
                        </div>
                        <div className="w-1/2">
                            <label className="block text-sm text-gray-700">End Date</label>
                            <div className="relative">
                                <DatePicker
                                    selected={endDate}
                                    onChange={handleEndDateChange}
                                    dateFormat="dd-MM-yyyy"
                                    className={`w-full p-2 pr-10 border rounded bg-white text-black ${formErrors.endDate ? 'border-red-500' : ''}`}
                                />
                                <CalendarIcon className="absolute right-2 top-1/2 h-5 w-5 text-gray-500 transform -translate-y-1/2 pointer-events-none" />
                            </div>
                            {formErrors.endDate && <p className="text-red-500 text-xs mt-1">{formErrors.endDate}</p>}
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
