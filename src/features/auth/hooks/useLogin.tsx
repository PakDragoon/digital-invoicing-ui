import { initCometChat, loginCometChat } from "@/common/utils/cometchat";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { setAccessToken, setRefreshToken } from "../../../common/utils/auth";
import { login } from "../services/authApi";
import { useAuthStore } from "../stores/authStore";
import { CometChatUIKit } from "@cometchat/chat-uikit-react";

interface LoginError {
    message: string;
    statusCode?: number;
    field?: "email" | "password" | "general";
}

const loginUser = async ({ email, password }: { email: string; password: string }): Promise<any> => {
    try {
        const response = await login(email, password);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const loginError: LoginError = {
                message: error.response?.data?.message || "Login failed",
                statusCode: error.response?.status,
                field: error.response?.data?.field || "general"
            };
            throw loginError;
        }
        throw {
            message: "An unexpected error occurred",
            field: "general"
        };
    }
};

export const useLogin = () => {
    const setUser = useAuthStore(state => state.setUser);
    const setTokens = useAuthStore(state => state.setTokens);

    const { mutate, isPending, isError, error, isSuccess } = useMutation({
        mutationFn: (data: { email: string; password: string }) => loginUser(data),
        onSuccess: async data => {
            const { accessToken, refreshToken, user } = data;
            try {
                await initCometChat(user.cometchat.appId, user.cometchat.region, user.cometchat.authKey);
                await CometChatUIKit.logout();
                console.log("🔒 Previous CometChat session logged out");
            } catch (e) {
                console.warn("⚠️ Failed to logout previous CometChat session", e);
            }
            setUser({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                fullName: user.fullName ?? "",
                role: user.role,
                status: user.status,
                isAdmin: user.isAdmin,
                companyId: user.companyId,
                roleId: user.roleId,
                cometchatUid: user.cometchatUid,
                cometchat: user.cometchat
            });
            setTokens(accessToken, refreshToken);
            setAccessToken(accessToken);
            setRefreshToken(refreshToken);

            if (user?.cometchat?.appId && user?.cometchat?.authKey && user?.cometchatUid) {
                try {
                    await initCometChat(user.cometchat.appId, user.cometchat.region, user.cometchat.authKey);
                    await loginCometChat(user.cometchatUid, user.cometchat.authKey);
                    const cometUser = await CometChatUIKit.getLoggedinUser?.();
                    console.log("✅ CometChat login successful for:", cometUser?.getUid());
                } catch (err) {
                    console.error("❌ CometChat login failed", err);
                }
            }
        },
        onError: error => {
            console.error("Login failed", error);
            return {
                message: error?.message || "Login failed. Please try again."
            };
        }
    });

    const handleLogin = (email: string, password: string) => {
        mutate({ email, password });
    };

    return { login: handleLogin, isPending, isError, error, isSuccess };
};
