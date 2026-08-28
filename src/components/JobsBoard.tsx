import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Clock, Star, ExternalLink, AlertCircle } from 'lucide-react';
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
  is_featured: boolean;
}

export default function JobsBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    (async () => {
      const { data, error: err } = await supabase
        .from('jobs')
        .select('id, title, department, location, job_type, experience_level, description, requirements, application_link, salary_range, is_featured')
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (err) { setError('Could not load jobs.'); }
      else setJobs(data ?? []);
      setLoading(false);
    })();
  }, []);

  const departments = [...new Set(jobs.map(j => j.department).filter(Boolean))] as string[];
  const jobTypes = [...new Set(jobs.map(j => j.job_type).filter(Boolean))] as string[];

  const filtered = jobs.filter(j => {
    const matchesSearch = !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      (j.description ?? '').toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'all' || j.department === deptFilter;
    const matchesType = typeFilter === 'all' || j.job_type === typeFilter;
    return matchesSearch && matchesDept && matchesType;
  });

  const featuredJobs = filtered.filter(j => j.is_featured);
  const regularJobs = filtered.filter(j => !j.is_featured);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
        <AlertCircle className="w-4 h-4 shrink-0" />
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
        <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm">No open positions at the moment. Please check back soon.</p>
      </div>
    );
  }

  const JobCard = ({ job }: { job: Job }) => (
    <div className={`bg-white rounded-2xl border shadow-card hover:shadow-violet transition-all p-5 ${
      job.is_featured ? 'border-amber-200 ring-1 ring-amber-100' : 'border-gray-100'
    }`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-poppins font-semibold text-gray-900 text-sm">{job.title}</h4>
            {job.is_featured && (
              <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium border border-amber-100">
                <Star className="w-3 h-3 fill-amber-400" /> Featured
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            {job.department && <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.department}</span>}
            {job.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
            {job.job_type && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.job_type}</span>}
            {job.experience_level && <span>· {job.experience_level}</span>}
          </div>
        </div>
        {job.salary_range && (
          <span className="text-xs font-medium text-violet-700 bg-violet-50 px-3 py-1 rounded-full border border-violet-100 whitespace-nowrap shrink-0">
            {job.salary_range}
          </span>
        )}
      </div>

      {job.description && (
        <p className="text-sm text-gray-600 leading-relaxed mb-3 line-clamp-2">{job.description}</p>
      )}

      {job.requirements && (
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-400 mb-1">Requirements</p>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{job.requirements}</p>
        </div>
      )}

      {job.application_link && (
        <a
          href={job.application_link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-violet-700 hover:text-violet-800 transition-colors"
        >
          Apply Now <ExternalLink className="w-3.5 h-3.5" />
        </a>
      )}
    </div>
  );

  return (
    <div>
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs by title or keyword..."
            className="w-full border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all"
          />
        </div>
        {departments.length > 0 && (
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-all"
          >
            <option value="all">All departments</option>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
        )}
        {jobTypes.length > 0 && (
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-all"
          >
            <option value="all">All types</option>
            {jobTypes.map(t => <option key={t}>{t}</option>)}
          </select>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-2xl border border-gray-100">
          <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No jobs match your search. Try different filters.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {featuredJobs.length > 0 && (
            <>
              {featuredJobs.map(job => <JobCard key={job.id} job={job} />)}
            </>
          )}
          {regularJobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  );
}
