import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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
                path: "/admin/settings",
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
    const { logout } = useAuth(); //  from context

    const role = "admin"; // temp

    const isActive = (path) => location.pathname === path;

    const handleItemClick = (item) => {
        // Logout logic
        if (item.label === "Logout") {
            logout(); // clear token + state
            navigate("/login");
            return;
        }

        // Normal navigation
        navigate(item.path);
    };

    return (
        <div className="flex flex-col h-screen bg-white shadow-md 
                    w-16 md:w-72 transition-all duration-300">

      {/* LOGO */}
      <Link
        to="/admin"
        className="flex items-center gap-2 m-4 justify-center md:justify-start"
      >
        <img src="/logo.png" className="w-8 h-8" />
        <span className="font-bold hidden md:block">
          Golden Public School
        </span>
      </Link>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-2 md:px-4 py-1">
        {menuItems.map((section) => (
          <div key={section.title} className="mb-4">

            {/* SECTION TITLE */}
            <p className="text-xs font-bold text-gray-500 px-4 mb-3 uppercase hidden md:block">
              {section.title}
            </p>

            <div className="space-y-2">
              {section.items.map(
                (item) =>
                  item.visible.includes(role) && (
                    <div
                      key={item.label}
                      onClick={() => handleItemClick(item)}
                      className={`flex items-center gap-3 px-3 md:px-4 py-3 
                                  rounded-lg cursor-pointer transition
                                  justify-center md:justify-start
                                  ${
                                    isActive(item.path)
                                      ? "bg-[#EEF2FF]"
                                      : "hover:bg-gray-200"
                                  }`}
                    >
                      <img src={item.icon} className="w-5 h-5" />

                      {/* LABEL */}
                      <span className="text-sm font-medium hidden md:block">
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
