'use client';

import { useEffect, useMemo, useState } from 'react';

type Metric = {
  label: string;
  value: string;
  sublabel?: string;
};

type Chain = {
  name: string;
  status: 'online' | 'degraded' | 'idle';
  block: string;
  latency: string;
};

type SignalItem = {
  id: number;
  title: string;
  detail: string;
  time: string;
  level: 'high' | 'medium' | 'low';
};

type Pipeline = {
  name: string;
  status: 'active' | 'warming' | 'standby';
  throughput: string;
};

type ExecutionItem = {
  id: number;
  route: string;
  result: 'success' | 'reverted' | 'skipped';
  value: string;
  time: string;
};

const metricBase: Metric[] = [
  { label: 'Uptime', value: '12d 04h', sublabel: 'continuous runtime' },
  { label: 'Exec / hr', value: '142', sublabel: 'controlled actions' },
  { label: 'Signals / min', value: '31', sublabel: 'policy intake' },
  { label: 'Avg latency', value: '182ms', sublabel: 'decision window' },
  { label: 'Success rate', value: '98.4%', sublabel: 'operations health' },
  { label: 'Value moved', value: '$2.4M', sublabel: 'simulated issuance volume' },
];

const chainsBase: Chain[] = [
  { name: 'Ethereum', status: 'online', block: '21943871', latency: '204ms' },
  { name: 'Arbitrum', status: 'online', block: '318442901', latency: '121ms' },
  { name: 'Base', status: 'online', block: '18821752', latency: '117ms' },
  { name: 'Optimism', status: 'degraded', block: '130847922', latency: '266ms' },
  { name: 'Polygon', status: 'idle', block: '67748102', latency: '—' },
];

const signalBase: SignalItem[] = [
  {
    id: 1,
    title: 'Issuance request entered review',
    detail: 'compliance queue opened for institutional mint batch',
    time: '2s ago',
    level: 'high',
  },
  {
    id: 2,
    title: 'Policy route repriced',
    detail: 'risk threshold widened by 14 bps',
    time: '10s ago',
    level: 'medium',
  },
  {
    id: 3,
    title: 'Settlement signal awaiting confirmation',
    detail: 'control threshold met, gating review window',
    time: '16s ago',
    level: 'low',
  },
  {
    id: 4,
    title: 'Treasury flow divergence',
    detail: 'cross-domain operation flagged for standby execution',
    time: '23s ago',
    level: 'medium',
  },
];

const pipelineBase: Pipeline[] = [
  { name: 'compliance-monitor', status: 'active', throughput: '31.2 checks/min' },
  { name: 'control-router', status: 'active', throughput: '142 ops/hr' },
  { name: 'risk-gate', status: 'warming', throughput: '12 checks/sec' },
  { name: 'settlement-watch', status: 'standby', throughput: 'listening' },
];

const executionBase: ExecutionItem[] = [
  { id: 1, route: 'USDx → ARB / control-alpha', result: 'success', value: '$42.1k', time: '00:02:13' },
  { id: 2, route: 'BASE → ETH / control-beta', result: 'success', value: '$18.4k', time: '00:02:01' },
  { id: 3, route: 'OP → ARB / control-gamma', result: 'reverted', value: '$8.2k', time: '00:01:49' },
  { id: 4, route: 'POLY → ETH / control-delta', result: 'skipped', value: '$5.7k', time: '00:01:31' },
  { id: 5, route: 'ETH → BASE / control-zeta', result: 'success', value: '$24.9k', time: '00:01:12' },
];

const terminalSeed = [
  'initializing control plane...',
  'loading policy graph...',
  'connecting to 5 networks...',
  'starting compliance intake...',
  'warming control evaluators...',
  'compliance control loop active',
];

function classNames(...values: Array<string | false | undefined>) {
  return values.filter(Boolean).join(' ');
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function StatusDot({ tone = 'violet' }: { tone?: 'violet' | 'amber' | 'slate' }) {
  const toneClass =
    tone === 'violet'
      ? 'bg-violet-300 shadow-violet-300/70'
      : tone === 'amber'
        ? 'bg-amber-400 shadow-amber-400/70'
        : 'bg-slate-500 shadow-slate-500/50';

  return (
    <span
      className={classNames(
        'inline-block h-2.5 w-2.5 rounded-full shadow-[0_0_12px]',
        toneClass,
        'animate-pulse',
      )}
    />
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-sm">
      <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">{metric.label}</div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-white">{metric.value}</div>
      {metric.sublabel ? <div className="mt-2 text-xs text-white/45">{metric.sublabel}</div> : null}
    </div>
  );
}

function ChainPill({ chain }: { chain: Chain }) {
  const tone = chain.status === 'online' ? 'violet' : chain.status === 'degraded' ? 'amber' : 'slate';
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <StatusDot tone={tone} />
          <span className="text-sm font-medium text-white">{chain.name}</span>
        </div>
        <span className="text-[11px] uppercase tracking-[0.16em] text-white/45">{chain.status}</span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-white/45">
        <span>Block {chain.block}</span>
        <span>{chain.latency}</span>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 shadow-2xl shadow-black/20 backdrop-blur-sm">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-medium uppercase tracking-[0.18em] text-white/55">{title}</h2>
          {subtitle ? <p className="mt-2 text-sm text-white/45">{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export default function RunDemoPage() {
  const [metrics, setMetrics] = useState(metricBase);
  const [signals, setSignals] = useState(signalBase);
  const [executions, setExecutions] = useState(executionBase);
  const [terminal, setTerminal] = useState(terminalSeed);
  const [uptimeMinutes, setUptimeMinutes] = useState(12 * 24 * 60 + 4 * 60);

  useEffect(() => {
    const metricTimer = setInterval(() => {
      setMetrics((current) => {
        const next = [...current];
        next[1] = { ...next[1], value: String(randomInt(136, 157)) };
        next[2] = { ...next[2], value: String(randomInt(26, 37)) };
        next[3] = { ...next[3], value: `${randomInt(148, 244)}ms` };
        next[4] = { ...next[4], value: `${(97.8 + Math.random() * 1.5).toFixed(1)}%` };
        next[5] = { ...next[5], value: `$${(2.1 + Math.random() * 0.7).toFixed(1)}M` };
        return next;
      });
    }, 2400);

    const logLines = [
      'issuance request accepted: control-alpha',
      'risk gate passed: control-beta',
      'latency sample updated',
      'settlement batch committed',
      'policy watcher synced: arbitrum',
      'control spread normalized',
      'settlement watcher idle',
      'awaiting next compliance burst...',
    ];

    const terminalTimer = setInterval(() => {
      setTerminal((current) => {
        const line = logLines[randomInt(0, logLines.length - 1)];
        return [...current.slice(-10), line];
      });
    }, 1800);

    const signalTitles = [
      'Institutional mint window opened',
      'BASE route threshold crossed',
      'Treasury review cluster detected',
      'Settlement band widened',
      'Cross-route rebalance candidate',
    ];

    const signalDetails = [
      'watching control window before simulated execution',
      'signal promoted into active compliance queue',
      'local spread widened across monitored pair group',
      'execution confidence moved above configured band',
      'risk gate requested one more confirmation cycle',
    ];

    const signalTimer = setInterval(() => {
      setSignals((current) => {
        const levelPool: SignalItem['level'][] = ['high', 'medium', 'low'];
        const newItem: SignalItem = {
          id: Date.now(),
          title: signalTitles[randomInt(0, signalTitles.length - 1)],
          detail: signalDetails[randomInt(0, signalDetails.length - 1)],
          time: 'now',
          level: levelPool[randomInt(0, levelPool.length - 1)],
        };
        const updated = [newItem, ...current.slice(0, 5)].map((item, index) => {
          if (index === 0) return item;
          const seconds = (index + 1) * randomInt(4, 9);
          return { ...item, time: `${seconds}s ago` };
        });
        return updated;
      });
    }, 5200);

    const executionTimer = setInterval(() => {
      const outcomes: ExecutionItem['result'][] = ['success', 'success', 'success', 'reverted', 'skipped'];
      const routes = [
        'USDx → ARB / control-alpha',
        'BASE → ETH / control-beta',
        'OP → ARB / control-gamma',
        'ETH → BASE / control-zeta',
        'ARB → ETH / control-kappa',
      ];
      setExecutions((current) => {
        const nextItem: ExecutionItem = {
          id: Date.now(),
          route: routes[randomInt(0, routes.length - 1)],
          result: outcomes[randomInt(0, outcomes.length - 1)],
          value: `$${(4 + Math.random() * 48).toFixed(1)}k`,
          time: new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
        };
        return [nextItem, ...current.slice(0, 6)];
      });
    }, 4300);

    const uptimeTimer = setInterval(() => {
      setUptimeMinutes((current) => current + 1);
    }, 60000);

    return () => {
      clearInterval(metricTimer);
      clearInterval(terminalTimer);
      clearInterval(signalTimer);
      clearInterval(executionTimer);
      clearInterval(uptimeTimer);
    };
  }, []);

  useEffect(() => {
    const days = Math.floor(uptimeMinutes / (24 * 60));
    const hours = Math.floor((uptimeMinutes % (24 * 60)) / 60);
    setMetrics((current) => {
      const next = [...current];
      next[0] = { ...next[0], value: `${days}d ${String(hours).padStart(2, '0')}h` };
      return next;
    });
  }, [uptimeMinutes]);

  const counters = useMemo(() => {
    return executions.reduce(
      (acc, item) => {
        acc[item.result] += 1;
        return acc;
      },
      { success: 0, reverted: 0, skipped: 0 },
    );
  }, [executions]);

  return (
    <main className="min-h-screen bg-[#05070b] text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden">
  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#03040a,#05070b,#04050b)]" />

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,181,253,0.18),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.10),transparent_28%),radial-gradient(circle_at_right,rgba(168,85,247,0.10),transparent_24%)]" />

  <div className="absolute left-1/2 top-[-18rem] h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-violet-300/14 blur-3xl" />
  <div className="absolute bottom-[-10rem] left-[-6rem] h-[26rem] w-[26rem] rounded-full bg-fuchsia-300/10 blur-3xl" />
  <div className="absolute right-[-8rem] top-[26%] h-[24rem] w-[24rem] rounded-full bg-violet-500/10 blur-3xl" />

  <div
    className="absolute inset-0 opacity-[0.07]"
    style={{
      backgroundImage:
        'linear-gradient(rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.10) 1px, transparent 1px)',
      backgroundSize: '44px 44px',
    }}
  />

  <div className="absolute inset-0 opacity-[0.10] bg-[linear-gradient(115deg,transparent_15%,rgba(196,181,253,0.08)_40%,transparent_68%)]" />
  <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(300deg,transparent_20%,rgba(244,114,182,0.06)_48%,transparent_75%)]" />

  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_52%,rgba(0,0,0,0.42)_100%)]" />
</div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <nav className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.24em] text-white/40">
              Institutional Stablecoin Control Plane
            </div>
            <div className="mt-2 text-2xl font-semibold tracking-tight">SoLvUs / Run</div>
          </div>
          <div className="flex items-center gap-3 text-xs text-white/45">
            <div className="rounded-full border border-violet-400/25 bg-violet-400/12 px-3 py-1.5 text-violet-200">
              visual demo
            </div>
            <div className="rounded-full border border-white/10 px-3 py-1.5">vercel-ready</div>
          </div>
        </nav>

        <header className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/40">
              Compliance → Control → Execution
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Runtime dashboard visual demo for institutional stablecoin operations.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/58 sm:text-base">
              This page is a front-end only simulation designed to feel live without any backend,
              database, compliance engine, or real chain connection.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/30 p-4 font-mono text-xs text-violet-200 shadow-2xl shadow-black/30">
            <div className="mb-3 flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-white/35">
              <span>Operations shell</span>
              <span>$ solvus --mode=control-plane</span>
            </div>
            <div className="space-y-2">
              {terminal.slice(-4).map((line, index) => (
                <div key={`${line}-${index}`} className="truncate">
                  <span className="text-white/35">&gt;</span> {line}
                </div>
              ))}
            </div>
          </div>
        </header>

        <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {chainsBase.map((chain) => (
            <ChainPill key={chain.name} chain={chain} />
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_1fr_0.9fr]">
          <SectionCard title="Policy feed" subtitle="Synthetic institutional flow generated on interval updates.">
            <div className="space-y-3">
              {signals.map((signal) => {
                const badgeClass =
                  signal.level === 'high'
                    ? 'border-violet-400/25 bg-violet-400/12 text-violet-200'
                    : signal.level === 'medium'
                      ? 'border-amber-400/20 bg-amber-400/10 text-amber-300'
                      : 'border-white/10 bg-white/5 text-white/60';

                return (
                  <div key={signal.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-medium text-white">{signal.title}</div>
                        <div className="mt-1 text-sm text-white/45">{signal.detail}</div>
                      </div>
                      <div
                        className={classNames(
                          'rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]',
                          badgeClass,
                        )}
                      >
                        {signal.level}
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-white/35">{signal.time}</div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Operations terminal" subtitle="Animated faux terminal for demo presentation.">
            <div className="rounded-2xl border border-white/10 bg-[#020304] p-4 font-mono text-sm text-violet-200">
              <div className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-white/30">
                <span className="h-2 w-2 rounded-full bg-red-400/80" />
                <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                <span className="h-2 w-2 rounded-full bg-violet-300/80" />
              </div>
              <div className="space-y-2">
                {terminal.map((line, index) => (
                  <div key={`${line}-${index}`} className="break-words">
                    <span className="mr-2 text-white/25">[{String(index + 1).padStart(2, '0')}]</span>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Active pipelines" subtitle="Core control modules shown as active surfaces.">
            <div className="space-y-3">
              {pipelineBase.map((pipeline) => {
                const tone =
                  pipeline.status === 'active' ? 'violet' : pipeline.status === 'warming' ? 'amber' : 'slate';
                return (
                  <div key={pipeline.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <StatusDot tone={tone} />
                        <div className="text-sm font-medium text-white">{pipeline.name}</div>
                      </div>
                      <div className="text-[11px] uppercase tracking-[0.16em] text-white/40">
                        {pipeline.status}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-white/40">{pipeline.throughput}</div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <SectionCard title="Execution log" subtitle="Recent simulated operational outcomes.">
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-[1.35fr_0.5fr_0.45fr_0.45fr] gap-3 border-b border-white/10 bg-white/[0.03] px-4 py-3 text-[11px] uppercase tracking-[0.16em] text-white/40">
                <div>Route</div>
                <div>Result</div>
                <div>Value</div>
                <div>Time</div>
              </div>
              <div>
                {executions.map((item) => {
                  const resultClass =
                    item.result === 'success'
                      ? 'text-violet-200'
                      : item.result === 'reverted'
                        ? 'text-amber-300'
                        : 'text-white/55';
                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1.35fr_0.5fr_0.45fr_0.45fr] gap-3 border-b border-white/5 px-4 py-3 text-sm last:border-b-0"
                    >
                      <div className="text-white/85">{item.route}</div>
                      <div className={classNames('capitalize', resultClass)}>{item.result}</div>
                      <div className="text-white/65">{item.value}</div>
                      <div className="text-white/35">{item.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Execution counters" subtitle="Simple aggregate health panel.">
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <div className="rounded-2xl border border-violet-400/20 bg-violet-400/12 p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-violet-200/80">Success</div>
                <div className="mt-2 text-3xl font-semibold text-violet-100">{counters.success}</div>
              </div>
              <div className="rounded-2xl border border-amber-400/15 bg-amber-400/10 p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-amber-300/70">Reverted</div>
                <div className="mt-2 text-3xl font-semibold text-amber-200">{counters.reverted}</div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="text-[11px] uppercase tracking-[0.16em] text-white/40">Skipped</div>
                <div className="mt-2 text-3xl font-semibold text-white">{counters.skipped}</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/55">
              This demo intentionally uses generated values and interval-based animation so the page feels alive
              during presentations without requiring any backend service.
            </div>
          </SectionCard>
        </section>
      </div>
    </main>
  );
}
