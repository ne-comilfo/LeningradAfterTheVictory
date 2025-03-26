import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthChecker = ({ onAuthComplete }) => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const handleAuth = async () => {
            try {
                const response = await fetch("http://194.87.252.234:6060/api/user/getUser", {
                    method: "GET",
                    credentials: "include",
                });
                console.log(response)
                if (response.status === 200) {
                    setTimeout(() => {
                        setLoading(false);
                        router.push("/personal-account")
                        onAuthComplete(); // Сообщаем родителю, что проверка завершена
                    }, 2000);
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

        handleAuth();
    }, [router]);

    if (loading) {
        return <div className="download">Загрузка...</div>;
    }

    return null;
};

export default AuthChecker;
