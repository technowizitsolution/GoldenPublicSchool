// import { assets } from '../assets/assets.js'
// import { useNavigate, useLocation } from 'react-router-dom';

// const Sidebar = () => {
//     const navigate = useNavigate();
//     const location = useLocation();

//     const isActive = (path) => location.pathname === path;

//     const menuItems = [
//         { path: '/', label: 'Dashboard', icon: assets.home_icon },
//     ];

//     const schoolManagementItems = [
//         { path: '/classStandards', label: 'Class Standards', icon: assets.home_icon },
//         { path: '/studentRecords', label: 'Student Records', icon: assets.home_icon },
//         { path: '/feeTransactions', label: 'Fee Transactions', icon: assets.home_icon },
//         { path: '/uniformManagement', label: 'Uniform Management', icon: assets.home_icon },
//         { path: '/bookManagement', label: 'Book Management', icon: assets.home_icon },
//     ];

//     return (
//         <div className='flex flex-col h-screen w-72 bg-gray-100 text-black shadow-md'>

//             {/* LOGO */}
//             <div className="p-6 border-b border-gray-300">
//                 <div className="flex items-center gap-3">
//                     <img src={assets.logo} alt="Logo" className="w-12 h-12 rounded-lg" />
//                     <div className="flex flex-col">
//                         <span className="text-lg font-bold text-black">
//                             Golden
//                         </span>
//                         <span className="text-xs font-semibold text-gray-900">
//                             Public School
//                         </span>
//                     </div>
//                 </div>
//             </div>

//             {/* USER SECTION */}
//             <div className="p-4 border-b border-gray-300">
//                 <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-300 transition">
//                     <img
//                         src={assets.user_icon}
//                         className="w-10 h-10 rounded-full object-cover"
//                         alt="User"
//                     />
//                     <p className="flex-1 text-sm font-medium">
//                         Admin
//                     </p>
//                 </div>
//             </div>

//             {/* MAIN MENU */}
//             <div className="flex-1 overflow-y-auto px-4 py-6">
//                 {/* Dashboard */}
//                 <div
//                     onClick={() => navigate('/')}
//                     className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition mb-6 ${
//                         isActive('/')
//                             ? 'bg-blue-600 text-white shadow-lg'
//                             : ' hover:bg-gray-300'
//                     }`}
//                 >
//                     <img
//                         src={assets.home_icon}
//                         className="w-5 h-5"
//                         alt="Dashboard"
//                     />
//                     <p className="flex-1 text-sm font-medium">
//                        Dashboard
//                     </p>
//                     {isActive('/') && (
//                         <div className="w-2 h-2 bg-white rounded-full"></div>
//                     )}
//                 </div>

//                 {/* SCHOOL MANAGEMENT SECTION */}
//                 <div className="mb-6">
//                     <p className="text-xs font-bold text-gray-500 px-4 mb-3 uppercase tracking-wider">
//                         School Management
//                     </p>
//                     <div className="space-y-2">
//                         {schoolManagementItems.map((item) => (
//                             <div
//                                 key={item.path}
//                                 onClick={() => navigate(item.path)}
//                                 className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
//                                     isActive(item.path)
//                                         ? 'bg-blue-600 shadow-lg'
//                                         : ' hover:bg-gray-300'
//                                 }`}
//                             >
//                                 <img
//                                     src={item.icon}
//                                     className="w-5 h-5"
//                                     alt={item.label}
//                                 />
//                                 <p className="flex-1 text-sm font-medium">
//                                     {item.label}
//                                 </p>
//                                 {isActive(item.path) && (
//                                     <div className="w-2 h-2 bg-white rounded-full"></div>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>

//             {/* FOOTER */}
//             <div className="p-4 border-t border-gray-700 text-xs text-gray-500 text-center">
//                 <p>© 2026 Golden Public School</p>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;

import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
    {
        title: "MENU",
        items: [
            {
                label: "Dashboard",
                path: "/admin",
                icon: '/home.png',
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                label: "Fees",
                path: "/admin/fees",
                icon: '/finance.png',
                visible: ["admin", "teacher"]
            },
            {
                label: "Classes",
                path: "/admin/Classes",
                icon: '/class.png',
                visible: ["admin", "teacher"],
            },
            {
                label: "Teachers",
                path: "/admin/teachers",
                icon: '/teacher.png',
                visible: ["admin", "teacher"],
            },
            {
                label: "Students",
                path: "/admin/students",
                icon: '/student.png',
                visible: ["admin", "teacher"],
            },
            {
                label: "Parents",
                path: "/admin/parents",
                icon: '/parent.png',
                visible: ["admin", "teacher"],
            },
            {
                label: "Subjects",
                path: "/admin/subjects",
                icon: '/subject.png',
                visible: ["admin"],
            },

        ],
    },
    {
        title: "INVENTORY",
        items: [
            {
                label: "Uniforms",
                path: "/admin/uniforms",
                icon: '/uniform.png',
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                label: "Books",
                path: "/admin/books",
                icon: '/books.png',
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },
    {
        title: "OTHER",
        items: [
            {
                label: "Profile",
                path: "/admin/profile",
                icon: '/profile.png',
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                label: "Settings",
                path: "/settings",
                icon: '/setting.png',
                visible: ["admin", "teacher", "student", "parent"],
            },
            {
                label: "Logout",
                path: "/logout",
                icon: '/logout.png',
                visible: ["admin", "teacher", "student", "parent"],
            },
        ],
    },
];

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ TEMP ROLE (replace later with auth)
    const role = "admin";

    const isActive = (path) => location.pathname === path;

    return (
        <div className="flex flex-col h-screen w-72 bg-white shadow-md">
            <Link
                to="/admin"
                className="flex items-center justify-center lg:justify-start gap-2 m-4"
            >
                <img
                    src="/logo.png"
                    alt="logo"
                    className="w-8 h-8 object-contain"
                />
                <span className="hidden lg:block font-bold">Golden Public School</span>
            </Link>
            {/* MENU */}
            <div className="flex-1 overflow-y-auto scrollbar-hidden px-4 py-1">
                {menuItems.map((section) => (
                    <div key={section.title} className="mb-4">
                        <p className="text-xs font-bold text-gray-500 px-4 mb-3 uppercase">
                            {section.title}
                        </p>

                        <div className="space-y-0">
                            {section.items.map(
                                (item) =>
                                    item.visible.includes(role) && (
                                        <div
                                            key={item.path}
                                            onClick={() => navigate(item.path)}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${isActive(item.path)
                                                ? "bg-[#EEF2FF]"
                                                : "hover:bg-gray-200"
                                                }`}
                                        >
                                            <img src={item.icon} className="w-5 h-5" alt="" />
                                            <span className="text-sm font-medium">
                                                {item.label}
                                            </span>
                                        </div>
                                    )
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
