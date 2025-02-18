import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, Outlet, useNavigate } from "react-router";

const Dashboard = () => {
  const [width, setWidth] = useState(80);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const authUser = useSelector((state) => state.user);
  const role = authUser?.userInfo?.role;

  const navigateToPath = (url) => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      navigate(url);
    }, 100);
  };

  useEffect(() => {
    const setWidth = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", setWidth);

    return () => {
      window.removeEventListener("resize", setWidth);
    };
  }, []);

  return (
    <div className="flex justify-between">
      {/* sidebar */}
      <div
        className="bg-[#242630] fixed left-0 top-0 hidden sm:block"
        style={{
          width: 100 - width + "%",
          minHeight: width !== 0 ? "100vh" : 0,
          transition: ".3s",
        }}
      >
        <SidebarLinks />
      </div>

      {/* sidebar on small devices */}
      <div
        className={`sm:hidden bg-[#242630] fixed top-0 left-0 z-[8989] h-screen w-[90%] ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-[100%]"
        } transition-transform duration-300 ease-in-out`}
      >
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="w-8 h-8 rounded-full text-xl bg-gray-300 mr-3 mt-3 ml-auto flex items-center justify-center p-5 cursor-pointer"
        >
          X
        </button>
        <div className="px-5 py-5">
          <Link to="/" className="w-fit flex items-center text-white">
            <img src="/images/logo.png" className="w-10 h-10 mr-3" />
            <span>CryptExams</span>
          </Link>
        </div>

        <hr className="border-1 border-gray-700" />

        <div className="p-5">
          {role === "teacher" ? (
            <ul>
              <li>
                <Link
                  onClick={() => navigateToPath("/dashboard/teacher/groups")}
                  className=" hover:bg-[#444CF8] block py-2 px-4 rounded-sm text-white"
                >
                  All Groups
                </Link>
              </li>
              <li>
                <Link
                  onClick={() =>
                    navigateToPath("/dashboard/teacher/groups/create")
                  }
                  className="hover:bg-[#444CF8] block py-2 px-4 rounded-sm text-white"
                >
                  Create Group
                </Link>
              </li>
              <li>
                <Link
                  onClick={() =>
                    navigateToPath("/dashboard/teacher/view/tests")
                  }
                  className="hover:bg-[#444CF8] block py-2 px-4 rounded-sm text-white"
                >
                  View All Tests
                </Link>
              </li>
            </ul>
          ) : (
            <ul>
              <li>
                <Link
                  onClick={() => navigateToPath("/dashboard/student/tests")}
                  className=" hover:bg-[#444CF8] block py-2 px-4 rounded-sm text-white"
                >
                  Available Tests
                </Link>
              </li>
              {/* <li><Link onClick={() => navigateToPath("/dashboard/students/groups/create")}
                        className="hover:bg-[#444CF8] block py-2 px-4 rounded-sm text-white">Create Group</Link></li> */}
            </ul>
          )}
        </div>
      </div>

      <main
        className=" min-h-screen flex flex-col relative z-10"
        style={{
          width: window.innerWidth > 568 ? width + "%" : 100 + "%",
          marginLeft: window.innerWidth > 568 ? 100 - width + "%" : 0,
          transition: ".3s",
        }}
      >
        {/* for larger devices */}
        <div className="hidden sticky top-0 left-0 sm:block bg-white px-5 py-4">
          <button
            onClick={() => setWidth((prev) => (prev === 80 ? 100 : 80))}
            className="cursor-pointer"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        {/* for small devices */}
        <div className="sm:hidden sticky z-[100] top-0 left-0 bg-white px-5 py-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="cursor-pointer"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
        </div>

        <div className="bg-[#F5F7FB] flex-grow p-4 sm:p-8 ">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

const SidebarLinks = () => {
  const authUser = useSelector((state) => state.user);
  const role = authUser?.userInfo?.role;

  return (
    <div>
      <div className="px-5 py-5 mt-5">
        <Link to="/" className="w-fit flex items-center text-white px-4">
          <img src="/images/logo.png" className="w-10 h-10 mr-3" />
          <span>CryptExams</span>
        </Link>
      </div>
      <hr className="border-1 border-gray-700" />

      <div className="p-5">
        {role === "teacher" ? (
          <ul>
            <li>
              <Link
                to="/dashboard/teacher/groups"
                className=" hover:bg-[#444CF8] block py-2 px-4 rounded-sm text-white"
              >
                All Groups
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/teacher/groups/create"
                className="hover:bg-[#444CF8] block py-2 px-4 rounded-sm text-white"
              >
                Create Group
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/teacher/view/tests"
                className="hover:bg-[#444CF8] block py-2 px-4 rounded-sm text-white"
              >
                View All Tests
              </Link>
            </li>
          </ul>
        ) : (
          <ul>
            <li>
              <Link
                to="/dashboard/student/tests"
                className=" hover:bg-[#444CF8] block py-2 px-4 rounded-sm text-white"
              >
                Available Tests
              </Link>
            </li>
            {/* <li><Link to="/dashboard/student/groups/create"
                            className="hover:bg-[#444CF8] block py-2 px-4 rounded-sm text-white">Create Group</Link></li> */}
          </ul>
        )}
      </div>
    </div>
  );
};
