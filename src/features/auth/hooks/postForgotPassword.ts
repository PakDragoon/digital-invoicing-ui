import api from "@/core/config/api"

export const postForgotPassword = async (email: string): Promise<void> => {
    try {
        await api.post('/employee/auth/forget-password', {
            email,
        })

    } catch (error) {
        console.error('❌ Failed to send forgot password email:', error)
    }
}
