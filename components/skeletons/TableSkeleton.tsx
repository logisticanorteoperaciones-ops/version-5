
import React from 'react';

const TableSkeleton: React.FC = () => {
    const SkeletonRow = () => (
        <tr className="border-b border-neutral-medium">
            <td className="p-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
            <td className="p-3"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
            <td className="p-3"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
            <td className="p-3"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
            <td className="p-3"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
        </tr>
    );

    return (
        <div className="overflow-x-auto animate-pulse">
            <table className="w-full text-left">
                <thead className="bg-neutral-light">
                    <tr>
                        <th className="p-3 w-1/6"><div className="h-5 bg-gray-300 rounded w-full"></div></th>
                        <th className="p-3 w-2/6"><div className="h-5 bg-gray-300 rounded w-full"></div></th>
                        <th className="p-3 w-1/6"><div className="h-5 bg-gray-300 rounded w-full"></div></th>
                        <th className="p-3 w-1/6"><div className="h-5 bg-gray-300 rounded w-full"></div></th>
                        <th className="p-3 w-1/6"><div className="h-5 bg-gray-300 rounded w-full"></div></th>
                    </tr>
                </thead>
                <tbody>
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                    <SkeletonRow />
                </tbody>
            </table>
        </div>
    );
};

export default TableSkeleton;
