import React, { useEffect, useState } from 'react';
import TopMenu from '../layouts/TopMenu/index';
import CreateTaskModal from './ModalCreateNewTask';
import UpdateTaskModal from './ModalUpdateTask';
import DeleteConfirmDialog from './ModalDeleteTask';
import SuccessDialog from '../components/ModalSuccess';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Task {
    id: string;
    startDate: string;
    endDate: string;
    title: string;
    description: string;
    status: 'todo' | 'on progress' | 'done';
    contributors: string[];
}

const Task: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);

    //pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem('role');
    const isPM = userRole === 'pm';

    useEffect(() => {
        fetchTasks();
    }, [token, currentPage]);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/task/?page=${currentPage}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed');
            }

            const data = await response.json();

            const parsedTasks = data.data.map((task: any) => ({
                ...task,
                contributors: JSON.parse(task.contributors),
            }));
            setTasks(parsedTasks);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error fetching:", error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/task/search?keyword=${searchKeyword}&page=${currentPage}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed search');
            }

            const data = await response.json();

            const parsedTasks = data.data.map((task: any) => ({
                ...task,
                contributors: JSON.parse(task.contributors),
            }));
            setTasks(parsedTasks);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error("Error :", error);
        }
    };

    const handleOpenModalCreate = () => {
        setIsModalOpen(true);
    };

    const handleCloseModalCreate = () => {
        setIsModalOpen(false);
    };

    const handleSubmitTask = async (taskData: {
        title: string;
        description: string;
        status: string;
        contributors: string[];
        startDate: string,
        endDate: string,
        dueDate: string;
    }) => {
        try {
            const response = await fetch('http://localhost:5000/api/task', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(taskData),
            });

            if (!response.ok) {
                throw new Error('Failed');
            }

            setIsSuccessDialogOpen(true);
            fetchTasks();
        } catch (error) {
            console.error('Error :', error);
        }
    };

    const handleCloseSuccessDialog = () => {
        setIsSuccessDialogOpen(false);
        fetchTasks();
    };

    const handleEditClick = (task: Task) => {
        setTaskToEdit(task);
        setIsEditModalOpen(true);
    };

    const deleteTask = async (taskId: string) => {
        try {
            const response = await fetch(`http://localhost:5000/api/task/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete task');
            }

            fetchTasks();
        } catch (error) {
            console.error('Error :', error);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <TopMenu />
            <div className="bg-white p-6">
                <div className="p-6 bg-white">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">Tasks</h2>
                        {isPM && (
                            <button
                                onClick={handleOpenModalCreate}
                                className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                            >
                                Create New Task
                            </button>
                        )}
                    </div>

                    <div className="pb-4">
                        <label htmlFor="table-search" className="sr-only">Search</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                id="table-search"
                                className="block pt-2 pl-10 pr-3 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Search for tasks"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch();
                                    }
                                }}
                            />
                        </div>
                    </div>

                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="p-4">Action</th>
                                    <th scope="col" className="p-4">No</th>
                                    <th scope="col" className="px-6 py-3">Due Date</th>
                                    <th scope="col" className="px-6 py-3">Title</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
                                    <th scope="col" className="px-6 py-3">Contributors</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tasks.length > 0 ? (
                                    tasks.map((task, index) => (
                                        <tr key={task.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <a
                                                        href="#"
                                                        onClick={() => handleEditClick(task)}
                                                        title="Edit"
                                                        className="text-blue-600 dark:text-blue-500 hover:text-blue-800"
                                                    >
                                                        <PencilSquareIcon className="w-5 h-5" />
                                                    </a>
                                                    {isPM && (
                                                        <a
                                                            href="#"
                                                            title="Delete"
                                                            onClick={() => {
                                                                setTaskIdToDelete(task.id);
                                                                setShowDeleteModal(true);
                                                            }}
                                                            className="text-red-600 dark:text-red-500 hover:text-red-800"
                                                        >
                                                            <TrashIcon className="w-5 h-5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">{index + 1 + (currentPage - 1) * 10}</td>
                                            <td className="px-6 py-4">
                                                {new Date(task.startDate).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })} - {new Date(task.endDate).toLocaleDateString('id-ID', {
                                                    day: '2-digit',
                                                    month: '2-digit',
                                                    year: 'numeric',
                                                })}
                                            </td>
                                            <td className="px-6 py-4">{task.title}</td>
                                            <td className="px-6 py-4">{task.description}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={`inline-flex w-3 h-3 rounded-full ${task.status === 'done'
                                                                ? 'bg-green-600'
                                                                : task.status === 'on progress'
                                                                    ? 'bg-yellow-600'
                                                                    : 'bg-gray-200'
                                                            }`}
                                                    ></span>
                                                    {task.status}
                                                </div>
                                            </td>

                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {task.contributors.map((contributor, id) => (
                                                        <button
                                                            key={id}
                                                            className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                                                        >
                                                            {contributor}
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="text-center py-4">Task Not Found!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* pagination section*/}
                    <nav className="flex items-center flex-column flex-wrap md:flex-row justify-between pt-4" aria-label="Table navigation">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-400 mb-4 md:mb-0 block w-full md:inline md:w-auto">
                            Showing <span className="font-semibold text-black dark:text-black">{(currentPage - 1) * 10 + 1}</span> to <span className="font-semibold text-black dark:text-black">{Math.min(currentPage * 10, tasks.length)}</span> of <span className="font-semibold text-black dark:text-black">{totalPages * 10}</span>
                        </span>
                        <ul className="inline-flex -space-x-px rtl:space-x-reverse text-sm h-8">
                            <li>
                                <button
                                    onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li key={index}>
                                    <button
                                        onClick={() => handlePageChange(index + 1)}
                                        className={`flex items-center justify-center px-3 h-8 leading-tight ${currentPage === index + 1 ? 'text-blue-600 border border-gray-300 bg-blue-50' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'} dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={() => handlePageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
                                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* CreateTaskModal */}
            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={handleCloseModalCreate}
                onSubmit={handleSubmitTask}
            />

            {isSuccessDialogOpen && (
                <SuccessDialog onClose={handleCloseSuccessDialog} />
            )}

            {/* UpdateTaskModal */}
            {isEditModalOpen && taskToEdit && (
                <UpdateTaskModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    taskId={taskToEdit?.id}
                    initialData={taskToEdit}
                    isPM={isPM}
                    onSubmit={() => {
                        setIsEditModalOpen(false);
                        setTaskToEdit(null);
                        setIsSuccessDialogOpen(true);
                        fetchTasks();
                    }}
                />
            )}

            {showDeleteModal && (
                <DeleteConfirmDialog
                    onConfirm={() => {
                        if (taskIdToDelete) {
                            deleteTask(taskIdToDelete);
                            setIsSuccessDialogOpen(true);
                        }
                        setShowDeleteModal(false);
                    }}
                    onCancel={() => setShowDeleteModal(false)}
                />
            )}
        </div>
    );
};

export default Task;
