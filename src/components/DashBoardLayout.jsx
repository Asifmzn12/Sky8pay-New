import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoMdMenu } from "react-icons/io";
import { IoCloseSharp } from "react-icons/io5";
import {
  MdOutlineNotifications,
  MdOutlineDarkMode,
  MdOutlineLightMode,
  MdOutlinePerson,
  MdOutlineSettings,
  MdOutlineLogout,
} from "react-icons/md";
import { HiOutlineSearch } from "react-icons/hi";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { menus } from "../config/menu";


// ... (imports)

const MenuItem = ({ menu, parentPath, openMenus, toggleMenu, activeMenu, handleMenuClick }) => {
  const hasChildren = menu.children && menu.children.length > 0;
  const menuPath = hasChildren ? menu.text.toLowerCase().replace(/ /g, "") : menu.path;
  const isOpen = openMenus === menuPath;

  const handleClick = () => {
    if (hasChildren) {
      toggleMenu(menuPath);
    } else {
      handleMenuClick(menu.path, menu.path);
    }
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={handleClick}
        className={`relative flex items-center justify-between w-full p-2 pl-4 rounded transition-colors ${activeMenu === menu.path ? "text-[#4A90E2] font-semibold" : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          }`}
      >
        {activeMenu === menu.path && (
          <span className="absolute left-0 top-0 h-full w-1 bg-[#4A90E2] rounded-full"></span>
        )}
        <div className="flex items-center gap-3 text-start">
          {menu.icon && <menu.icon className={`${parentPath ? "text-[8px] mt-2" : "text-2xl mt-0"} flex-shrink-0`} />}
          <span className="whitespace-normal">{menu.text}</span>
          {/* Add the badge here */}
          {menu.badge && (
            <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full ml-2">
              {menu.badge}
            </span>
          )}
        </div>
        {hasChildren && <IoIosArrowDown className={`text-xl transform transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />}
      </button>

      <AnimatePresence>
        {isOpen && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col ml-4 mt-1 gap-1 text-start">
              {menu.children.map((child) => (
                <MenuItem
                  key={child.path || child.text}
                  menu={child}
                  parentPath={menuPath}
                  openMenus={openMenus}
                  toggleMenu={toggleMenu}
                  activeMenu={activeMenu}
                  handleMenuClick={handleMenuClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



function DashBoardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState("");
  const [activeMenu, setActiveMenu] = useState("/");
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [supportBoxVisible, setSupportBoxVisible] = useState(true);

  const profileRef = useRef();
  const notifRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();


  const findMenuPath = (menuList, path, currentPath = []) => {
    for (const menu of menuList) {
      if (menu.path === path) {
        return [...currentPath, { text: menu.text, path: menu.path }];
      }
      if (menu.children) {
        const result = findMenuPath(menu.children, path, [...currentPath, { text: menu.text }]);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };


  useEffect(() => {
    setActiveMenu(location.pathname);
    const fullPath = findMenuPath(menus, location.pathname);
    if (fullPath && fullPath.length > 1) {
      const parentMenuPath = fullPath[0].text.toLowerCase().replace(/ /g, "");
      setOpenMenus(parentMenuPath);
    } else {
      setOpenMenus("");
    }
  }, [location.pathname]);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setDarkMode((prev) => !prev);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleMenu = (menuPath) => {
    setOpenMenus((prev) => (prev === menuPath ? "" : menuPath));
  };

  const handleMenuClick = (menuPath, path) => {
    setActiveMenu(menuPath);
    if (path) navigate(path);
  };

  const buildBreadcrumbs = () => {
    const breadcrumbItems = findMenuPath(menus, activeMenu);
    if (!breadcrumbItems) return null;

    return breadcrumbItems.map((item, idx) => {
      const isLast = idx === breadcrumbItems.length - 1;
      return (
        <li key={idx} className="flex items-center space-x-2">
          {!isLast ? (
            <span
              className="hover:text-blue-500 capitalize cursor-pointer"
              onClick={() => navigate(item.path)}
            >
              {item.text}
            </span>
          ) : (
            <span className="capitalize text-gray-900 dark:text-white font-semibold">{item.text}</span>
          )}
          {!isLast && <span>/</span>}
        </li>
      );
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed z-30 top-0 left-0 h-full overflow-y-auto bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:w-64 w-64 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          <img src="sky8paylogo.png" className="w-full max-w-[150px]" alt="logo" />
          <button
            className="lg:hidden p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
            onClick={() => setSidebarOpen(false)}
          >
            <IoCloseSharp className="text-xl" />
          </button>
        </div>
        <nav className="mt-4 flex flex-col gap-1 p-2 flex-grow">
          {menus.map((menu) => (
            <MenuItem
              key={menu.text}
              menu={menu}
              parentPath=""
              openMenus={openMenus}
              toggleMenu={toggleMenu}
              activeMenu={activeMenu}
              handleMenuClick={handleMenuClick}
            />
          ))}
        </nav>

        {/* Footer Support Box */}
        <div className={`p-4 mt-auto transition-all duration-300 ${supportBoxVisible ? "opacity-100" : "opacity-0 scale-95 pointer-events-none"}`}>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 relative">
            {/* <button onClick={() => setSupportBoxVisible(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200">
              <IoCloseSharp className="text-xl" />
            </button> */}
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Need Support?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">Contact one of our experts to get support</p>
            <button className="w-full bg-[#4A90E2] text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-y-auto">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
          <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-2xl h-10 w-10 rounded" onClick={() => setSidebarOpen(true)}>
                <IoMdMenu />
              </button>
              <div className="hidden md:block relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                  <HiOutlineSearch className="text-xl" />
                </span>
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-3 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-[#7745c0] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
              </div>
            </div>

            {/* Notifications & Profile */}
            <div className="flex items-center gap-4">
              <div className="relative" ref={notifRef}>
                <button onClick={() => setNotifOpen((p) => !p)} className="relative p-2 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700">
                  <MdOutlineNotifications className="text-xl text-[#FE5C73]" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FE5C73] rounded-full"></span>
                </button>
                <div
                  className={`absolute right-0 mt-2 w-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-300 transform origin-top ${notifOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                    }`}
                >
                  <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">Notifications</h3>
                  </div>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-auto">
                    {["New user registered", "Product updated", "System maintenance at 10 PM", "Your subscription expires soon"].map(
                      (notif, i) => (
                        <li key={i} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors">
                          {notif}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>

              <button
                className="p-2 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                onClick={toggleTheme}
              >
                {darkMode ? <MdOutlineLightMode className="text-xl" /> : <MdOutlineDarkMode className="text-xl" />}
              </button>

              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileOpen((p) => !p)} className="flex items-center gap-2 cursor-pointer">
                  <img
                    src="https://milton-asifmzn12.vercel.app/images/testimonial1.png"
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                </button>
                <div
                  className={`absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 overflow-hidden transition-all duration-300 transform origin-top ${profileOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                    }`}
                >
                  <p className="font-bold text-gray-800 dark:text-gray-200">Good Morning, John Doe</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Project Admin</p>
                  <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded mb-3">
                    <p className="text-sm">70% discount for 1 year subscription.</p>
                    <button className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded">Go Premium</button>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">Start DND Mode</span>
                    <input type="checkbox" className="toggle-checkbox" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 dark:text-gray-300">Allow Notifications</span>
                    <input type="checkbox" className="toggle-checkbox" />
                  </div>
                  <hr className="my-3 border-gray-200 dark:border-gray-700" />
                  <ul className="space-y-2 flex flex-col gap-3 mt-2">
                    <li className="flex items-center gap-2 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400">
                      <MdOutlineSettings className="text-xl" /> Account settings
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400">
                      <MdOutlinePerson className="text-xl" /> Social Profile
                      <span className="ml-auto bg-yellow-400 text-xs px-2 py-0.5 rounded-full">02</span>
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:text-red-500">
                      <MdOutlineLogout className="text-xl" /> Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 py-6 px-4">
          <div className="container mx-auto max-w-7xl">
            <nav className="text-sm text-gray-600 dark:text-gray-300" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <a href="#" className="hover:text-blue-500" onClick={() => navigate("/")}>
                    Home
                  </a>
                </li>
                <li>/</li>
                {buildBreadcrumbs()}
              </ol>
            </nav>
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashBoardLayout;