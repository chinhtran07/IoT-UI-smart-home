import { useRouter } from "expo-router"

export const navigateToLogin = () => {
    const route = useRouter();
    route.navigate("/");
}