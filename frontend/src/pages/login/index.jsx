import { useEffect, useState } from "react";
import Input from "../../components/Input";
import { useLoginMutation } from "../../store/api/authAPI";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/reducers/userReducer";
import { ToastError } from "../../components/toastify/Toast";
import { useNavigate } from "react-router";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, { isLoading, isError, error, data }] = useLoginMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        if(!email || !password){
            ToastError("all fields are required");
            return;
        }

        await login({ email, password });
    }

    useEffect(() => {
        if(data){
            dispatch(setUser(data.user));
            navigate("/")
        }
    }, [data, navigate, dispatch])

    useEffect(() => {
        if(isError) {
            ToastError(error.data.errors[0].msg || "Something went wrong. Please try again.");
          }
    }, [isError, error])


    return (
        <form className="flex flex-col gap-4 font-[500] py-6 px-7 text-black" onSubmit={handleLogin}>
            <h1 className="text-3xl text-center mb-[1rem] font-bold text-gray-700">Login</h1>

            <Input type="email" name="email" placeholder="Email address" 
            value={email} onChange={(e) => setEmail(e.target.value)} />

            <Input type="password" name="password" placeholder="Password"
            value={password} onChange={(e) => setPassword(e.target.value)} />

            {/* <span className="text-gray-500">Forgot password?</span> */}
            <button type="submit" 
            disabled={isLoading}
            style={{ cursor: !isLoading && 'pointer', opacity: isLoading && .5}}
            className="p-3.5 bg-[#4070F4] text-white rounded-lg outline-0 mt-[1rem] mb-[1rem] ">
                {isLoading ? "logging in..." : "Login"}</button>
        </form>
    )
}

export default Login;