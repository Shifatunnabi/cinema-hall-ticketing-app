"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AdminLayout from "@/components/admin-layout";

interface UserRow {
  _id: string;
  email: string;
  name?: string;
  role: "admin" | "moderator";
  isActive: boolean;
  createdAt: string;
}

export default function ManageUsersPage() {
  const [list, setList] = useState<UserRow[]>([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"admin" | "moderator">("moderator");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [myRole, setMyRole] = useState<"admin" | "moderator" | null>(null);

  const load = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (res.ok) setList(data.users);
  };

  useEffect(() => {
    (async () => {
      const r = await fetch("/api/auth/whoami");
      const d = await r.json();
      setMyRole(d.role);
      await load();
    })();
  }, []);

  const invite = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to invite");
      else {
        setEmail("");
        await load();
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const removeUser = async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/users?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to delete");
      else await load();
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  const changeRole = async (id: string, newRole: "admin" | "moderator") => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role: newRole }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to change role");
      else await load();
    } catch (e) {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-4 md:p-8 space-y-6">
        {myRole === "admin" && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle>Invite Admin/Moderator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Input
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <select
                  className="border rounded px-3 py-2"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                </select>
                <Button
                  disabled={loading}
                  onClick={invite}
                  className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9]"
                >
                  {loading ? "Sending..." : "Send Invite"}
                </Button>
              </div>
              {error && <div className="text-red-600">{error}</div>}
            </CardContent>
          </Card>
        )}

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle>Admins & Moderators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left">
                    <th className="p-2">Email</th>
                    <th className="p-2">Name</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((u) => (
                    <tr key={u._id} className="border-t">
                      <td className="p-2">{u.email}</td>
                      <td className="p-2">{u.name || "-"}</td>
                      <td className="p-2">
                        {myRole === "admin" ? (
                          <select
                            className="border rounded px-2 py-1"
                            value={u.role}
                            onChange={(e) =>
                              changeRole(u._id, e.target.value as any)
                            }
                          >
                            <option value="admin">Admin</option>
                            <option value="moderator">Moderator</option>
                          </select>
                        ) : (
                          u.role
                        )}
                      </td>
                      <td className="p-2">
                        {u.isActive ? "Active" : "Pending"}
                      </td>
                      <td className="p-2">
                        {myRole === "admin" && (
                          <Button
                            variant="destructive"
                            onClick={() => removeUser(u._id)}
                          >
                            Remove
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
