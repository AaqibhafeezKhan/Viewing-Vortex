import { useMemo } from 'react';
import { motion as Motion } from 'framer-motion';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import useStore from '../../store/useStore.js';
import Modal from '../ui/Modal.jsx';
import { Film, Tv, BookOpen, Star, Clock, Eye } from 'lucide-react';
import { getDecade } from '../../utils/formatters.js';

const TYPE_COLORS = { movie: '#3b82f6', tv: '#a855f7', book: '#22c55e' };

export default function StatsDashboard() {
  const { statsOpen, setStatsOpen, favorites, watched } = useStore();

  const stats = useMemo(() => {
    const all = [...favorites, ...watched];
    const byType = { movie: 0, tv: 0, book: 0 };
    const genreMap = {};
    const decadeMap = {};
    let totalRuntime = 0;
    let ratingSum = 0;
    let ratingCount = 0;

    all.forEach((item) => {
      byType[item.type] = (byType[item.type] || 0) + 1;
      if (item.data?.genres) {
        item.data.genres.forEach((g) => {
          genreMap[g.name] = (genreMap[g.name] || 0) + 1;
        });
      }
      const date = item.data?.release_date || item.data?.first_air_date;
      if (date) decadeMap[getDecade(date)] = (decadeMap[getDecade(date)] || 0) + 1;
      if (item.data?.runtime) totalRuntime += item.data.runtime;
      if (item.rating) { ratingSum += item.rating; ratingCount++; }
    });

    const typeData = Object.entries(byType).filter(([, v]) => v > 0).map(([name, value]) => ({ name, value }));
    const genreData = Object.entries(genreMap).sort(([,a],[,b]) => b - a).slice(0, 6).map(([name, count]) => ({ name, count }));
    const topDecade = Object.entries(decadeMap).sort(([,a],[,b]) => b - a)[0]?.[0] || 'N/A';

    return {
      total: all.length,
      watched: watched.length,
      byType: typeData,
      genreData,
      topDecade,
      avgRating: ratingCount ? (ratingSum / ratingCount).toFixed(1) : 'N/A',
      totalRuntimeHrs: Math.floor(totalRuntime / 60),
    };
  }, [favorites, watched]);

  const SummaryCard = ({ icon, label, value, color }) => (
    <Motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-1 p-4 rounded-xl flex-1"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div style={{ color }} className="mb-1">{icon}</div>
      <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</span>
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </Motion.div>
  );

  const tooltipStyle = {
    background: 'var(--card-bg)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12,
    color: 'var(--text-primary)'
  };

  return (
    <Modal open={statsOpen} onClose={() => setStatsOpen(false)} title="📊 My Stats Dashboard" wide>
      {favorites.length + watched.length === 0 ? (
        <div className="text-center py-12" style={{ color: 'var(--text-secondary)' }}>
          <p className="text-lg mb-2">No data yet!</p>
          <p className="text-sm">Save some favorites and mark things watched to see your stats.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="flex gap-3 flex-wrap">
            <SummaryCard icon={<Film size={20} />} label="Total Saved" value={stats.total} color="#3b82f6" />
            <SummaryCard icon={<Eye size={20} />} label="Watched" value={stats.watched} color="#22c55e" />
            <SummaryCard icon={<Star size={20} />} label="Avg Rating" value={stats.avgRating} color="#f59e0b" />
            <SummaryCard icon={<Clock size={20} />} label="Runtime" value={`${stats.totalRuntimeHrs}h`} color="#a855f7" />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {/* Pie chart: by type */}
            {stats.byType.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>By Media Type</p>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={stats.byType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                      {stats.byType.map((entry) => (
                        <Cell key={entry.name} fill={TYPE_COLORS[entry.name] || '#6b7280'} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Bar chart: genres */}
            {stats.genreData.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Top Genres</p>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={stats.genreData} layout="vertical" margin={{ left: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="var(--secondary-color)" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Most saved decade */}
          <div className="text-center py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Most Saved Decade</p>
            <p className="text-2xl font-bold mt-1" style={{ color: 'var(--accent-color)' }}>{stats.topDecade}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
