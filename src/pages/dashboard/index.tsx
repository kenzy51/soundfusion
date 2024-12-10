import { useEffect } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import { geistSans, geistMono } from "@/lib/fonts";


const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/sign-in");
    }
  }, [router]);

  return (
    <div
      className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
    >
      <h1>Привет, музыкант!</h1>
      <h5>Данный этап на разработке..</h5>
    </div>
  );
};

export default Dashboard;
