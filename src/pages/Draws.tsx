import { FormEvent, useMemo, useState } from 'react';
import {
  CalendarDays,
  ChevronDown,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import SectionReveal from '../components/SectionReveal';
import Pill from '../components/Pill';
import ImpactResultSelect from '../components/ImpactResultSelect';

import {
  addScore,
  calculateFormScore,
  deleteScore,
} from '../lib/services';

import { loadDemoState } from '../lib/demoData';

import type {
  CricketFormat,
  MatchResult,
} from '../types';

export default function Scores() {
  const { profile } = useAuth();

  const [state, setState] = useState(() => loadDemoState());

  const [runs, setRuns] = useState('');
  const [wickets, setWickets] = useState('0');

  const [format, setFormat] =
    useState<CricketFormat>('T20');

  const [result, setResult] =
    useState<MatchResult>('Win');

  const [date, setDate] =
    useState(new Date().toISOString().slice(0, 10));

  const preview = useMemo(
    () =>
      calculateFormScore(
        Number(runs || 0),
        Number(wickets || 0),
        result
      ),
    [runs, wickets, result]
  );

  async function submit(e: FormEvent) {
    e.preventDefault();

    try {
      const scores = await addScore(
        profile!.id,
        Number(runs),
        Number(wickets),
        format,
        result,
        date
      );

      setState({
        ...state,
        scores,
      });

      setRuns('');
      setWickets('0');

      toast.success(
        'Match saved. Your latest-five form history has been updated.'
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : 'Could not save match'
      );
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="CRICKET FORM"
        title="Track the latest five matches."
        body="Log runs, wickets, format, and result. ImpactPlay converts each match into a transparent 1–45 Form Score used for your performance view and draw insights."
      />

      <div className="container score-page">

        {/* =====================================================
            MATCH PERFORMANCE FORM
            ===================================================== */}

        <SectionReveal>
          <form
            className="panel glass-card score-form cricket-score-form"
            onSubmit={submit}
          >
            <div className="form-section-title">
              <ShieldCheck size={16} />

              <div>
                <strong>Match performance</strong>

                <span>
                  One match per date · latest five retained
                </span>
              </div>
            </div>

            <div className="score-form-grid">

              {/* RUNS */}

              <label>
                Runs

                <input
                  type="number"
                  min="0"
                  max="500"
                  value={runs}
                  onChange={(e) =>
                    setRuns(e.target.value)
                  }
                  placeholder="e.g. 78"
                  required
                />
              </label>


              {/* WICKETS */}

              <label>
                Wickets

                <input
                  type="number"
                  min="0"
                  max="10"
                  value={wickets}
                  onChange={(e) =>
                    setWickets(e.target.value)
                  }
                  required
                />
              </label>


              {/* FORMAT */}

              <label>
                Format

                <div className="select-wrap">
                  <select
                    value={format}
                    onChange={(e) =>
                      setFormat(
                        e.target.value as CricketFormat
                      )
                    }
                  >
                    <option value="T20">
                      T20
                    </option>

                    <option value="ODI">
                      ODI
                    </option>

                    <option value="Test">
                      Test
                    </option>
                  </select>

                  <ChevronDown size={14} />
                </div>
              </label>


              {/* RESULT — CUSTOM DROPDOWN */}

              <label>
                Result

                <ImpactResultSelect
                  value={result}
                  onChange={(value) =>
                    setResult(value)
                  }
                />
              </label>


              {/* MATCH DATE */}

              <label>
                Match date

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  required
                />
              </label>


              {/* FORM SCORE */}

              <div className="form-score-preview">
                <span>
                  Live Form Score
                </span>

                <strong>
                  {preview}
                </strong>

                <small>
                  1–45 normalized signal
                </small>
              </div>
            </div>


            {/* ADD MATCH */}

            <button
              className="btn btn-primary"
              type="submit"
            >
              <Plus size={16} />

              Add match
            </button>
          </form>
        </SectionReveal>


        {/* =====================================================
            LATEST FIVE MATCHES
            ===================================================== */}

        <SectionReveal delay={0.08}>
          <div className="panel glass-card">

            <div className="panel-head">

              <div>
                <span className="eyebrow">
                  LATEST 5
                </span>

                <h2>
                  Your recent cricket form
                </h2>
              </div>

              <Pill>
                {state.scores.length}/5 retained
              </Pill>
            </div>


            <div className="score-list large">

              {state.scores.map((s) => (
                <div
                  className="score-row cricket-score-row"
                  key={s.id}
                >

                  {/* DATE */}

                  <div className="score-date">
                    <CalendarDays size={15} />

                    <span>
                      {new Date(
                        s.score_date
                      ).toLocaleDateString(
                        'en-IN',
                        {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </span>
                  </div>


                  {/* MATCH SUMMARY */}

                  <div className="match-summary">
                    <strong>
                      {s.runs} runs · {s.wickets} wkts
                    </strong>

                    <small>
                      {s.format} · {s.result}
                    </small>
                  </div>


                  {/* FORM SCORE */}

                  <strong className="form-score-number">
                    {s.score}
                  </strong>


                  {/* SCORE BAR */}

                  <span className="score-bar">
                    <span
                      style={{
                        width: `${Math.round(
                          (s.score / 45) * 100
                        )}%`,
                      }}
                    />
                  </span>


                  {/* SCORE LABEL */}

                  <span className="score-rank">
                    Form
                  </span>


                  {/* DELETE */}

                  <button
                    className="icon-btn danger"
                    onClick={async () => {
                      const scores =
                        await deleteScore(
                          s.id,
                          profile!.id
                        );

                      setState({
                        ...state,
                        scores,
                      });

                      toast.success(
                        'Match removed'
                      );
                    }}
                    aria-label="Delete match"
                    type="button"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              ))}

            </div>
          </div>
        </SectionReveal>


        {/* =====================================================
            FORM SCORE INFORMATION
            ===================================================== */}

        <div className="rule-note">
          <strong>
            How Form Score works
          </strong>

          <span>
            Runs + wickets + result bonus, capped at 45 ·
            duplicate date blocked · newest first
          </span>
        </div>

      </div>
    </div>
  );
}