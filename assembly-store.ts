export type AssemblyEvent = {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  published: boolean;
  registrations: { username: string; response: string }[];
};

const KEY = "assembly_events_v1";

export function loadEvents(): AssemblyEvent[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); }
  catch { return []; }
}

export function saveEvents(events: AssemblyEvent[]) {
  localStorage.setItem(KEY, JSON.stringify(events));
}

export function addEvent(event: AssemblyEvent) {
  const events = loadEvents();
  saveEvents([event, ...events]);
}

export function registerForEvent(id: string, username: string, response: string) {
  const events = loadEvents().map(event => {
    if (event.id !== id) return event;
    const registrations = event.registrations.filter(r => r.username !== username);
    registrations.push({ username, response });
    return { ...event, registrations };
  });
  saveEvents(events);
}


export type AssemblyActivity = {
  id: string;
  name: string;
  description: string;
  category: string;
  duration: string;
  materials: string;
  ageSuitability: string;
};

const ACTIVITY_KEY = "assembly_activities_v1";

const DEFAULT_ACTIVITIES: AssemblyActivity[] = [
  { id: "quiz-general", name: "General Quiz", description: "A friendly team quiz with fun questions.", category: "Quiz", duration: "20 min", materials: "Question cards", ageSuitability: "All ages" },
  { id: "musical-chairs", name: "Musical Chairs", description: "Classic music-and-movement game.", category: "Games", duration: "15 min", materials: "Chairs, music", ageSuitability: "All ages" },
  { id: "storytelling", name: "Storytelling", description: "Members tell a short story to the group.", category: "Creative", duration: "10 min", materials: "None", ageSuitability: "All ages" },
  { id: "stage-performance", name: "Stage Performance", description: "Dance, music, drama, poetry or another performance.", category: "Performance", duration: "5–10 min", materials: "As needed", ageSuitability: "All ages" },
];

export function loadActivities(): AssemblyActivity[] {
  if (typeof window === "undefined") return DEFAULT_ACTIVITIES;
  try {
    const saved = localStorage.getItem(ACTIVITY_KEY);
    if (!saved) {
      localStorage.setItem(ACTIVITY_KEY, JSON.stringify(DEFAULT_ACTIVITIES));
      return DEFAULT_ACTIVITIES;
    }
    return JSON.parse(saved);
  } catch { return DEFAULT_ACTIVITIES; }
}

export function saveActivities(activities: AssemblyActivity[]) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activities));
}

export function addActivity(activity: AssemblyActivity) {
  saveActivities([activity, ...loadActivities()]);
}

export function getEventActivities(eventId: string): string[] {
  try { return JSON.parse(localStorage.getItem(`assembly_event_activities_${eventId}`) || "[]"); }
  catch { return []; }
}

export function saveEventActivities(eventId: string, activityIds: string[]) {
  localStorage.setItem(`assembly_event_activities_${eventId}`, JSON.stringify(activityIds));
}
