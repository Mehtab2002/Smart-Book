"use client"
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
export default function Home() {
  const router = useRouter();
  return (
<>
      <Navbar />
      <div>I am Dashboard</div>
      <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Default</button>
      <button className="bg-blue-600 px-4 py-2 rounded-full text-sm font-bold text-white" onClick={()=>{router.push("/customers")}}>Customers</button>
</>
  );
}
