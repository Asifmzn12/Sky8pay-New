import React, { useState, useEffect, useRef } from "react";
import { HiHome, HiChartBar, HiDocumentReport, HiUserGroup, HiCog, HiCreditCard, HiCurrencyDollar, HiBriefcase, HiOutlineViewList, HiOutlineSearch } from 'react-icons/hi';
import { FaMoneyBillAlt, FaLaptop, FaUser, FaTools } from 'react-icons/fa';
import { FaArrowsLeftRight } from 'react-icons/fa6';
import { MdOutlineNotifications, MdOutlineDarkMode, MdOutlineLightMode, MdOutlinePerson, MdOutlineSettings, MdOutlineLogout } from 'react-icons/md';
import { IoIosArrowDown, IoMdMenu } from 'react-icons/io';
import { IoCloseSharp } from 'react-icons/io5'; // This import is necessary for the footer close button

function DashBoardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({ products: false, reports: false });
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [supportBoxVisible, setSupportBoxVisible] = useState(true);

  const profileRef = useRef();
  const notifRef = useRef();

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

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };

  const buildBreadcrumbs = () => {
    const parts = activeMenu.split("-");
    return parts.map((part, idx) => {
      const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/([A-Z])/g, ' $1');
      const path = parts.slice(0, idx + 1).join("-");
      const isLast = idx === parts.length - 1;
      return (
        <li key={path} className="flex items-center space-x-2">
          {!isLast ? (
            <a
              href="#"
              onClick={() => setActiveMenu(path)}
              className="hover:text-blue-500 capitalize"
            >
              {label}
            </a>
          ) : (
            <span className="capitalize text-gray-900 dark:text-white font-semibold">
              {label}
            </span>
          )}
          {!isLast && <span>/</span>}
        </li>
      );
    });
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside
        className={`fixed z-30 top-0 left-0 h-full overflow-y-auto bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 lg:static lg:w-64 w-64 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4">
          <img
            src="sky8paylogo.png"
            className="w-full max-w-[150px]"
            alt="logo"
          />
          <button
            className="lg:hidden p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            onClick={() => setSidebarOpen(false)}
          >
            ❌
          </button>
        </div>

        <nav className="mt-4 flex flex-col gap-1 p-2 flex-grow">
          {/* Dashboard */}
          <button
            onClick={() => handleMenuClick("dashboard")}
            className={`relative flex items-center gap-3 w-full p-2 pl-4 rounded transition-colors ${
              activeMenu === "dashboard"
                ? "text-[#4A90E2] font-semibold"
                : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
            }`}
          >
            {activeMenu === "dashboard" && (
              <span className="absolute left-0 top-0 h-full w-1 bg-[#4A90E2] rounded-full"></span>
            )}
            <HiHome className="text-2xl" />
            <span>Dashboard</span>
          </button>

          {/* Collapsible Menu - CORRECTED STRUCTURE */}
          {[
            { key: 'reports', label: 'Reports', icon: HiChartBar, subItems: ["Purchase Report", "Sale Report", "Fund Request Report", "Loan Request Report", "Transaction Report"] },
            // Example of another collapsible menu
            { key: 'products', label: 'Products', icon: FaLaptop, subItems: ["Product A", "Product B", "Product C"] },
          ].map((menu) => (
            <div key={menu.key} className="flex flex-col">
              <button
                onClick={() => toggleMenu(menu.key)}
                className={`relative flex items-center justify-between w-full p-2 pl-4 rounded transition-colors ${
                  activeMenu.startsWith(menu.key)
                    ? "text-[#4A90E2] font-semibold"
                    : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                {activeMenu.startsWith(menu.key) && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-[#4A90E2] rounded-full"></span>
                )}
                <div className="flex items-center gap-3">
                  <menu.icon className="text-2xl" />
                  <span>{menu.label}</span>
                </div>
                <IoIosArrowDown
                  className={`text-xl transform transition-transform duration-300 ${
                    openMenus[menu.key] ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openMenus[menu.key] ? "max-h-60" : "max-h-0"
                }`}
              >
                <div className="flex flex-col ml-8 mt-1 gap-1">
                  {menu.subItems.map((item) => (
                    <button
                      key={item}
                      onClick={() =>
                        handleMenuClick(`${menu.key}-${item.toLowerCase().replace(/ /g, "")}`)
                      }
                      className={`text-left p-1 rounded transition-colors ${
                        activeMenu === `${menu.key}-${item.toLowerCase().replace(/ /g, "")}`
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-white"
                          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* Single Menus */}
          {[
            { key: "fundrequest", label: "Fund Request", icon: FaMoneyBillAlt },
            { key: "transaction", label: "Transactions", icon: FaArrowsLeftRight },
            { key: "account", label: "Accounts", icon: FaUser },
            { key: "investments", label: "Investments", icon: HiBriefcase },
            { key: "creditcard", label: "Credit Cards", icon: HiCreditCard },
            { key: "loans", label: "Loans", icon: HiCurrencyDollar },
            { key: "services", label: "Services", icon: FaTools },
            { key: "my privileges", label: "My Privileges", icon: HiUserGroup },
            { key: "setting", label: "Setting", icon: HiCog },
          ].map((menu) => (
            <button
              key={menu.key}
              onClick={() => handleMenuClick(menu.key)}
              className={`relative flex items-center gap-3 w-full p-2 pl-4 rounded transition-colors ${
                activeMenu === menu.key
                  ? "text-[#4A90E2] font-semibold"
                  : "text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {activeMenu === menu.key && (
                <span className="absolute left-0 top-0 h-full w-1 bg-[#4A90E2] rounded-full"></span>
              )}
              <menu.icon className="text-2xl" />
              <span>{menu.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer Section */}
        <div className={`p-4 mt-auto transition-all duration-300 ${supportBoxVisible ? 'opacity-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 relative">
            <button onClick={() => setSupportBoxVisible(false)} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200">
              <IoCloseSharp className="text-xl" />
            </button>
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Need Support?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Contact one of our experts to get supports
            </p>
            <button className="w-full bg-[#4A90E2] text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 w-full overflow-y-auto">
        <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
          <div className="container mx-auto max-w-7xl px-4 flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden text-2xl h-10 w-10 rounded"
                onClick={() => setSidebarOpen(true)}
              >
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

            <div className="flex items-center gap-4">
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen((p) => !p)}
                  className="relative p-2 h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700"
                >
                  <MdOutlineNotifications className="text-xl text-[#FE5C73]" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[#FE5C73] rounded-full"></span>
                </button>
                <div
                  className={`absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden transition-all duration-300 transform origin-top ${
                    notifOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="p-4 border-b dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200">
                      Notifications
                    </h3>
                  </div>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-64 overflow-y-auto">
                    {[
                      "New user registered",
                      "Product updated",
                      "System maintenance at 10 PM",
                      "Your subscription expires soon",
                    ].map((notif, i) => (
                      <li
                        key={i}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                      >
                        {notif}
                      </li>
                    ))}
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
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <img
                    src="https://milton-asifmzn12.vercel.app/images/testimonial1.png"
                    alt="User"
                    className=" w-10 h-10 rounded-full"
                  />
                </button>
                <div
                  className={`absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50 overflow-hidden transition-all duration-300 transform origin-top ${
                    profileOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="font-bold text-gray-800 dark:text-gray-200">
                    Good Morning, John Doe
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Project Admin
                  </p>
                  <div className="bg-yellow-100 dark:bg-yellow-800 p-3 rounded mb-3">
                    <p className="text-sm">
                      70% discount for 1 year subscription.
                    </p>
                    <button className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded">
                      Go Premium
                    </button>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-700 dark:text-gray-300">
                      Start DND Mode
                    </span>
                    <input
                      type="checkbox"
                      className="toggle-checkbox"
                      defaultChecked
                    />
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-700 dark:text-gray-300">
                      Allow Notifications
                    </span>
                    <input type="checkbox" className="toggle-checkbox" />
                  </div>
                  <hr className="my-3 border-gray-200 dark:border-gray-700" />
                  <ul className="space-y-2 flex flex-col gap-3 mt-2">
                    <li className="flex items-center gap-2 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400">
                      <MdOutlineSettings className="text-xl" />
                      Account settings
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:text-blue-500 dark:hover:text-blue-400">
                      <MdOutlinePerson className="text-xl" />
                      Social Profile
                      <span className="ml-auto bg-yellow-400 text-xs px-2 py-0.5 rounded-full">
                        02
                      </span>
                    </li>
                    <li className="flex items-center gap-2 cursor-pointer hover:text-red-500">
                      <MdOutlineLogout className="text-xl" />
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* This is where the page-specific content will be rendered */}
        <div className="flex-1 py-6 px-4">
          <div className="container mx-auto max-w-7xl">
            <nav
              className="text-sm text-gray-600 dark:text-gray-300"
              aria-label="Breadcrumb"
            >
              <ol className="flex items-center space-x-2">
                <li>
                  <a href="#" className="hover:text-blue-500">
                    Home
                  </a>
                </li>
                <li>/</li>
                {buildBreadcrumbs()}
              </ol>
            </nav>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashBoardLayout;