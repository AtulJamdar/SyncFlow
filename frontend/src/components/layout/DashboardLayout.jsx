// import React from 'react';
// import Sidebar from './Sidebar';
// import Navbar from './Navbar';



// const DashboardLayout = ({ children }) => {
//     return (
//         <div className="flex h-screen bg-gray-100">
//             <Sidebar />
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <Navbar />
//                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
//                     {children}
//                 </main>
//             </div>
//         </div>
//     );
// };

// export default DashboardLayout;

import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;