import React, { useState, useEffect, ChangeEvent } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { CalendarIcon } from '@heroicons/react/24/outline';

//component menerima props
const CreateTaskModal = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('todo');
    const [selectedContributors, setSelectedContributors] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [collaborators, setCollaborators] = useState([]);
    const [roles, setRoles] = useState({});
    const [fileUpload, setFileUpload] = useState(null)

    //errof validation Form
    const [formErrors, setFormErrors] = useState({
        title: "",
        description: "",
        status: "",
        contributors: "",
        startDate: "",
        endDate: "",
        uploadFiles: ""
    });

    //ambil data user dan role
    useEffect(() => {
        //fetch semua user tp haya menampilkan username dan roleIdnya
        const fetchCollaborators = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/user/username', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                //jika berhasil maka disimpan di state
                const data = await response.json();
                if (data.status === 200) {
                    setCollaborators(data.data);
                }
            } catch (error) {
                console.error('Error : ', error);
            }
        };

        //fetch role
        const fetchRoles = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/role', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
              
                const data = await response.json();
                  //jika berhasil
                if (data.status === 200) {
                    //ambil semua data role agar bisa menampilkan nama role
                    const rolesMap = {};
                    data.data.forEach(role => {
                        rolesMap[role.id] = role.name;
                    });
                    setRoles(rolesMap); //simpan role di state {id:name}
                }
            } catch (error) {
                console.error('Error : ', error);
            }
        };

        fetchCollaborators();
        fetchRoles();
    }, []);

    //validasi dan submit form
    const handleSubmit = (e) => {
        e.preventDefault();//mencegah reload halaman
        let hasError = false;
        const newErrors = { ...formErrors };

        //validasi semua satu per satu untuk kebutuhan formnya
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
        if (!fileUpload) { // Check if file is uploaded
            newErrors.uploadFiles = "Please select a file"; // Update the error message
            hasError = true;
        }

        //kalau ada error, hentikan proses submit
        setFormErrors(newErrors);

        if (hasError) return;

        //simpan ke FormData untuk dikirim ke backend
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("status", status);
        formData.append("contributors", JSON.stringify(selectedContributors));
        formData.append("startDate", startDate.toISOString().split("T")[0]);
        formData.append("endDate", endDate.toISOString().split("T")[0]);
        if (fileUpload) {
            formData.append("file", fileUpload);
        }

        onSubmit(formData);//lempar data ke parent
        onClose();//tutup modal setelah dikirim
    };

    //handler semua untuk memperbaharui state dan menghapus error
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
        setFormErrors({ ...formErrors, title: "" });
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        setFormErrors({ ...formErrors, description: "" });
    };

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
        setFormErrors({ ...formErrors, status: "" });
    };

    const handleContributorsChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, (option) => option.value);
        setSelectedContributors(selected);
        setFormErrors({ ...formErrors, contributors: "" });
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        setFormErrors({ ...formErrors, startDate: "" });
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        setFormErrors({ ...formErrors, endDate: "" });
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setFileUpload(file);
        setFormErrors({ ...formErrors, uploadFiles: "" });
    };

    if (!isOpen) return null;//jika modal false, komponent tidak merender apapun

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
                    <div className="">
                        <label className="block m-0 text-sm text-gray-700">Upload file </label>

                        <label
                            htmlFor="file_input"
                            className="block mb-2 text-sm font-medium text-black dark:text-white"
                        >
                            Upload file
                        </label>
                        <input
                            id="file_input"
                            type="file"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                        />
                        {formErrors.uploadFiles && <p className="text-red-500 text-xs mt-1">{formErrors.uploadFiles}</p>}
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
