"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [roleFilter, setRoleFilter] = useState("");
  const [total, setTotal] = useState(0);

  const fetchUsers = async () => {
    const res = await fetch(`/api/users?page=${page}&limit=${limit}&role=${roleFilter}`)
    const data = await res.json();
    setUsers(data.data);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchUsers();
  }, [page, limit, roleFilter]);

  const handleRoleChange = async (id: number, newRole: string) => {
    const resp = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (resp.ok) {
      toast("Role updated successfully!");
      fetchUsers();
    } else {
      toast.error("Failed to update role");
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    const resp = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (resp.ok) {
      toast("Status updated successfully!");
      fetchUsers();
    } else {
      toast.error("Failed to update status");
    }
  };

 
  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      fetchUsers();
      toast("User Deleted successfully!")
    } 
  };

 
  return (
    <div>
      <h1 className="text-center text-3xl font-bold my-4">Users List</h1>
      <div className="flex justify-end items-center ">
      <select className="p-2 text-lg bg-amber-500 focus:outline-none" onChange={(e) => setRoleFilter(e.target.value)}>
        <option value="">All Roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="text-left">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Mobile</th>
            <th className="border p-2">DOB</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Edit or Delete</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(users) &&
            users
              .filter((u: any) => {
                if (roleFilter === "user" && u.name?.toLowerCase() === "peter") {
                  return false;
                }
                return true;
               
                
              })
              .map((u: any) => (

                <tr key={u.id} className="border">
                  <td className="border p-2">{u.name}</td>
                  <td className="border p-2">{u.email}</td>
                  <td className="border p-2">{u.mobile}</td>
                  <td className="border p-2">{u.dob?.split("T")[0]}</td>
                  <td className="border p-2">
                    <button onClick={() =>  handleStatusChange( u.id, u.status === "active" ? "inactive" : "active" ) } >{u.status === "active" ? "active" : "inactive"}</button>
                    </td>
                  <td>
                    <button onClick={() => handleRoleChange(u.id, u.role == "admin" ? "user" : "admin")}> {u.role === "user" ? "user" : "admin"}</button>
                  </td>
                  <td className="border p-2">
                    <Link className="px-3 text-blue-600" href={`/Myaccount/${u.id}`}>Edit</Link>
                    <button className="text-red-600 px-3" onClick={() => handleDelete(u.id)}>Delete</button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      <div className="rounded-2xl flex justify-center items-center gap-2 py-5">
        {Array.from({ length: Math.ceil(total / limit) }, (_, i) => i + 1).map((p) => (
          <button key={p} className={`py-1 px-3 rounded-full border-2 border-white ${page === p ? "bg-blue-600" : "bg-gray-600"}`} onClick={() => setPage(p)} > {p}   </button>
        ))}
      </div>
      <ToastContainer />
    </div>
  );
}