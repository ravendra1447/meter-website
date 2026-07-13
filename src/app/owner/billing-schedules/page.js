'use client';

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Calendar, Plus, Clock, Zap, ToggleLeft, ToggleRight, Settings } from "lucide-react";
import CreateBillingScheduleModal from "@/components/CreateBillingScheduleModal";

export default function BillingSchedulesPage() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const response = await api.get('/owner/billing-schedules');
      setSchedules(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load billing schedules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const toggleSchedule = async (id, currentStatus) => {
    try {
      await api.put(`/owner/billing-schedules/${id}`, {
        status: currentStatus === 'active' ? 'paused' : 'active'
      });
      fetchSchedules();
    } catch (e) {
      alert(e.message || 'Failed to update schedule');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-purple-900 to-indigo-900 -mt-6 -mx-4 md:-mx-8 px-6 md:px-12 py-12 rounded-b-3xl text-white shadow-lg">
        <div>
          <h2 className="text-3xl font-bold mb-2">Billing Schedules</h2>
          <p className="text-purple-200">Configure automated rent and electricity billing rules.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-white text-purple-900 px-5 py-2.5 rounded-xl font-bold hover:bg-purple-50 transition-colors shadow-lg"
        >
          <Plus size={20} />
          <span>New Schedule</span>
        </button>
      </div>

      <div className="pt-6">
        {loading && (
          <div className="flex items-center justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && schedules.length === 0 && (
          <div className="bg-[var(--card)] border border-[var(--border)] p-12 rounded-3xl text-center shadow-sm">
            <Calendar className="mx-auto text-[var(--muted-foreground)] opacity-50 mb-4" size={48} />
            <h3 className="text-xl font-bold mb-2">No Schedules Configured</h3>
            <p className="text-[var(--muted-foreground)] mb-6 max-w-md mx-auto">
              Automate your billing by setting up schedules that automatically generate bills based on smart meter readings.
            </p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors font-semibold"
            >
              <Plus size={20} />
              <span>Create Your First Schedule</span>
            </button>
          </div>
        )}

        {!loading && !error && schedules.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
                <div className={`h-2 ${schedule.status === 'active' ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{schedule.schedule_name}</h3>
                      <div className="flex items-center gap-1 text-sm text-[var(--muted-foreground)] mt-1">
                        <Zap size={14}/> {schedule.meter_name || `Meter #${schedule.meter_id}`}
                      </div>
                    </div>
                    <button onClick={() => toggleSchedule(schedule.id, schedule.status)} className="text-[var(--muted-foreground)] hover:text-purple-500 transition-colors">
                      {schedule.status === 'active' ? <ToggleRight size={32} className="text-purple-500" /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-[var(--border)] grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)] mb-1 uppercase tracking-wider">Type</p>
                      <p className="font-semibold capitalize">{schedule.schedule_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[var(--muted-foreground)] mb-1 uppercase tracking-wider flex items-center gap-1"><Clock size={12}/> Run Time</p>
                      <p className="font-semibold">{schedule.run_time}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateBillingScheduleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchSchedules}
      />
    </div>
  );
}
