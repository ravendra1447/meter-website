import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export function AddEntityModal({ isOpen, onClose, entityName, onAdd }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [name, setName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);

    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);

      if (onAdd) {
        onAdd({ id: Date.now(), name: name, status: 'active' });
      }

      setTimeout(() => {
        setSuccess(false);
        setName('');
        onClose();
      }, 1000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-all duration-300">
      <div className="bg-[var(--card)] w-full max-w-md rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[var(--border)] bg-[var(--accent)]/50 relative z-10">
          <h2 className="text-lg font-bold tracking-tight text-[var(--foreground)]">
            Add New {entityName}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-[var(--accent)] hover:rotate-90 transition-all duration-300 text-[var(--muted-foreground)]">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 relative z-10">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-green-500 space-y-3 animate-in fade-in slide-in-from-bottom-4">
              <CheckCircle size={48} className="animate-bounce" />
              <p className="font-bold text-lg">{entityName} added successfully!</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider">{entityName} Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`Enter ${entityName.toLowerCase()} name...`}
                  className="w-full bg-[var(--background)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  autoFocus
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading || !name.trim()}
                  className="w-full px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl text-sm font-bold tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 active:scale-95"
                >
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> Saving...</>
                  ) : (
                    `Save ${entityName}`
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
