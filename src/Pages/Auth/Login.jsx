import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { doAdminLogin } from "../../services/AuthService";
import { useNavigate } from "react-router-dom";
import api, { loadCsrfToken } from "../../services/api";
import { encryptvalue } from "../../utils/AESEncrypted";

const Login = () => {
    const [loginError, setLoginError] = useState("");
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({

    });

    useEffect(() => {

    }, [])

    const onSubmit = async (data) => {
        var requestdata = encryptvalue(JSON.stringify({
            userName: encryptvalue(data.userName),
            password: encryptvalue(data.Password),
            roleName: encryptvalue("@dmin&")
        }))
        const _result = await doAdminLogin({
            data: requestdata
        });        
        if (_result.statuscode === 200) {
            localStorage.setItem("token", _result.data.token);
            localStorage.setItem("serial",_result.data.lId);
            localStorage.setItem("serialtype",_result.data.rId);
            loadCsrfToken();
            setLoginError(_result.message);
            navigate("/sales", { replace: true });
        } else {
            setLoginError(_result.message);
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-700 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Login to Your Account
                </h2>

                <form onSubmit={(e) => {
                    e.preventDefault(); // ✅ prevent page reload
                    handleSubmit(onSubmit)(); // call react-hook-form submit
                }} className="space-y-5">
                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            {...register("userName")}
                            placeholder="Enter your username"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                        />

                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            {...register("Password")}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                            required
                        />
                    </div>
                    {loginError ? <p>{loginError}</p> : ""}
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-500">
                    Don’t have an account?{" "}
                    <a href="#" className="text-indigo-600 hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    )
}

export default Login