import React from 'react';

interface CardProps {
    dueDate: string;
    title: string;
    description: string;
    contributors: string[];
    status: 'todo' | 'on progress' | 'done';
}


const Card: React.FC<CardProps> = ({ dueDate, title, description, contributors, status }) => {

    const getStatusColor = () => {
        switch (status) {
            case 'todo':
                return 'text-gray-200';
            case 'on progress':
                return 'text-yellow-600';
            case 'done':
                return 'text-green-600';
            default:
                return 'text-gray-500';
        }
    };

    return (
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                {dueDate}
            </div>

            <h3 className="mb-2 text-xl font-light text-gray-400 dark:text-gray-300">
                {title}
            </h3>

            <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
                {description}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
                {contributors.map((contributor, index) => (
                    <span
                        key={index}
                        className="px-3 py-1 text-xs text-gray-600 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300"
                    >
                        {contributor}
                    </span>
                ))}
            </div>

            <div className={`text-sm font-semibold ${getStatusColor()}`}>
                Status: {status}
            </div>
        </div>
    );
};

export default Card;
