import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff, X,
  Briefcase, Users, TrendingUp, Clock, Search, Save, AlertCircle,
  CheckCircle2, ArrowLeft, Activity, Filter,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { supabase } from '@/lib/supabase';

interface Job {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  job_type: string | null;
  experience_level: string | null;
  description: string | null;
  requirements: string | null;
  application_link: string | null;
  salary_range: string | null;
  status: string;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

interface ActivityLog {
  id: string;
  admin_id: string;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
}

type Tab = 'jobs' | 'stats' | 'logs';

const emptyJob: Omit<Job, 'id' | 'created_at' | 'updated_at'> = {
  title: '', department: '', location: '', job_type: 'Full-time',
  experience_level: '', description: '', requirements: '',
  application_link: '', salary_range: '', status: 'draft', is_featured: false,
};

export default function AdminPanel() {
  const { user, signOut } = useAuth();
  const ref = useScrollAnimation();
  const [tab, setTab] = useState<Tab>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyJob);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) { setError('Could not load jobs.'); }
    else setJobs(data ?? []);
    setLoading(false);
  }, []);

  const fetchLogs = useCallback(async () => {
    const { data } = await supabase
      .from('admin_activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    setLogs(data ?? []);
  }, []);

  useEffect(() => {
    fetchJobs();
    fetchLogs();
  }, [fetchJobs, fetchLogs]);

  const filtered = jobs.filter(j => {
    const matchesSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.department ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || j.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: jobs.length,
    published: jobs.filter(j => j.status === 'published').length,
    drafts: jobs.filter(j => j.status === 'draft').length,
    archived: jobs.filter(j => j.status === 'archived').length,
    featured: jobs.filter(j => j.is_featured).length,
  };

  const openCreate = () => {
    setForm(emptyJob);
    setEditingJob(null);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const openEdit = (job: Job) => {
    const { id: _id, created_at: _c, updated_at: _u, ...rest } = job;
    void _id; void _c; void _u;
    setForm(rest);
    setEditingJob(job);
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Job title is required.'); return; }
    setSaving(true);
    setError('');
    try {
      if (editingJob) {
        const { error: err } = await supabase.rpc('admin_update_job', {
          p_id: editingJob.id,
          p_updates: form,
        });
        if (err) throw err;
        setSuccess('Job updated successfully.');
      } else {
        const { error: err } = await supabase.rpc('admin_create_job', { p_job: form });
        if (err) throw err;
        setSuccess('Job created successfully.');
      }
      setShowForm(false);
      fetchJobs();
      fetchLogs();
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Could not save job. Please try again.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job permanently?')) return;
    const { error: err } = await supabase.rpc('admin_delete_job', { p_id: id });
    if (err) { setError('Could not delete job.'); return; }
    setJobs(prev => prev.filter(j => j.id !== id));
    fetchLogs();
    setSuccess('Job deleted.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleStatusChange = async (id: string, status: string) => {
    const { error: err } = await supabase.rpc('admin_set_job_status', { p_id: id, p_status: status });
    if (err) { setError('Could not update status.'); return; }
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
    fetchLogs();
  };

  const handleToggleFeatured = async (id: string, featured: boolean) => {
    const { error: err } = await supabase.rpc('admin_toggle_featured', { p_id: id, p_featured: featured });
    if (err) { setError('Could not update featured status.'); return; }
    setJobs(prev => prev.map(j => j.id === id ? { ...j, is_featured: featured } : j));
    fetchLogs();
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      published: 'bg-green-100 text-green-700 border-green-200',
      draft: 'bg-gray-100 text-gray-600 border-gray-200',
      archived: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    return colors[status] ?? colors.draft;
  };

  const actionIcon: Record<string, typeof Plus> = {
    create: Plus, update: Pencil, delete: Trash2,
    publish: Eye, unpublish: EyeOff, archive: Filter,
    feature: Star, unfeature: StarOff,
  };

  return (
    <div ref={ref} className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => { window.location.hash = ''; }}
                className="text-sm text-gray-500 hover:text-violet-700 flex items-center gap-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to site
              </button>
            </div>
            <h1 className="font-poppins font-bold text-3xl text-gray-900">Job Management</h1>
            <p className="text-gray-500 text-sm mt-1">
              Signed in as {user?.email} · <span className="text-violet-700 font-medium">Administrator</span>
            </p>
          </div>
          <button onClick={signOut} className="btn-outline text-sm py-2 px-4 self-start">
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 shadow-card border border-gray-100 w-fit">
          {([
            { key: 'jobs', label: 'Jobs', icon: Briefcase },
            { key: 'stats', label: 'Statistics', icon: TrendingUp },
            { key: 'logs', label: 'Activity Logs', icon: Activity },
          ] as { key: Tab; label: string; icon: typeof Briefcase }[]).map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.key ? 'bg-violet-700 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Success / Error banners */}
        {success && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-700">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {success}
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* JOBS TAB */}
        {tab === 'jobs' && (
          <>
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search jobs by title or department..."
                  className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
                />
              </div>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-all"
              >
                <option value="all">All statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              <button onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5 whitespace-nowrap">
                <Plus className="w-4 h-4" /> Add Job
              </button>
            </div>

            {/* Jobs table */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="h-16 bg-white rounded-xl border border-gray-100 animate-pulse" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  {jobs.length === 0 ? 'No jobs yet. Click "Add Job" to create your first listing.' : 'No jobs match your filters.'}
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filtered.map(job => (
                  <div
                    key={job.id}
                    className="bg-white rounded-xl border border-gray-100 shadow-card hover:shadow-violet hover:border-violet-200 transition-all p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-poppins font-semibold text-gray-900 text-sm truncate">{job.title}</h3>
                        {job.is_featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        {job.department && <span>{job.department}</span>}
                        {job.location && <span>· {job.location}</span>}
                        {job.job_type && <span>· {job.job_type}</span>}
                        <span className={`px-2 py-0.5 rounded-full border font-medium ${statusBadge(job.status)}`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {job.status === 'published' ? (
                        <button
                          onClick={() => handleStatusChange(job.id, 'draft')}
                          title="Unpublish"
                          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        >
                          <EyeOff className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(job.id, 'published')}
                          title="Publish"
                          className="p-2 rounded-lg text-gray-500 hover:bg-green-50 hover:text-green-600 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleFeatured(job.id, !job.is_featured)}
                        title={job.is_featured ? 'Remove featured' : 'Mark as featured'}
                        className={`p-2 rounded-lg transition-colors ${
                          job.is_featured
                            ? 'text-amber-500 hover:bg-amber-50'
                            : 'text-gray-500 hover:bg-amber-50 hover:text-amber-500'
                        }`}
                      >
                        {job.is_featured ? <StarOff className="w-4 h-4" /> : <Star className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => openEdit(job)}
                        title="Edit"
                        className="p-2 rounded-lg text-gray-500 hover:bg-violet-50 hover:text-violet-700 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleStatusChange(job.id, 'archived')}
                        title="Archive"
                        className="p-2 rounded-lg text-gray-500 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                      >
                        <Filter className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(job.id)}
                        title="Delete"
                        className="p-2 rounded-lg text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* STATS TAB */}
        {tab === 'stats' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { label: 'Total Jobs', value: stats.total, icon: Briefcase, color: 'violet' },
              { label: 'Published', value: stats.published, icon: Eye, color: 'green' },
              { label: 'Drafts', value: stats.drafts, icon: Pencil, color: 'gray' },
              { label: 'Archived', value: stats.archived, icon: Filter, color: 'orange' },
              { label: 'Featured', value: stats.featured, icon: Star, color: 'amber' },
              { label: 'Activity Logs', value: logs.length, icon: Activity, color: 'blue' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-card p-6">
                <div className={`w-12 h-12 rounded-xl bg-${s.color}-100 flex items-center justify-center mb-4`}>
                  <s.icon className={`w-6 h-6 text-${s.color}-600`} />
                </div>
                <p className="text-3xl font-poppins font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* LOGS TAB */}
        {tab === 'logs' && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden">
            {logs.length === 0 ? (
              <div className="text-center py-16">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No activity logged yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {logs.map(log => {
                  const Icon = actionIcon[log.action] ?? Activity;
                  return (
                    <div key={log.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-violet-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800">
                          <span className="capitalize">{log.action}</span> · {log.entity_type}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(log.created_at).toLocaleString('en-IN', {
                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                          })}
                        </p>
                      </div>
                      {log.entity_id && (
                        <code className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded font-mono hidden sm:block">
                          {log.entity_id.slice(0, 8)}
                        </code>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* JOB FORM MODAL */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
              <h2 className="font-poppins font-bold text-lg text-gray-900">
                {editingJob ? 'Edit Job' : 'Create New Job'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                  className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  placeholder="e.g. Senior React Developer"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <input
                    type="text"
                    value={form.department ?? ''}
                    onChange={e => setForm({ ...form, department: e.target.value })}
                    className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    placeholder="e.g. Engineering"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                  <input
                    type="text"
                    value={form.location ?? ''}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                    placeholder="e.g. Hyderabad / Remote"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Job Type</label>
                  <select
                    value={form.job_type ?? 'Full-time'}
                    onChange={e => setForm({ ...form, job_type: e.target.value })}
                    className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-all"
                  >
                    <option>Full-time</option>
                    <option>Part-time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level</label>
                  <select
                    value={form.experience_level ?? ''}
                    onChange={e => setForm({ ...form, experience_level: e.target.value })}
                    className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-all"
                  >
                    <option value="">Select level</option>
                    <option>Fresher (0-1 years)</option>
                    <option>Junior (1-3 years)</option>
                    <option>Mid-level (3-5 years)</option>
                    <option>Senior (5-8 years)</option>
                    <option>Lead (8+ years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Salary Range</label>
                <input
                  type="text"
                  value={form.salary_range ?? ''}
                  onChange={e => setForm({ ...form, salary_range: e.target.value })}
                  className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  placeholder="e.g. 6-12 LPA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Application Link</label>
                <input
                  type="url"
                  value={form.application_link ?? ''}
                  onChange={e => setForm({ ...form, application_link: e.target.value })}
                  className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-2.5 text-sm outline-none transition-all"
                  placeholder="https://... or mailto:..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description ?? ''}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none"
                  placeholder="Job description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Requirements</label>
                <textarea
                  value={form.requirements ?? ''}
                  onChange={e => setForm({ ...form, requirements: e.target.value })}
                  rows={3}
                  className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none"
                  placeholder="Required skills and qualifications..."
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-all"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2.5 cursor-pointer py-2.5">
                    <input
                      type="checkbox"
                      checked={form.is_featured}
                      onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                      className="w-5 h-5 rounded border-2 border-gray-300 text-violet-600 focus:ring-violet-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as featured job</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-medium rounded-xl py-3 text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {saving ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4" /> {editingJob ? 'Update Job' : 'Create Job'}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
