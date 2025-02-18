import Layout from "../../components/layout";

const Home = () => {
    return(
        <Layout>
            <div className="flex flex-col gap-4 sm:flex-row items-center p-5">
                <div className="sm:w-1/2 sm:pr-[16rem] sm:pl-[11rem]">
                    <h1 className="text-2xl font-bold w-[200px]">Welcome to CryptExams</h1>
                    <p>
                        In the age of online education, 
                        CryptExams is created to solve the challenges faced by both 
                        students and teachers during remote exams, especially when it comes to internet issues and security concerns.
                        With unreliable internet connections and the need for a secure and fair testing environment, we built this 
                        platform to ensure that exams can be taken smoothly, regardless of connectivity problems.
                    </p>
                </div>
                <div className="sm:w-1/2">
                    <img src="/images/home.png" className="w-full" />
                </div>
            </div>
        </Layout>
    )
}

export default Home;