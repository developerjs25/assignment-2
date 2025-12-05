"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Layout from "@/app/layout/page";
import { toast, ToastContainer } from "react-toastify";

export default function MyAccount() {
  const params = useParams();
  const userId = params.id;

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      if (!res.ok) {
        toast.error("Failed to update");
        return;
      }
      setForm(prev => ({ ...prev, image: data.image || prev.image }));
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    }
  };

  return (
    <Layout>
       <div className="h-[85vh] flex items-center justify-center bg-gray-100">
         <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
           <h1 className="text-3xl font-bold text-center mb-6 text-gray-700">My Account</h1>
           <form onSubmit={handleSubmit} className="space-y-4">
          <div className="">
            <label htmlFor="image" className="flex justify-center items-center">
             {preview ? (
              <div className="w-32 h-32 rounded-full bg-amber-400">
              <img src={preview} className="w-32 h-32 mx-auto rounded-full mb-4 border-2 border-[#ffaf3f]" />
              </div>
            ): (
              <div className="w-32 h-32 rounded-full bg-amber-400">
                <p className="h-full w-full flex justify-center items-center text-6xl">{form.name.charAt(0).toUpperCase()}</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={(e) => {
              const f = e.target.files?.[0] || null; setFile(f);
              if (f) setPreview(URL.createObjectURL(f));
            }} id="image" className=" hidden w-full h-full text-black border p-2" />
            </label>
            </div>
            <input type="text" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none sm:text-md text-gray-700" />
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none sm:text-md text-gray-700" />
            <input type="text" placeholder="Mobile" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none sm:text-md text-gray-700" />
            <input type="date" placeholder="DOB" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className="mt-1 w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none sm:text-md text-gray-700" />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border rounded text-black">
              <option value="Active">Active</option>
              <option value="inActive">inActive</option>
            </select>
            <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full px-3 py-2 border rounded text-black">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="w-full flex justify-center py-2 px-4 rounded-md  text-lg font-medium text-white bg-[#FA9609] hover:bg-[#ffaf3f] focus:outline-none">Update</button>
          </form>
        </div>
        <ToastContainer />
      </div>
    </Layout>
  );
}

