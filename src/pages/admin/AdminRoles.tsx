import { useCallback, useEffect, useMemo, useState } from "react";
import { SEO } from "@/components/SEO";
import { ProductGridSkeleton } from "@/components/ui/skeleton-loader";
import { ApiError } from "@/lib/api-client";
import {
  listRoles,
  listPermissions,
  createRole,
  updateRole,
  setRolePermissions,
  deleteRole,
} from "@/api/rbac";
import type { Permission, Role } from "@/types";
import { toast } from "sonner";
import {
  ShieldCheck,
  Shield,
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  KeyRound,
  Loader2,
} from "lucide-react";

function errMsg(e: unknown, fallback: string): string {
  return e instanceof ApiError ? e.message : fallback;
}

/** permission key ka pehla hissa — "users:read" -> "users" */
function groupOf(p: Permission): string {
  const i = p.key.indexOf(":");
  return i > 0 ? p.key.slice(0, i) : "general";
}

const inputCls =
  "w-full min-h-11 bg-background border border-border rounded-sm px-3 py-2.5 text-small font-body placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

const AdminRoles = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [editRole, setEditRole] = useState<Role | null>(null);
  const [form, setForm] = useState({ name: "", description: "", level: 10 });

  const selected = useMemo(
    () => roles.find((r) => r.id === selectedId) ?? null,
    [roles, selectedId]
  );

  const load = useCallback(async () => {
    try {
      const [r, p] = await Promise.all([listRoles(), listPermissions()]);
      setRoles(r);
      setPermissions(p);
      setSelectedId((prev) => prev ?? r[0]?.id ?? null);
    } catch (e) {
      toast.error(errMsg(e, "Roles load nahi ho sake"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Role select hote hi uski permissions checkbox me bhar do
  useEffect(() => {
    if (selected?.permissions) {
      setChecked(new Set(selected.permissions.map((p) => p.id)));
    } else {
      setChecked(new Set());
    }
  }, [selected]);

  const grouped = useMemo(() => {
    const map = new Map<string, Permission[]>();
    for (const p of permissions) {
      const g = groupOf(p);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(p);
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [permissions]);

  const togglePerm = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSavePermissions = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      // Backend permission NAMES mangta hai — checked ids ko keys (names) me badlo
      const keys = [...checked]
        .map((pid) => permissions.find((p) => p.id === pid)?.key)
        .filter((k): k is string => !!k);
      const updated = await setRolePermissions(selected.id, keys);
      setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast.success(`"${updated.name}" ki permissions save ho gayin`);
    } catch (e) {
      toast.error(errMsg(e, "Permissions save nahi ho sakin"));
    } finally {
      setSaving(false);
    }
  };

  const openCreate = () => {
    setForm({ name: "", description: "", level: 10 });
    setShowCreate(true);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error("Role ka naam lazmi hai");
      return;
    }
    try {
      const role = await createRole({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        level: form.level,
      });
      setRoles((prev) => [...prev, role]);
      setSelectedId(role.id);
      setShowCreate(false);
      toast.success(`Role "${role.name}" ban gaya`);
    } catch (e) {
      toast.error(errMsg(e, "Role nahi ban saka"));
    }
  };

  const openEdit = (role: Role) => {
    setForm({ name: role.name, description: role.description ?? "", level: role.level });
    setEditRole(role);
  };

  const handleEdit = async () => {
    if (!editRole) return;
    try {
      const updated = await updateRole(editRole.id, {
        name: editRole.isSystem ? undefined : form.name.trim() || undefined,
        description: form.description.trim() || undefined,
      });
      setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setEditRole(null);
      toast.success("Role update ho gaya");
    } catch (e) {
      toast.error(errMsg(e, "Role update nahi ho saka"));
    }
  };

  const handleDelete = async (role: Role) => {
    if (role.isSystem) return;
    if (!window.confirm(`"${role.name}" role delete karna hai? Ye wapas nahi aayega.`)) return;
    try {
      await deleteRole(role.id);
      setRoles((prev) => {
        const next = prev.filter((r) => r.id !== role.id);
        if (selectedId === role.id) setSelectedId(next[0]?.id ?? null);
        return next;
      });
      toast.success(`Role "${role.name}" delete ho gaya`);
    } catch (e) {
      toast.error(errMsg(e, "Role delete nahi ho saka"));
    }
  };

  if (loading) {
    return (
      <div>
        <SEO title="Admin - Roles" />
        <div className="mb-8">
          <p className="eyebrow mb-2">Admin</p>
          <h1 className="font-display font-semibold text-display-3 md:text-display-2">Roles & Permissions</h1>
          <p className="text-small font-body text-muted-foreground mt-2">Loading roles…</p>
        </div>
        <ProductGridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div>
      <SEO title="Admin - Roles & Permissions" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="eyebrow mb-2">Admin</p>
          <h1 className="font-display font-semibold text-display-3 md:text-display-2">Roles & Permissions</h1>
          <p className="text-small font-body text-muted-foreground mt-2">
            {roles.length} roles · {permissions.length} permissions
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="w-4 h-4" /> New role
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roles list */}
        <div className="space-y-3">
          {roles.map((role) => {
            const active = role.id === selectedId;
            return (
              <div
                key={role.id}
                onClick={() => setSelectedId(role.id)}
                className={`bg-card border rounded-sm shadow-card p-5 cursor-pointer transition-colors ${
                  active ? "border-primary ring-1 ring-primary" : "border-border hover:border-muted-foreground/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {role.isSystem ? (
                      <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <Shield className="w-5 h-5 text-muted-foreground shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-display font-semibold text-small truncate">{role.name}</p>
                      <p className="text-caption font-body text-muted-foreground mt-0.5">
                        Level {role.level} · {role.permissions?.length ?? 0} permissions
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {role.isSystem && (
                      <span className="text-caption font-body font-semibold tracking-wider uppercase px-2 py-1 rounded-sm bg-primary/10 text-primary">
                        System
                      </span>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); openEdit(role); }}
                      className="min-h-10 min-w-10 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      title="Edit role"
                      aria-label={`Edit role ${role.name}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {!role.isSystem && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(role); }}
                        className="min-h-10 min-w-10 flex items-center justify-center rounded-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                        title="Delete role"
                        aria-label={`Delete role ${role.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {role.description && (
                  <p className="text-caption font-body text-muted-foreground mt-2 line-clamp-2">{role.description}</p>
                )}
              </div>
            );
          })}
          {roles.length === 0 && (
            <div className="bg-card border border-border rounded-sm shadow-card p-8 text-center">
              <p className="text-small font-body text-muted-foreground">Koi role nahi mila.</p>
            </div>
          )}
        </div>

        {/* Detail + permission matrix */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-card border border-border rounded-sm shadow-card p-6">
              <div className="flex items-center justify-between gap-3 mb-1">
                <h2 className="font-display font-semibold text-display-4 flex items-center gap-2 min-w-0">
                  <KeyRound className="w-5 h-5 text-primary shrink-0" />
                  <span className="truncate">{selected.name}</span>
                </h2>
                <span className="text-caption font-body text-muted-foreground whitespace-nowrap">
                  {checked.size} / {permissions.length} selected
                </span>
              </div>
              <p className="text-small font-body text-muted-foreground mb-6">
                {selected.description || "Koi description nahi."}
              </p>

              <div className="space-y-6 max-h-[520px] overflow-y-auto pr-1">
                {grouped.map(([group, perms]) => (
                  <div key={group}>
                    <p className="text-caption font-body font-semibold tracking-widest uppercase text-muted-foreground mb-2">
                      {group}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {perms.map((p) => {
                        const on = checked.has(p.id);
                        return (
                          <label
                            key={p.id}
                            className={`flex items-start gap-3 border rounded-sm p-3 min-h-11 cursor-pointer transition-colors ${
                              on ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() => togglePerm(p.id)}
                              className="mt-0.5 w-4 h-4 shrink-0 accent-primary"
                            />
                            <span className="min-w-0">
                              <span className="block text-caption font-body font-semibold font-mono">{p.key}</span>
                              {p.description && (
                                <span className="block text-caption font-body text-muted-foreground mt-0.5">
                                  {p.description}
                                </span>
                              )}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-border">
                <button
                  onClick={handleSavePermissions}
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save permissions
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-sm shadow-card p-12 text-center">
              <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-small font-body text-muted-foreground">Role select karo taake permissions dekho.</p>
            </div>
          )}
        </div>
      </div>

      {/* Create modal */}
      {showCreate && (
        <Modal onClose={() => setShowCreate(false)} title="New Role">
          <div className="space-y-4">
            <div>
              <label className="text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground block mb-1.5">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="e.g. support_agent" />
            </div>
            <div>
              <label className="text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground block mb-1.5">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} placeholder="Optional" />
            </div>
            <div>
              <label className="text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground block mb-1.5">Level (1–99)</label>
              <input type="number" min={1} max={99} value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} className={inputCls} />
            </div>
            <button onClick={handleCreate} className="btn-primary w-full">
              Create role
            </button>
          </div>
        </Modal>
      )}

      {/* Edit modal */}
      {editRole && (
        <Modal onClose={() => setEditRole(null)} title={`Edit — ${editRole.name}`}>
          <div className="space-y-4">
            <div>
              <label className="text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground block mb-1.5">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={editRole.isSystem}
                className={`${inputCls} ${editRole.isSystem ? "opacity-50 cursor-not-allowed" : ""}`}
                placeholder="Role name"
              />
              {editRole.isSystem && (
                <p className="text-caption font-body text-muted-foreground mt-1">System role ka naam change nahi ho sakta.</p>
              )}
            </div>
            <div>
              <label className="text-caption font-body font-semibold tracking-wider uppercase text-muted-foreground block mb-1.5">Description</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputCls} placeholder="Optional" />
            </div>
            <button onClick={handleEdit} className="btn-primary w-full">
              Save changes
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/40" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-sm shadow-elevated p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-display-4">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="min-h-10 min-w-10 flex items-center justify-center rounded-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default AdminRoles;
