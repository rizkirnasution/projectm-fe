import React, { useEffect, useState } from 'react';
import TopMenu from '../layouts/TopMenu/index';
import Card from '../components/Card';

export default function Dashboard() {
    const [taskTodo, setTaskToDo] = useState([]);
    const [taskOnProgress, setTaskOnProgress] = useState([]);
    const [taskDone, setTaskDone] = useState([]);
    const token = localStorage.getItem("token");

    const formatDueDate = (start, end) => {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        const startFormatted = new Date(start).toLocaleDateString('id-ID', options);
        const endFormatted = new Date(end).toLocaleDateString('id-ID', options);
        return `${startFormatted} - ${endFormatted}`;
    };

    useEffect(() => {
        const fetchTasks = async () => {
            try {

                // fetch todo
                const fetchTodo = await fetch("http://localhost:5000/api/task/search?keyword=todo", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!fetchTodo.ok) {
                    throw new Error('Failed tasks todo');
                }

                const dataToDo = await fetchTodo.json();
                setTaskToDo(dataToDo.data);


                // fetch on progress
                const fetchOnProgress = await fetch("http://localhost:5000/api/task/search?keyword=on progress", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!fetchOnProgress.ok) {
                    throw new Error('Failed task on progress');
                }

                const dataOnProgress = await fetchOnProgress.json();
                setTaskOnProgress(dataOnProgress.data);

                // fetch done
                const fetchDone = await fetch("http://localhost:5000/api/task/search?keyword=done", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!fetchDone.ok) {
                    throw new Error('Failed task done');
                }

                const dataDone = await fetchDone.json();
                setTaskDone(dataDone.data);
            } catch (error) {
                console.error("Error :", error);
            }
        };

        fetchTasks();
    }, [token]);

    return (
        <div>
            <TopMenu />
            <div className="bg-white p-8">
                <h2 className="text-black text-2xl font-bold mb-4 mt-4">Dashboard</h2>

                {/* Card status todo */}
                <h3 className="text-black text-xl font-semibold mb-4">To Do</h3>
                {taskTodo.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {taskTodo.map(card => (
                            <Card
                                key={card.id}
                                dueDate={formatDueDate(card.startDate, card.endDate)}
                                title={card.title}
                                description={card.description}
                                contributors={JSON.parse(card.contributors)}
                                status={card.status}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Belum ada task yang todo</p>
                )}


                {/* Card status on progress */}
                <h3 className="text-black text-xl font-semibold mb-4 mt-4">On Progress</h3>
                {taskOnProgress.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {taskOnProgress.map(card => (
                            <Card
                                key={card.id}
                                dueDate={formatDueDate(card.startDate, card.endDate)}
                                title={card.title}
                                description={card.description}
                                contributors={JSON.parse(card.contributors)}
                                status={card.status}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Belum ada task yang on progress</p>
                )}

                {/* Card status done */}
                <h3 className="text-black text-xl font-semibold mb-2 mt-6">Done</h3>
                {taskDone.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {taskDone.map(card => (
                            <Card
                                key={card.id}
                                dueDate={formatDueDate(card.startDate, card.endDate)}
                                title={card.title}
                                description={card.description}
                                contributors={JSON.parse(card.contributors)}
                                status={card.status}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Belum ada task yang done</p>
                )}

                {/* Uncomment if you have a footer */}
                {/* <div className="part-footer ">
          <Footer />
        </div> */}
            </div>
        </div>
    );
}
