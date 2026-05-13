# Solis Planner
### Live demo: https://solis-planner.vercel.app/

## 🔤 What is this project about?
Solis Planner is a project lifecycle workspace that guides teams through four structured phases: initiation, planning, execution, and closing. It centralizes project context, tracks progress over time, and keeps each phase documented in one place so teams can move from kickoff to wrap-up with clearer visibility.

## 💻 Technologies Utilized
- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend/BaaS**: Supabase (authentication + project data persistence)
- **Data/state layer**: TanStack Query for fetching, caching, and mutation flows
- **Deployment**: Vercel-ready Next.js setup

## ✨ Current Features / Functionality
- Secure login flow and project dashboard with CRUD operations
- Project status lifecycle management (`active`, `completed`, `archived`)
- Tabbed project workflow across initiation, planning, execution, and closing
- Phase-specific forms with tailored fields (objectives, risks, resources, blockers, deliverables, lessons learned)
- Dirty-state tracking and explicit save actions with last-saved feedback
- Execution tab completion slider plus visual progress bar for delivery tracking

## 🛠️ Upcoming Features / Improvements
- Collaboration features (comments, assignees, and activity timeline)
- Reporting/export options for stakeholder updates and end-of-project summaries
