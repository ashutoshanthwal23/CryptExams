import { useEffect, useState } from "react";
import Signup from "../signup";
import Login from "../login";
import Layout from "../../components/layout";

const Authentication = ({ isActive }) => {
  const [loginActive, setLoginActive] = useState(false);

  useEffect(() => {
    setLoginActive(isActive);
  }, [isActive]);

  return (
    <Layout>
      <div className="h-screen px-3 sm:px-0 flex justify-center items-center w-full">
        <div className="bg-[#4070F4] w-[340px] md:w-4/12  h-[600px] md:h-[80%] rounded-xl relative overflow-hidden shadow-lg">
          <Signup loginActive={loginActive} setLoginActive={setLoginActive} />

          <div
            onClick={() => setLoginActive(true)}
            className={` rounded-full bg-[#FFFFFF] absolute left-1/2 -translate-x-1/2 
                    text-[#8B8B8B] ${
                      loginActive
                        ? "top-[13%] w-[680px] sm:w-[850px] h-[600px]"
                        : "w-[320px] sm:w-[800px] h-[800px] top-[85%]"
                    } transition-all duration-300 ease-in-out`}
          >
            {!loginActive && (
              <h1 className="text-center text-3xl font-[630] mt-[2rem]">
                Login
              </h1>
            )}
          </div>

          <div
            className={`absolute left-0 w-full top-0 bottom-0 ${
              loginActive ? "translate-y-[14%]" : "translate-y-[100%]"
            } transition-transform duration-300 ease-in-out`}
          >
            <Login />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Authentication;
