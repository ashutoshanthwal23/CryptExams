import Navigation from "../navigation/index";

const Layout = ({ children }) => {
    return (
        <div className="max-w-full relative min-h-screen flex flex-col bg-[#EDF2F7]">
            <header className="bg-[#2B6CB0] text-white sticky left-0 top-0 right-0 w-full z-[900]">
                <Navigation />
            </header>

            <main className="flex-grow flex justify-center items-center">
                { children }
            </main>

            <footer className="bg-[#2D3748] text-white p-3 ">
                <span>CryptExams, inc. All rights reserved</span>
            </footer>
        </div>
    )
}

export default Layout;