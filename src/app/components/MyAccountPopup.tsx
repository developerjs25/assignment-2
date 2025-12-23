"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";

export default function MyAccountPopup({
  userId,
  mode = "self", 
}: {
  userId: number;
  mode?: "self" | "admin";
}){
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    status: "",
    role: "",
    image: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${userId}`);
        const data = await res.json();

        setForm({
          name: data.name || "",
          email: data.email || "",
          mobile: data.mobile || "",
          dob: data.dob?.split("T")[0] || "",
          status: data.status || "",
          role: data.role || "",
          image: data.image || "",
        });

        if (data.image) setPreview(data.image);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.mobile.length !== 10) {
      toast.error("Mobile number must be exactly 10 digits");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("mobile", form.mobile);
    formData.append("dob", form.dob);
    formData.append("status", form.status);
    formData.append("role", form.role);
    if (file) formData.append("image", file);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok && data.message === "Mobile number is already registered") {
        toast.error("Mobile number is already registered");
        return;
      }

      setForm((prev) => ({ ...prev, image: data.image || prev.image }));
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

  return (
    <div className="w-full max-h-[85vh] overflow-y-auto px-2">
      <h1 className="text-3xl font-bold text-center mb-6">My Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex justify-center">
          {preview ? (
            <img src={preview} className="w-32 h-32 rounded-full border-2 border-[#ffaf3f]"/>
          ) : (
            <div className="w-32 h-32 rounded-full bg-amber-400 flex items-center justify-center text-5xl">
              {form.name.charAt(0).toUpperCase()}
            </div>
          )}
          <input type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0] || null; 
            setFile(f); if (f) setPreview(URL.createObjectURL(f));}}/>
        </label>
        <input type="text" placeholder="Name" value={form.name}
         onChange={(e) => setForm({ ...form, name: e.target.value })} 
         className="w-full px-3 py-3 border rounded-md focus:outline-none text-black"/>
        <input type="email" placeholder="Email" readOnly value={form.email}
          className="w-full px-3 py-3 border rounded-md focus:outline-none text-black"/>
        <input type="text" placeholder="Mobile" value={form.mobile} maxLength={10}
          onChange={(e) => {
            const clean = e.target.value.replace(/\D/g, "");
            if (clean.length <= 10) setForm({ ...form, mobile: clean });
          }} className="w-full px-3 py-3 border rounded-md focus:outline-none text-black"/>
        <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })}
          className="w-full px-3 py-3 border rounded-md focus:outline-none text-black"/>
        <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
          className="w-full px-3 py-3 border rounded-md focus:outline-none text-black">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full px-3 py-3 border rounded-md text-black">
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="w-full bg-[#FA9609] text-white py-3 rounded-md hover:bg-[#ffaf3f]">
          Update
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}
