import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface OrgEntry {
  type: 'org' | 'enterprise';
  name: string;
}

interface OrgState {
  current: OrgEntry | null;
  teamSlug: string | null;
  savedOrgs: OrgEntry[];
  setCurrent: (org: OrgEntry) => void;
  setTeamSlug: (slug: string | null) => void;
  addOrg: (org: OrgEntry) => void;
  removeOrg: (name: string) => void;
}

export const useOrgStore = create<OrgState>()(
  persist(
    (set) => ({
      current: null,
      teamSlug: null,
      savedOrgs: [],
      setCurrent: (current) => set({ current, teamSlug: null }),
      setTeamSlug: (teamSlug) => set({ teamSlug }),
      addOrg: (org) =>
        set((state) => ({
          savedOrgs: state.savedOrgs.some((o) => o.name === org.name)
            ? state.savedOrgs
            : [...state.savedOrgs, org],
          current: state.current ?? org,
        })),
      removeOrg: (name) =>
        set((state) => ({
          savedOrgs: state.savedOrgs.filter((o) => o.name !== name),
          current: state.current?.name === name ? state.savedOrgs[0] ?? null : state.current,
        })),
    }),
    { name: 'copilot-dashboard-org' }
  )
);
