
import React from 'react';

const DashboardSkeleton: React.FC = () => {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <div className="h-7 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex flex-col items-center">
                            <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mt-4"></div>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="w-48 h-48 bg-gray-200 rounded-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mt-4"></div>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center items-center">
                    <div className="w-12 h-12 bg-gray-200 rounded-full mb-2"></div>
                    <div className="h-12 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="h-7 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-4">
                    <div className="h-16 bg-gray-200 rounded-lg w-full"></div>
                    <div className="h-16 bg-gray-200 rounded-lg w-full"></div>
                    <div className="h-16 bg-gray-200 rounded-lg w-full"></div>
                </div>
            </div>
        </div>
    );
};

export default DashboardSkeleton;
