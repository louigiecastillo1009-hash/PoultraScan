import { useNavigate } from 'react-router-dom';
import {
  MdAdd,
  MdCenterFocusStrong,
  MdCheckCircle,
  MdWarning,
  MdHomeWork,
  MdRadar,
} from 'react-icons/md';

import { useDashboardStats } from '../hooks/useDashboard';
import { useAuth } from '../../../middleware/AuthContext';
import { Button, Notice, PoultraScanLoader } from '../../../components/index';
import { AlertFeed, AnomalyChart, FarmHealthChart, MetricCard, ScanSummary } from '../components/index';

function getFirstName(name) {
  if (!name) return '';
  return String(name).trim().split(' ')[0];
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, loading, error, refetch } = useDashboardStats();

  const firstName = getFirstName(user?.fullname);
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div>
      <section className="overflow-hidden rounded-[1.75rem] border border-ink/10 bg-ink shadow-pop">
        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="ps-grid-overlay absolute inset-0 opacity-20" aria-hidden="true" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-cream">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
                Dashboard
              </span>

              <h1 className="mt-5 max-w-xl font-display text-[clamp(2.35rem,5vw,3.8rem)] font-medium leading-[1.02] tracking-[-0.035em] text-cream">
                {firstName ? (
                  <>
                    {getGreeting()}, <span className="text-gold">{firstName}</span>.
                  </>
                ) : (
                  'Welcome to PoultraScan.'
                )}
              </h1>

              <p className="mt-3 max-w-lg text-[12.5px] leading-6 text-cream/65 sm:text-[13px]">
                Monitor flock health, review recent scans, and keep an eye on anomalies across your
                farms.
              </p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <Button variant="cream" onClick={() => navigate('/scan')}>
                  <MdAdd className="text-lg" aria-hidden="true" />
                  New scan
                </Button>
                <Button variant="dark-ghost" onClick={() => navigate('/scan/history')}>
                  <MdRadar className="text-base" aria-hidden="true" />
                  Scan history
                </Button>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-2.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-cream/45">
                <span>AI flock diagnostics</span>
                <span className="h-1 w-1 rounded-full bg-cream/25" aria-hidden="true" />
                <span>{today}</span>
              </div>
            </div>
          </div>

          <div className="relative min-h-[260px] sm:min-h-[300px] lg:min-h-[380px]">
            <img
              src="/img/poultry-hero.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent lg:bg-gradient-to-r lg:from-ink/35 lg:to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-cream/15 bg-ink/55 p-4 backdrop-blur-sm sm:bottom-5 sm:left-5 sm:right-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-cream/55">
                    Healthy flock rate
                  </p>
                  <p className="mt-1 font-display text-[2.2rem] font-medium leading-none text-cream">
                    {stats?.healthy_percentage ?? '—'}
                    <span className="ml-0.5 text-lg text-cream/70">%</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-cream/55">
                    Chickens scanned
                  </p>
                  <p className="mt-1 text-[12.5px] font-semibold text-cream">
                    {stats?.total_birds_detected?.toLocaleString() ?? '—'}
                  </p>
                </div>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-cream/15">
                <div
                  className="h-full rounded-full bg-gold transition-all duration-700"
                  style={{ width: `${Math.min(100, stats?.healthy_percentage ?? 0)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {loading && (
        <div className="py-24">
          <PoultraScanLoader label="Loading dashboard..." />
        </div>
      )}

      {error && !loading && (
        <Notice
          tone="error"
          title="Couldn't load the dashboard"
          className="mt-8"
          action={
            <Button variant="danger-ghost" size="sm" onClick={refetch}>
              Try again
            </Button>
          }
        >
          {error}
        </Notice>
      )}

      {!loading && !error && stats && (
        <div className="mt-8">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <MetricCard
              icon={MdHomeWork}
              label="Total farms"
              value={stats.total_farms.toLocaleString()}
              caption="Farms under your account"
              accent="farm"
            />
            <MetricCard
              icon={MdCenterFocusStrong}
              label="Total scans"
              value={stats.total_scans.toLocaleString()}
              caption="All-time, across all farms"
              accent="scans"
            />
            <MetricCard
              icon={MdCheckCircle}
              label="Healthy chickens"
              value={`${stats.healthy_percentage}%`}
              caption={`${stats.total_birds_detected.toLocaleString()} chickens scanned total`}
              accent="healthy"
            />
            <MetricCard
              icon={MdWarning}
              label="Anomalies detected"
              value={stats.anomalies_detected.toLocaleString()}
              caption="Across all completed scans"
              accent="anomaly"
            />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
            <ScanSummary recentScans={stats.recent_scans} />
            <AlertFeed recentEvents={stats.recent_events} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
            <AnomalyChart
              diseaseBreakdown={stats.disease_breakdown}
              totalAnomalies={stats.anomalies_detected}
            />
            <FarmHealthChart farmHealthIndex={stats.farm_health_index} />
          </div>
        </div>
      )}
    </div>
  );
}
