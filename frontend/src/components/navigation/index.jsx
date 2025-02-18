import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useLogoutMutation } from "../../store/api/authAPI";
import { removeUser } from "../../store/reducers/userReducer";
import { ToastError } from "../toastify/Toast";

const Navigation = () => {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);
    const [logout, { isLoading, isError, error, data }] = useLogoutMutation();
    const dispatch = useDispatch();

    const handleBeforeNavigate = (path) => {
        setIsHamburgerOpen(false);
        setTimeout(() => {
            navigate(path)
        }, 100)
    }

    const handleLogout = async () => {
        await logout();
    }

    useEffect(() => {
        if(data){
            dispatch(removeUser());
            navigate("/");
            setIsHamburgerOpen(false);
        }
    }, [data, navigate, dispatch])

    useEffect(() => {
        if(isError){
            ToastError("something went wrong");
        }
    }, [isError, error])


    return (
        <div className="w-full flex items-center justify-between px-5 sm:px-10 sm:pr-15 py-2">
            <Link to="/" className="flex gap-2 items-center order-2 sm:order-none">
                <img src="/images/logo.png" className="w-10 h-10" />
                <span className="font-semibold sm:text-lg">CryptExams</span>
            </Link>

            <nav className="hidden sm:block">
                <ul className="flex gap-3">
                    {
                        user?.isLoggedIn ? (
                            <>
                            {
                                user.userInfo.role === "teacher" ? (
                                    <li><Link to="/dashboard/teacher/groups" className="text-lg">Dashboard</Link></li>
                                )
                                :
                                <li><Link to="/dashboard/student/tests" className="text-lg">Dashboard</Link></li>
                            }
                            
                                <li><button className="cursor-pointer text-lg" onClick={handleLogout}>Logout</button></li>
                            </>
                        )
                        :
                        <>
                            <li><Link to="/signup" className="text-lg">Signup</Link></li>
                            <li><Link to="/login" className="text-lg">Login</Link></li>
                        </>
                    }
                    
                </ul>
            </nav>

            <button 
            onClick={() => setIsHamburgerOpen(true)}
            className="block sm:hidden cursor-pointer">
                <i className="fa-solid fa-bars"></i>
            </button>

            <div className={`sm:hidden fixed left-0 top-0 bottom-0 w-[90%] bg-[#1D3D6A] 
                ${isHamburgerOpen ? "translate-x-0" : "-translate-x-[100%]"} transition-transform duration-300 ease-in-out`}>
                <button 
                onClick={() => setIsHamburgerOpen(false)}
                className="w-10 h-10 border-2 cursor-pointer border-gray-300 rounded-full flex justify-center items-center 
                text-2xl m-5"><i className="fa-solid fa-xmark"></i></button>
            
                <div className="p-5"> 
                    {
                        user.isLoggedIn && (
                            <div className="py-2 px-5 flex flex-col items-center mb-5">
                                <Link className="flex flex-col items-center gap-2 p-5 rounded-full">
                                <i className="fa-solid fa-user"></i>
                                <span>{user.userInfo.name}</span>
                                </Link>
                            </div>
                        )
                    }

                <nav>
                    <ul className="space-y-3">
                        {
                            !user.isLoggedIn ? (
                                <>
                                    <li>
                                        <button 
                                            onClick={() => handleBeforeNavigate("/signup")}
                                            className="bg-[#1D3D6A] text-[#F1F5F8] cursor-pointer hover:bg-[#3A8FBF] w-full py-2 px-7 
                                            hover:rounded-sm text-lg border  transition-all duration-300 focus:outline-none">
                                            Signup
                                        </button>
                                        </li>

                                        <li>
                                        <button 
                                            onClick={() => handleBeforeNavigate("/login")}
                                            className="bg-[#1D3D6A] text-[#F1F5F8] cursor-pointer hover:bg-[#3A8FBF] w-full py-2 px-7 hover:rounded-sm 
                                            border transition-all duration-300 focus:outline-none">
                                            Login
                                        </button>
                                    </li>
                                </>
                            )
                            :
                            <>
                                <li>
                                <Link
                                to={user.userInfo.role === "teacher" ? "/dashboard/teacher/groups" : "/dashboard/student/tests"} 
                                    className="bg-[#1D3D6A] text-[#F1F5F8] cursor-pointer hover:bg-[#3A8FBF] w-full py-2 px-7 hover:rounded-sm 
                                    border transition-all duration-300 focus:outline-none block text-center">
                                    Dashboard
                                </Link>
                            </li>

                            <li>
                            <button 
                            onClick={handleLogout}
                                className="bg-[#1D3D6A] text-[#F1F5F8] cursor-pointer hover:bg-[#3A8FBF] w-full py-2 px-7 hover:rounded-sm 
                                border transition-all duration-300 focus:outline-none">
                                Logout
                            </button>
                            </li>
                        </>
                        }
                    </ul>
                </nav>

                </div>
            </div>

        </div>
    )
}

export default Navigation;