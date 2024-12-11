import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/Home.module.css";
import { geistSans, geistMono } from "@/lib/fonts";

const Dashboard = () => {
  const router = useRouter();
  const [name, setName] = useState(null);
  const [goal, seGoal] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/sign-in");
    } else {
      const userName: any = localStorage.getItem("name");
      const goal: any = localStorage.getItem("goal");
      seGoal(goal);
      setName(userName);
    }
  }, [router]);

  if (!name) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
    >
      <h1>Привет, {name}!</h1>
      <h3>Твоя цель</h3>
      <p>{goal}</p>
      {/* <h5>Данный этап на разработке..</h5> */}
    </div>
  );
};

export default Dashboard;
