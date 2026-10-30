import {checkSchemeCoverage} from './schemeCoverage';
import type {SchemeOfWork} from './academic';
type Week={id:string;title:string;content:string;sourceWeekId?:string};
export default function CoveragePanel({scheme,weeks}:{scheme:SchemeOfWork|null;weeks:Week[]}){
 if(!scheme)return <section className="coverage-panel"><strong>Curriculum coverage</strong><p>This document is not linked to a saved Scheme of Work.</p></section>;
 const report=checkSchemeCoverage(scheme,weeks);
 return <section className="coverage-panel"><h3>Curriculum coverage</h3><p>{report.covered} of {report.total} topics and subtopics mentioned ({report.percent}%)</p><progress value={report.covered} max={Math.max(report.total,1)} aria-label="Curriculum coverage"/><p className="coverage-note">This is a text-presence check, not proof that a topic has been adequately explained or taught.</p>{report.missing.length?<details><summary>{report.missing.length} missing items — view</summary><ul>{report.missing.map((item,i)=><li key={i}>Week {item.week}: {item.kind} — {item.name}</li>)}</ul></details>:<p>{report.total?'All listed items appear in the lesson text. Review the explanations manually.':'This scheme has no topics to check.'}</p>}</section>
}
