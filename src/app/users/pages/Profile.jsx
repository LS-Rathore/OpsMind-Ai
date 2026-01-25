import axios from "axios";
import { User, Mail, Phone } from "lucide-react";
import { useEffect, useState } from "react";
const Profile = () => {
    const [data,setData] = useState([]);
    const token = localStorage.getItem('token')

    useEffect(() => {
        profileDetails();
    }, [])

    const profileDetails = async () => {
        try {
                 const res = await axios.get("http://localhost:3200/api/user/profile", {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
        setData(res?.data?.data)
        console.log(res.data.data)
        } catch (error) {
            console.log(error)
        }
   
    }

    return (
        <>
            <div className="min-h-screen w-full bg-[#212121] text-white">
                <div className="p-6 max-w-4xl mx-auto">
                    <div className="bg-neutral-900 rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-16 w-16 rounded-full bg-neutral-800 flex items-center justify-center">
                                <User size={28} className="text-neutral-300" />
                            </div>
                            <div>
                                <h2 className="text-xl font-medium">{data.fullname}</h2>
                                <p className="text-neutral-400 text-sm">User Account</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div className="flex items-center gap-4 bg-neutral-800 rounded-xl p-4">
                                <User size={20} className="text-neutral-400" />
                                <div>
                                    <p className="text-xs text-neutral-400">Full Name</p>
                                    <p className="font-medium">{data.fullname}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-neutral-800 rounded-xl p-4">
                                <Mail size={20} className="text-neutral-400" />
                                <div>
                                    <p className="text-xs text-neutral-400">Email</p>
                                    <p className="font-medium">{data.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-neutral-800 rounded-xl p-4">
                                <Phone size={20} className="text-neutral-400" />
                                <div>
                                    <p className="text-xs text-neutral-400">Mobile Number</p>
                                    <p className="font-medium">+91 {data.mobile}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Profile