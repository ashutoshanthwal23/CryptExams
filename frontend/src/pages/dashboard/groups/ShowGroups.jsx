import { Link } from "react-router";
import { useShowGroupsQuery } from "../../../store/api/groupsAPI";
import { useEffect } from "react";
import { ToastError } from "../../../components/toastify/Toast";

const ShowGroups = () => {
    const { data, isLoading, isError, error } = useShowGroupsQuery();

    useEffect(() => {
        if(isError){
            ToastError("couldn't fetch");
        }
    }, [isError]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {
                        data && data.groups.map((group) => {
                            return (
                                <Link key={group.id} to={group.id} className="border-2 hover:border-blue-500 hover:scale-105 border-gray-300 p-6 rounded-lg shadow hover:shadow-md transition-all bg-white">
                                    <h1 className="text-2xl font-semibold text-blue-600 mb-4 border-b border-indigo-300 pb-2 break-words">
                                        {group.name}
                                    </h1>
                                    
                                    <p className="text-gray-600 break-words">
                                        {group.description}
                                    </p>
                                </Link>
                            )
                        })
                    }

                    </div>
    )
}

export default ShowGroups;