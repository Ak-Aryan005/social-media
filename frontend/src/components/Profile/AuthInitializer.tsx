import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { fetchCurrentUser } from "@/redux/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return null;
}
