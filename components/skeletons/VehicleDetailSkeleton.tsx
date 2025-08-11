
import React from 'react';

const VehicleDetailSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="h-9 bg-gray-300 rounded w-64 mb-2"></div>
                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                    </div>
                    <div className="text-right">
                        <div className="h-8 bg-gray-300 rounded w-40 mb-2"></div>
                        <div className="h-5 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 border-t pt-4">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-7 bg-gray-300 rounded w-1/3"></div>
                    <div className="flex space-x-2">
                        <div className="h-8 bg-gray-300 rounded-lg w-32"></div>
                        <div className="h-8 bg-gray-300 rounded-lg w-36"></div>
                    </div>
                </div>
                 <div className="relative pl-8 border-l-2 border-neutral-medium">
                    {/* Skeleton for one timeline item */}
                    <div className="mb-8">
                        <div className="absolute -left-[21px] w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="p-4 bg-neutral-light rounded-lg ml-8 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                               <div className="h-6 bg-gray-300 rounded w-1/4"></div>
                               <div className="h-6 bg-gray-300 rounded-full w-24"></div>
                            </div>
                            <div className="h-5 bg-gray-200 rounded w-1/2"></div>
                             <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
                        </div>
                    </div>
                    {/* Skeleton for another timeline item */}
                     <div className="mb-8">
                        <div className="absolute -left-[21px] w-10 h-10 bg-gray-300 rounded-full"></div>
                        <div className="p-4 bg-neutral-light rounded-lg ml-8 shadow-sm">
                            <div className="flex justify-between items-center mb-2">
                               <div className="h-6 bg-gray-300 rounded w-1/3"></div>
                               <div className="h-6 bg-gray-300 rounded-full w-28"></div>
                            </div>
                            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                             <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailSkeleton;
