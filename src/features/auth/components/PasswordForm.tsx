import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import { useEffect } from "react"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { RelayLogo } from "../../../assets"
import TextField from "../../../common/components/TextField"
import { ROUTES } from "../../../common/routes"
import { forgotPasswordSchema } from "../schemas/passwordSchema"
import { useUpdatePassword } from "../hooks/useUpdatePassword"
import { toast } from "react-toastify"

type PasswordFormData = z.infer<typeof forgotPasswordSchema>

const PasswordForm = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const token = searchParams.get("token")
    const companyId = searchParams.get("companyId")
    const employeeId = searchParams.get("employeeId")
    const { mutate, isPending, isError, error } = useUpdatePassword();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<PasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit: SubmitHandler<PasswordFormData> = async (data) => {
        try {
            mutate(
                {
                    payload: {
                        companyId: companyId!,
                        password: data.password,
                    },
                    accessToken: token!,
                    employeeId: employeeId!,
                },
                {
                    onSuccess: () => {
                        navigate({ to: ROUTES.ROOT });
                    },
                }
            );
        } catch (error) {
            console.error("❌ Failed to reset password", error);
        }
    };

    useEffect(() => {
        if (isError) {
            toast.error(`❌ Error resetting password: ${error.message}`);
        }
    }, [isError, error]);

    return (
        <div className="flex min-h-screen w-[24.0625rem] flex-col items-center justify-center">
            <div className="flex w-full flex-col justify-center">
                <img src={RelayLogo} alt="Logo" className="mb-8" />

                <h2 className="mb-[0.9375rem] text-center text-[30px] font-semibold leading-[38px] text-shark-500">
                    Reset Your Password
                </h2>

                <p className="text-center text-[16px] font-normal text-shark-500">
                    Please enter and confirm your new password
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-12">
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="New Password"
                                placeholder="Enter new password"
                                type="password"
                                {...field}
                                error={errors.password?.message}
                            />
                        )}
                    />

                    <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                label="Confirm New Password"
                                placeholder="Re-enter new password"
                                type="password"
                                {...field}
                                error={errors.confirmPassword?.message}
                            />
                        )}
                    />

                    <button
                        type="submit"
                        className="flex h-[2.75rem] w-full items-center justify-center rounded-[0.25rem] bg-cerulean-600 text-[1rem] font-medium leading-none text-white transition hover:bg-cerulean-700 disabled:bg-gray-400"
                        disabled={isPending}
                    >
                        {isPending ? "Resetting..." : "Reset Password"}
                    </button>
                </form>

                <p className="font-inter mt-4 text-center text-[14px] font-medium leading-[20px] text-shark-500">
                    {/*Don't have an account?{" "}*/}
                    {/*<Link to={ROUTES.SIGNUP} className="text-[14px] text-primary hover:underline">*/}
                    {/*    Signup*/}
                    {/*</Link>*/}
                </p>
            </div>
        </div>
    )
}

export default PasswordForm
