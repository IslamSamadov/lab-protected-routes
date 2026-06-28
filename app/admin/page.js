import ProtectedRoute from "@/components/ProtectedRoute";

// WARNING: as it stood before this lab, this whole page was wide open.
// Now it's wrapped in <ProtectedRoute requiredRole="ADMIN">, which means:
//  - logged out               -> redirected to /login
//  - logged in, role !== ADMIN -> "Access Denied" screen, panel never renders
//  - logged in, role === ADMIN -> the panel below
const FAKE_USERS = [
  { id: 1, name: "Demo User", email: "demo@ironhack.com", role: "USER" },
  { id: 2, name: "Ada Admin", email: "admin@ironhack.com", role: "ADMIN" },
  { id: 3, name: "Grace Hopper", email: "grace@ironhack.com", role: "USER" },
  { id: 4, name: "Linus T.", email: "linus@ironhack.com", role: "USER" },
];

function AdminPanel() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
      <p className="mt-1 text-slate-600">
        Manage users, settings, and the dangerous buttons.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Total users</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">1,248</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Posts today</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">312</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <p className="text-sm text-slate-500">Open reports</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">7</p>
        </div>
      </div>
      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Email</th>
              <th className="px-5 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {FAKE_USERS.map((u) => (
              <tr key={u.id} className="border-t border-slate-100">
                <td className="px-5 py-3 text-slate-900">{u.name}</td>
                <td className="px-5 py-3 text-slate-600">{u.email}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="font-semibold text-red-700">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-600">
          Wipe the database, reset all passwords, export every user. The kind of
          thing you really do not want a logged-out stranger clicking.
        </p>
        <button className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
          Delete everything
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <AdminPanel />
    </ProtectedRoute>
  );
}