import { useMemo } from 'react';

import {
  BarChart3,
  HeartHandshake,
  Users,
  Trophy,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import PageHeader from '../../components/PageHeader';
import SectionReveal from '../../components/SectionReveal';


const data = [
  {
    month: 'Apr',
    members: 840,
    impact: 12000,
  },
  {
    month: 'May',
    members: 910,
    impact: 14500,
  },
  {
    month: 'Jun',
    members: 980,
    impact: 16700,
  },
  {
    month: 'Jul',
    members: 1070,
    impact: 18900,
  },
  {
    month: 'Aug',
    members: 1160,
    impact: 21200,
  },
  {
    month: 'Sep',
    members: 1248,
    impact: 24000,
  },
];


export default function AdminReports() {
  const totals = useMemo(
    () => data[data.length - 1],
    []
  );


  const metrics = [
    {
      Icon: Users,
      label: 'Members',
      value:
        totals.members.toLocaleString(),
    },
    {
      Icon: HeartHandshake,
      label: 'Charity impact',
      value:
        `₹${totals.impact.toLocaleString()}`,
    },
    {
      Icon: Trophy,
      label: 'Prize pool',
      value: '₹62,400',
    },
  ];


  return (
    <div>
      <PageHeader
        eyebrow="ADMIN · REPORTS"
        title="Read the health of the platform."
        body="Analytics highlight membership, prize activity, and charitable impact over time."
      />


      <div className="container">

        {/* =====================================================
            METRIC CARDS
            ===================================================== */}

        <div className="report-cards">
          {metrics.map(
            ({
              Icon,
              label,
              value,
            }) => (
              <SectionReveal
                key={label}
              >
                <div className="metric-card glass-card">

                  <Icon size={18} />

                  <span>
                    {label}
                  </span>

                  <strong>
                    {value}
                  </strong>

                </div>
              </SectionReveal>
            )
          )}
        </div>


        {/* =====================================================
            SIX MONTH CHART
            ===================================================== */}

        <SectionReveal>
          <div className="panel glass-card report-chart">

            <div className="panel-head">

              <div>
                <span className="eyebrow">
                  SIX-MONTH TREND
                </span>

                <h2>
                  Members &amp; impact
                </h2>
              </div>

              <BarChart3 size={19} />

            </div>


            <ResponsiveContainer
              width="100%"
              height={340}
            >
              <BarChart data={data}>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="rgba(255,255,255,.08)"
                />

                <XAxis
                  dataKey="month"
                  stroke="rgba(255,255,255,.55)"
                />

                <YAxis
                  stroke="rgba(255,255,255,.55)"
                />

                <Tooltip
                  contentStyle={{
                    background:
                      '#0c181e',
                    border:
                      '1px solid rgba(255,255,255,.12)',
                    borderRadius:
                      '14px',
                  }}
                  labelStyle={{
                    color:
                      '#dce7e0',
                  }}
                />

                <Bar
                  dataKey="members"
                  fill="currentColor"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                />

                <Bar
                  dataKey="impact"
                  fill="rgba(197,226,137,.55)"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>
        </SectionReveal>

      </div>
    </div>
  );
}