import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  FileText,
  UsersRound,
  TrendingUp,
  Award,
  Bell,
} from 'lucide-react';

import { getSession } from '../services/auth';
import { getState } from '../services/mockStore';

const configs = {
  trainer: {
    eyebrow: 'Trainer dashboard',
    title: 'Teach with evidence. Improve with insight.',
    subtitle:
      'Manage learning resources, questionnaires, and trainee performance from one workspace.',
    cards: [
      ['Total trainees', '248', UsersRound, 'blue'],
      ['Active courses', '14', BookOpen, 'green'],
      ['Learning resources', '96', FileText, 'purple'],
      ['Avg. performance', '78%', TrendingUp, 'orange'],
    ],
  },

  admin: {
    eyebrow: 'Admin dashboard',
    title: 'Organizational capacity at a glance.',
    subtitle:
      'Monitor users, learning activity, certifications, and competency trends across the platform.',
    cards: [
      ['Total users', '1,842', UsersRound, 'blue'],
      ['Pending approvals', '27', CheckCircle2, 'orange'],
      ['Total courses', '86', BookOpen, 'green'],
      ['Certifications', '612', Award, 'purple'],
    ],
  },
};

export default function RoleDashboard() {
  const session = getSession();
  const announcements = getState().announcements.slice(0, 2);
  const c = configs[session.role];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="eyebrow">{c.eyebrow}</div>

      <h1 className="mt-2 text-3xl font-black text-navy">
        {c.title}
      </h1>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {c.subtitle}
      </p>

      {/* Stats Cards */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {c.cards.map(([label, value, Icon, tone]) => (
          <div className="card p-5" key={label}>
            <div
              className={`grid h-10 w-10 place-items-center rounded-xl ${
                tone === 'blue'
                  ? 'bg-blue-50 text-brand'
                  : tone === 'green'
                  ? 'bg-emerald-50 text-success'
                  : tone === 'purple'
                  ? 'bg-violet-50 text-purple'
                  : 'bg-orange-50 text-orange-600'
              }`}
            >
              <Icon size={19} />
            </div>

            <div className="mt-5 text-2xl font-black text-slate-900">
              {value}
            </div>

            <div className="mt-1 text-sm text-slate-500">
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Analytics + Activity */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Performance */}
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-brand" />

            <div>
              <h2 className="font-bold">Performance overview</h2>

              <p className="text-xs text-slate-500">
                Prototype analytics ready for live API data.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {[
              'Participation',
              'Course completion',
              'Competency growth',
            ].map((x, i) => (
              <div key={x}>
                <div className="flex justify-between text-sm font-semibold">
                  <span>{x}</span>
                  <span>{[84, 72, 68][i]}%</span>
                </div>

                <div className="mt-2 h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-brand"
                    style={{
                      width: `${[84, 72, 68][i]}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center gap-3">
            <Bell className="text-purple" />

            <div>
              <h2 className="font-bold">Recent activity</h2>

              <p className="text-xs text-slate-500">
                Latest workspace events
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {(session.role === 'admin'
              ? [
                  'Trainer account approved',
                  'New course submitted for review',
                  '12 certifications updated',
                ]
              : [
                  '32 trainees completed a lesson',
                  'New Web Development resource added',
                  'Questionnaire closes Friday',
                ]
            ).map((x) => (
              <div
                key={x}
                className="rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700"
              >
                {x}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="card mt-6 p-6">
        <div className="flex items-center gap-3">
          <Bell className="text-brand" />

          <h2 className="font-black">
            Recent announcements
          </h2>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="rounded-xl bg-slate-50 p-4"
            >
              <div className="text-xs font-bold text-brand">
                {a.type} • {a.date}
              </div>

              <div className="mt-1 font-bold">
                {a.title}
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {a.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}