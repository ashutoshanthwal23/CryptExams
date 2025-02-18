import { Link } from "react-router";
import { useGetStudentGroupsQuery } from "../../../store/api/groupsAPI";
import { useEffect } from "react";
import { ToastError } from "../../../components/toastify/Toast";
import Loader from "../../../components/spinningLoader/Loader";

const ViewGroups = () => {
    const {data, isError, isLoading, error} = useGetStudentGroupsQuery();

    useEffect(() => {
        if(isError){
            ToastError("couldn't fetch")
        }
    }, [isError])

    return(
        isLoading ? <Loader />
        :
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {
            data && data.groups.map((group) => {
                return (
                    <Link key={group.id} to={group.id} className="p-6 rounded-lg shadow-lg hover:shadow-xl transition-all bg-white">
                        <h1 className="text-3xl font-semibold text-gray-900 mb-4 border-b border-indigo-300 pb-2 break-words">
                            {group.name}
                        </h1>
                        
                        <p className="text-gray-600 break-words">
                            {group.description}
                        </p>
                        <button className="block mr-0 ml-auto"><i className="fa-solid fa-user mr-2"></i>{group.owner.name}</button>

                    </Link>
                )
            })
        }

        </div>
    )
}

export default ViewGroups;