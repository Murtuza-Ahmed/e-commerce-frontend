import { useEffect, useState } from "react";
import { SEO } from "@/components/SEO";
import { ProductGridSkeleton } from "@/components/ui/skeleton-loader";
import { FormField } from "@/components/ui/FormField";
import { ApiError } from "@/lib/api-client";
import {
  listUsers,
  createUser,
  updateUser,
  setUserRole,
  setUserActive,
  deleteUser,
} from "@/api/users";
import type { Paginated, User, UserRole } from "@/types";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  UserCheck,
  UserX,
  BadgeCheck,
} from "lucide-react";

const PAGE_SIZE = 10;

const roleBadge: Record<UserRole, string> = {
  super_admin: "bg-destructive/10 text-destructive",
  admin: "bg-primary/10 text-primary",
  customer: "bg-muted text-muted-foreground",
};

const ROLES: UserRole[] = ["customer", "admin", "super_admin"];

function errMsg(err: unknown): string {
  return err instanceof ApiError ? err.message : "Something went wrong — please try again";
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-sm w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [meta, setMeta] = useState<Paginated<User>["meta"] | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  // Add-user form
  const [fName, setFName] = useState("");
  const [fEmail, setFEmail] = useState("");
  const [fPassword, setFPassword] = useState("");
  const [fPhone, setFPhone] = useState("");
  const [fRole, setFRole] = useState<UserRole>("customer");

  // Edit-user form
  const [eName, setEName] = useState("");
  const [ePhone, setEPhone] = useState("");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchUsers = async (p: number, s: string) => {
    const res = await listUsers({ page: p, limit: PAGE_SIZE, search: s || undefined });
    setUsers(res.data);
    setMeta(res.meta);
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchUsers(page, search)
      .catch((err) => {
        if (!cancelled) toast.error(errMsg(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [page, search]);

  const refresh = () => fetchUsers(page, search);

  async function runAction(id: string, label: string, fn: () => Promise<unknown>) {
    setBusy(id);
    try {
      await fn();
      toast.success(label);
      await refresh();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(null);
    }
  }

  const toggleActive = (u: User) =>
    runAction(u.id, u.isActive ? "User deactivated" : "User activated", () =>
      setUserActive(u.id, !u.isActive)
    );

  const changeRole = (u: User, role: UserRole) => {
    if (role === u.role) return;
    runAction(u.id, `Role changed to ${role}`, () => setUserRole(u.id, role));
  };

  const removeUser = (u: User) => {
    if (!window.confirm(`Delete user "${u.email}"? This cannot be undone.`)) return;
    runAction(u.id, "User deleted", () => deleteUser(u.id));
  };

  const openEdit = (u: User) => {
    setEditing(u);
    setEName(u.name);
    setEPhone(u.phone ?? "");
  };

  const submitAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fName.trim() || !fEmail.trim() || fPassword.length < 8) {
      toast.error("Name, email and password (min 8 chars) are required");
      return;
    }
    setBusy("add");
    try {
      await createUser({
        name: fName.trim(),
        email: fEmail.trim(),
        password: fPassword,
        phone: fPhone.trim() || undefined,
        role: fRole,
      });
      toast.success("User created");
      setAddOpen(false);
      setFName("");
      setFEmail("");
      setFPassword("");
      setFPhone("");
      setFRole("customer");
      await refresh();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(null);
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing || !eName.trim()) {
      toast.error("Name is required");
      return;
    }
    setBusy(editing.id);
    try {
      await updateUser(editing.id, {
        name: eName.trim(),
        phone: ePhone.trim() || undefined,
      });
      toast.success("User updated");
      setEditing(null);
      await refresh();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(null);
    }
  };

  const totalPages = meta?.totalPages ?? 1;

  return (
    <div>
      <SEO title="Admin - Users" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold">Users</h1>
          <p className="text-sm font-body text-muted-foreground mt-1">
            {meta ? `${meta.total} total users` : "Loading users…"}
          </p>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-foreground text-background px-4 py-2.5 text-xs font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-sm text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
        />
      </div>

      {loading ? (
        <ProductGridSkeleton count={6} />
      ) : users.length === 0 ? (
        <div className="bg-card border border-border rounded-sm p-12 text-center">
          <p className="font-body text-muted-foreground">No users found.</p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="bg-card border border-border rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">User</th>
                    <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden md:table-cell">Role</th>
                    <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden lg:table-cell">Verified</th>
                    <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3 hidden lg:table-cell">Joined</th>
                    <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Status</th>
                    <th className="text-left text-[10px] font-body font-semibold tracking-wider uppercase text-muted-foreground px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {u.avatarUrl ? (
                            <img src={u.avatarUrl} alt={u.name} className="w-9 h-9 rounded-full object-cover" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-body font-bold text-muted-foreground shrink-0">
                              {initials(u.name)}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-body font-medium truncate">{u.name}</p>
                            <p className="text-xs font-body text-muted-foreground truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <select
                          value={u.role}
                          disabled={busy === u.id}
                          onChange={(e) => changeRole(u, e.target.value as UserRole)}
                          title="Change role"
                          className={`text-[10px] font-body font-bold tracking-wider uppercase px-2 py-1 rounded-sm cursor-pointer focus:outline-none disabled:opacity-50 ${roleBadge[u.role]}`}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {u.emailVerified ? (
                          <span className="flex items-center gap-1 text-xs font-body text-success">
                            <BadgeCheck className="w-4 h-4" /> Yes
                          </span>
                        ) : (
                          <span className="text-xs font-body text-muted-foreground">No</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs font-body text-muted-foreground hidden lg:table-cell">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(u)}
                          disabled={busy === u.id}
                          title={u.isActive ? "Deactivate user" : "Activate user"}
                          className={`flex items-center gap-1.5 text-[10px] font-body font-bold tracking-wider uppercase px-2 py-1 rounded-sm transition-colors disabled:opacity-50 ${
                            u.isActive
                              ? "bg-success/10 text-success hover:bg-success/20"
                              : "bg-muted text-muted-foreground hover:bg-muted/70"
                          }`}
                        >
                          {u.isActive ? (
                            <><UserCheck className="w-3.5 h-3.5" /> Active</>
                          ) : (
                            <><UserX className="w-3.5 h-3.5" /> Inactive</>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openEdit(u)}
                            title="Edit name / phone"
                            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeUser(u)}
                            disabled={busy === u.id}
                            title="Delete user"
                            className="p-2 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-xs font-body text-muted-foreground">
              Page {meta?.page ?? page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 border border-border text-foreground px-3 py-2 text-xs font-body font-semibold rounded-sm hover:bg-muted transition-colors disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" /> Prev
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="flex items-center gap-1 border border-border text-foreground px-3 py-2 text-xs font-body font-semibold rounded-sm hover:bg-muted transition-colors disabled:opacity-40"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add User modal */}
      {addOpen && (
        <Modal title="Add User" onClose={() => setAddOpen(false)}>
          <form onSubmit={submitAdd} className="space-y-4">
            <FormField label="Full Name" type="text" value={fName} onChange={(e) => setFName(e.target.value)} required />
            <FormField label="Email" type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} required />
            <FormField label="Password" type="password" value={fPassword} onChange={(e) => setFPassword(e.target.value)} required minLength={8} />
            <FormField label="Phone (optional)" type="tel" value={fPhone} onChange={(e) => setFPhone(e.target.value)} />
            <div className="space-y-1.5">
              <label className="text-xs font-body font-semibold tracking-wide uppercase block">Role</label>
              <select
                value={fRole}
                onChange={(e) => setFRole(e.target.value as UserRole)}
                className="w-full px-4 py-3 bg-background border border-border rounded-sm text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={busy === "add"}
              className="w-full bg-foreground text-background py-3 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {busy === "add" ? "Creating…" : "Create User"}
            </button>
          </form>
        </Modal>
      )}

      {/* Edit User modal */}
      {editing && (
        <Modal title="Edit User" onClose={() => setEditing(null)}>
          <form onSubmit={submitEdit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-body font-semibold tracking-wide uppercase block">Email</label>
              <input
                value={editing.email}
                disabled
                className="w-full px-4 py-3 bg-muted border border-border rounded-sm text-sm font-body text-muted-foreground"
              />
            </div>
            <FormField label="Full Name" type="text" value={eName} onChange={(e) => setEName(e.target.value)} required />
            <FormField label="Phone" type="tel" value={ePhone} onChange={(e) => setEPhone(e.target.value)} />
            <button
              type="submit"
              disabled={busy === editing.id}
              className="w-full bg-foreground text-background py-3 text-sm font-body font-semibold tracking-wider uppercase rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {busy === editing.id ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AdminUsers;
