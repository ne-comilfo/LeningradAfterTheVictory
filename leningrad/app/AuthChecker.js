import { useState } from "react";
import { useRouter } from "next/navigation";

const AuthChecker = ({ onAuthComplete }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Функция проверки авторизации (без useEffect)
    const checkAuth = async () => {
        try {
            const response = await fetch("http://194.87.252.234:6060/api/user/getUser", {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 200) {
                await new Promise((resolve) => setTimeout(resolve, 2000)); // Задержка 2 сек
                setLoading(false);
                onAuthComplete();
            } else {
                setTimeout(() => {
                    router.push("/authentication-authorization");
                }, 2000);
            }
        } catch (error) {
            console.error("Ошибка при проверке авторизации:", error);
            router.push("/authentication-authorization");
        }
    };

    // Выполняем проверку перед рендером
    if (loading) {
        checkAuth();
        return <div className="download">Загрузка...</div>;
    }

    return null;
};

export default AuthChecker;
