import { useEffect, useState } from "react";
import Input from "../../components/Input";
import { useRegisterMutation } from "../../store/api/authAPI";
import { useDispatch } from "react-redux";
import { setUser as setUserToStore } from "../../store/reducers/userReducer";
import { ToastError } from "../../components/toastify/Toast";
import { useNavigate } from "react-router";

const Signup = ({loginActive, setLoginActive}) => {

    const dispatch = useDispatch();
    const [register, {isLoading, isError, error, data}] = useRegisterMutation();
    const navigate = useNavigate()

    const [user, setUser] = useState({
        fullName: "",
        phoneNumber: "",
        email: "",
        password: ""
    })

    const handleOnChange = (e) => {
        setUser(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!user.fullName || !user.phoneNumber || !user.email || !user.password) {
            ToastError("All fields are required.");
            return;
          }
      
          if (user.phoneNumber.length !== 10) {
            ToastError("Phone number must be 10 digits.");
            return;
          }
      
          if (user.password.length < 6) {
            ToastError("Password must be at least 6 characters.");
            return;
          }

        const credentials = {
            name: user.fullName,
            mobile: user.phoneNumber,
            email: user.email,
            password: user.password
        }
        
        await register(credentials);
    }
    
    useEffect(() => {
        if (data) {
            dispatch(setUserToStore(data.user));
            navigate("/");
          }
    }, [data, navigate, dispatch])

    useEffect(() => {
        if(isError){
            ToastError(error.data.errors[0].msg || 'something went wrong');
        }
    }, [isError, error])
   

    return ( 
        <form 
        onSubmit={handleRegister}
        className="flex flex-col gap-4 font-[500] py-6 px-7" onClick={() => setLoginActive(false)}>
        <h1 
        className={`text-3xl text-center mb-[1rem] font-bold ${loginActive ? "text-gray-300" : "text-white"}`}>Signup</h1>

        <Input 
        type="text" 
        name="fullName" placeholder="Full name" 
        value={user.fullName} 
        onChange={handleOnChange} />

        <Input 
        type="text" 
        name="phoneNumber" placeholder="Phone number" 
        value={user.phoneNumber}
        onChange={handleOnChange}  />


        <Input 
        type="email" 
        name="email" placeholder="Email address" 
        value={user.email}
        onChange={handleOnChange}  />

        <Input 
        type="password" 
        name="password" placeholder="Password" 
        value={user.password}
        onChange={handleOnChange}  />

        <button 
        type="submit" 
        disabled={isLoading}
        style={{ cursor: !isLoading && 'pointer', opacity: isLoading && .5}}
        className="p-3.5 bg-white rounded-lg outline-0 mt-[2rem]  mb-[1rem]
        text-gray-700">{isLoading ? "signing..." : "Signup"}</button>
    </form>
    )
}

export default Signup;