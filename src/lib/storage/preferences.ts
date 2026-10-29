const PREFS_KEY = 'stellar_threads_user_prefs';

export interface UserPreferences {
  activePersona: 'Buyer' | 'Designer' | 'Inspector';
  showDualCurrency: boolean;
  autoBumpStorage: boolean;
}

const DEFAULT_PREFS: UserPreferences = {
  activePersona: 'Buyer',
  showDualCurrency: true,
  autoBumpStorage: true,
};

export function loadUserPreferences(): UserPreferences {
  if (typeof window === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadUserPreferences();
    localStorage.setItem(PREFS_KEY, JSON.stringify({ ...current, ...prefs }));
  } catch (err) {
    console.error('Failed to persist user preferences:', err);
  }
}
