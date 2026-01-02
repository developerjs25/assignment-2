"use client"

import { useState } from 'react';
import Layout from '../layout/page';
import { ToastContainer, toast } from 'react-toastify';
import { useRouter } from "next/navigation";

const SignupForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      if (data.message === "Email address is already registered") {
        toast.error("Email address is already registered");
      } else {
        toast.error(data.message || "Something went wrong");
      }
      return;
    }

    const { token, name, image, id } = data;

    localStorage.setItem("token", token);
    localStorage.setItem("name", form.name);
    localStorage.setItem("image", image);
    localStorage.setItem("userId", id);

    toast.success("User is saved");
    setForm({ name: "", email: "", password: "" });
    router.push("/admin/Userlist");
  };

  return (
    <Layout>
      <div className="h-[85vh] flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Sign Up</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Username</label>
              <input type="text" id="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none sm:text-sm text-gray-700" required placeholder='Enter your Username' />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none sm:text-sm text-gray-700" required placeholder='Enter your Email' />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1  w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none sm:text-sm text-gray-700" required placeholder='Password' />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 rounded-md  text-lg font-medium text-white bg-[#FA9609] hover:bg-[#ffaf3f] focus:outline-none" >Create Account</button>
          </form>
          <ToastContainer />
        </div>
      </div>
    </Layout>
  );
};
export default SignupForm;