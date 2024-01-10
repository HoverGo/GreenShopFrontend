import axios from "axios";
import Cookies from "js-cookie";
import API_URL from "./apiConfig";

interface RegisterData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface LoginData {
    username: string;
    password: string;
}

const apiBaseUrl = `${API_URL}/`;

let tokenRefreshInterval: NodeJS.Timeout;

export const register = async (userData: RegisterData): Promise<void> => {
    const { username, email, password, confirmPassword } = userData;

    if (password.length < 8) {
        throw new Error("Password should be at least 8 characters long!");
    }

    try {
        const response = await axios.post(`${apiBaseUrl}registration/`, {
            username,
            email,
            password,
            confirmPassword,
        });

        if (response.status === 201) {
            alert(
                "Your account has been created. Please confirm your account through the email provided."
            );
        }
    } catch (error) {
        if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.data &&
            error.response.data.errors
        ) {
            const { errors } = error.response.data;
            if (errors.username && errors.username.length > 0) {
                const usernameError: string = errors.username[0];
                alert(`Error - Username: ${usernameError}`);
            }
            if (errors.email && errors.email.length > 0) {
                const emailError: string = errors.email[0];
                alert(`Error - Email: ${emailError}`);
            }
        } else {
            console.error("Unexpected error occurred:", error);
        }
    }
};

export const login = async (userData: LoginData): Promise<void> => {
    try {
        const response = await axios.post(`${apiBaseUrl}login/`, userData);
        const { access, refresh } = response.data;

        if (access && refresh) {
            localStorage.setItem("accessToken", access);
            Cookies.set("refreshToken", refresh, { expires: 30 });

            startTokenRefreshInterval();
            window.location.reload();
        } else {
            console.error("Tokens are missing in the response");
            throw new Error("Tokens are missing");
        }
    } catch (error) {
        console.error("Login error:", error);

        if (
            axios.isAxiosError(error) &&
            error.response &&
            error.response.status === 401
        ) {
            alert(
                "No active accounts were found with the specified information."
            );
        } else {
            throw new Error("Login failed");
        }
    }
};

export const getAuthHeaders = () => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        return {
            headers: {
                Authorization: `Token ${accessToken}`,
            },
        };
    }

    return {};
};

const refreshAccessToken = async () => {
    try {
        const refresh = Cookies.get("refreshToken");
        if (!refresh) {
            throw new Error("Refresh token is missing");
        }

        console.log("Refreshing access token...");

        const response = await axios.post(`${apiBaseUrl}token/refresh/`, {
            refresh,
        });
        const newAccessToken = response.data.access;

        if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            localStorage.setItem("lastTokenRefresh", Date.now().toString()); // Сохранить время последнего обновления токена
        } else {
            throw new Error("New access token is missing in the response");
        }
    } catch (error) {
        console.error("Failed to refresh access token:", error);
        throw new Error("Failed to refresh access token");
    }
};

export const startTokenRefreshInterval = () => {
    const refreshInterval = 29 * 60 * 1000; // Интервал обновления токена (в миллисекундах)
    let lastTokenRefresh = localStorage.getItem("lastTokenRefresh");

    if (!lastTokenRefresh) {
        // Если нет сохраненного времени, установить текущее время
        lastTokenRefresh = Date.now().toString();
        localStorage.setItem("lastTokenRefresh", lastTokenRefresh);
    }

    const timeElapsed = Date.now() - parseInt(lastTokenRefresh, 10);
    const timeRemaining = refreshInterval - timeElapsed;

    if (timeRemaining < 0) {
        // Если прошло больше времени, чем интервал обновления токена, обновить токен сразу
        refreshAccessToken();
    } else {
        // Иначе установить таймер для обновления токена через оставшееся время
        tokenRefreshInterval = setTimeout(() => {
            refreshAccessToken();
            startTokenRefreshInterval();
        }, timeRemaining);
    }
};

startTokenRefreshInterval();

export const isUserLoggedIn = (): boolean => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = Cookies.get("refreshToken");
    return !!accessToken && !!refreshToken;
};

export const logout = (): void => {
    clearInterval(tokenRefreshInterval);
    localStorage.removeItem("accessToken");
    Cookies.remove("refreshToken");
};

export const initApp = () => {
    const refreshToken = Cookies.get("refreshToken");
    if (refreshToken) {
        startTokenRefreshInterval();
    }
};

initApp();
