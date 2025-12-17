"use client";
import Layout from "@/app/layout/page";
import { Pagination } from "@heroui/react";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import Modal from "../../components/Modal";
import MyAccountPopup from "../../components/MyAccountPopup";

export default function AdminUsers() {
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);



  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        role: roleFilter,
        status: statusFilter,
        search,
      });

      const res = await fetch(`/api/users?${params.toString()}`);

      if (!res.ok) {
        toast.error("Failed to fetch users");
        setUsers([]);
        setTotal(0);
        return;
      }

      const data = await res.json();
      setUsers(data.data || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
      setUsers([]);
      setTotal(0);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: any = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(decoded.userId);
      } catch {
        console.log("Invalid token");
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, limit, roleFilter, statusFilter, search]);



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
      toast("User Deleted successfully!");
    }
  };

  const openEditPopup = (id: number) => {
    setSelectedUserId(id);
    setShowPopup(true);
  };

  return (
    <Layout>
      <h1 className="text-center text-3xl font-bold my-4">Users List</h1>

      <div className="flex justify-end items-center p-3 gap-73">
        <input type="text" placeholder="Search by email or mobile" className="border px-3 py-2 rounded w-90 focus:outline-none"
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
        <div className="flex justify-center items-center gap-4">
          <select className="p-2 text-lg bg-amber-500 focus:outline-none rounded-md"
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select className="p-2 text-lg bg-amber-500 focus:outline-none rounded-md"
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <table className="w-full border-collapse border">
        <thead>
          <tr className="text-left">
            <th className="border p-2">Image</th>
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
          {users.map((u) => (
            <tr key={u.id} className="border">
              <td className="border p-2">
                {u.image ? (
                  <img src={u.image} className="w-14 h-14 rounded-full object-cover" />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold">
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </td>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.mobile}</td>
              <td className="border p-2">{u.dob?.split("T")[0]}</td>
              <td className="border p-2">
                <button onClick={() => handleStatusChange(u.id, u.status === "active" ? "inactive" : "active")}>
                  {u.status}
                </button>
              </td>
              <td className="border p-2">
                <button onClick={() => handleRoleChange(u.id, u.role === "admin" ? "user" : "admin")}>{u.role}</button>
              </td>
              <td className="border p-2">
                {u.id !== currentUserId ? (
                  <>
                    <button className="px-3 text-blue-600 underline" onClick={() => openEditPopup(u.id)}>Edit</button>
                    <button className="text-red-600 px-3" onClick={() => {
                      setDeleteUserId(u.id);
                      setShowDeleteConfirm(true);
                    }}>Delete</button>
                  </>
                ) : (
                  <span className="text-gray-400">Not Allowed</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {total > limit && (
        <div className="flex justify-center py-6 ">
          <Pagination showControls page={page} total={Math.ceil(total / limit)} onChange={(p) => setPage(p)}
            classNames={{
              base: "gap-9",
              item: "w-9 h-9 text-sm font-semibold bg-gray-100 text-gray-700 rounded-full hover:bg-amber-500 hover:text-white transition",
              cursor: "bg-amber-500 text-white rounded-full shadow-md",
              prev: "bg-white border rounded-full w-9 h-9 hover:bg-amber-500 hover:text-white",
              next: "bg-white border rounded-full w-9 h-9 hover:bg-amber-500 hover:text-white",
            }} />
        </div>
      )}
      <ToastContainer />
      {showPopup && selectedUserId && (
        <Modal onClose={() => setShowPopup(false)}>
          <MyAccountPopup userId={selectedUserId} />
        </Modal>
      )}
      {showDeleteConfirm && deleteUserId && (
        <Modal onClose={() => setShowDeleteConfirm(false)}>
          <div className="p-6 text-center">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>Are you sure you want to delete this user?</p>
            <div className="mt-6 flex justify-center gap-4">
              <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={async () => { await handleDelete(deleteUserId); setShowDeleteConfirm(false); }}>
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
}
