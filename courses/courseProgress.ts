const PREFIX = 'rafeeque_course_progress_v1:';

export interface CourseProgressState {
  completedChapterIds: string[];
  /** Last chapter index the learner had open (0-based). */
  lastChapterIndex?: number;
  /** After learner clicks Start / Continue, skip the intro overview on return visits. */
  playerOpen?: boolean;
}

export function courseProgressKey(courseSlug: string): string {
  return `${PREFIX}${courseSlug}`;
}

export function loadCourseProgress(courseSlug: string): CourseProgressState {
  try {
    const raw = localStorage.getItem(courseProgressKey(courseSlug));
    if (!raw) return { completedChapterIds: [] };
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object') return { completedChapterIds: [] };
    const ids = (parsed as { completedChapterIds?: unknown }).completedChapterIds;
    if (!Array.isArray(ids)) return { completedChapterIds: [] };
    const last = (parsed as { lastChapterIndex?: unknown }).lastChapterIndex;
    const lastChapterIndex =
      typeof last === 'number' && Number.isFinite(last) && last >= 0 ? Math.floor(last) : undefined;
    const po = (parsed as { playerOpen?: unknown }).playerOpen;
    const playerOpen = po === true ? true : undefined;
    return {
      completedChapterIds: ids.filter((x): x is string => typeof x === 'string'),
      ...(lastChapterIndex !== undefined ? { lastChapterIndex } : {}),
      ...(playerOpen ? { playerOpen: true } : {}),
    };
  } catch {
    return { completedChapterIds: [] };
  }
}

export function saveCourseProgress(courseSlug: string, state: CourseProgressState): void {
  try {
    localStorage.setItem(courseProgressKey(courseSlug), JSON.stringify(state));
  } catch {
    /* quota / private mode */
  }
}

export function isChapterComplete(courseSlug: string, chapterId: string): boolean {
  return loadCourseProgress(courseSlug).completedChapterIds.includes(chapterId);
}

export function setChapterComplete(courseSlug: string, chapterId: string, done: boolean): CourseProgressState {
  const cur = loadCourseProgress(courseSlug);
  const set = new Set(cur.completedChapterIds);
  if (done) set.add(chapterId);
  else set.delete(chapterId);
  const next: CourseProgressState = {
    ...cur,
    completedChapterIds: [...set],
  };
  saveCourseProgress(courseSlug, next);
  return next;
}

export function progressFraction(courseSlug: string, chapterIds: string[]): number {
  if (chapterIds.length === 0) return 0;
  const done = loadCourseProgress(courseSlug).completedChapterIds.filter((id) => chapterIds.includes(id)).length;
  return done / chapterIds.length;
}

export function setLastChapterIndex(courseSlug: string, index: number): void {
  const cur = loadCourseProgress(courseSlug);
  saveCourseProgress(courseSlug, { ...cur, lastChapterIndex: index });
}

export function setCoursePlayerOpen(courseSlug: string, open: boolean): void {
  const cur = loadCourseProgress(courseSlug);
  const next: CourseProgressState = { ...cur };
  if (open) next.playerOpen = true;
  else delete next.playerOpen;
  saveCourseProgress(courseSlug, next);
}

export function loadLastChapterIndex(courseSlug: string, maxExclusive: number): number {
  const raw = loadCourseProgress(courseSlug).lastChapterIndex;
  if (typeof raw !== 'number' || !Number.isFinite(raw) || maxExclusive <= 0) return 0;
  return Math.min(Math.max(0, Math.floor(raw)), maxExclusive - 1);
}

/** Chapter index `i` is reachable only after all chapters `0..i-1` are marked complete. */
export function isChapterIndexUnlocked(courseSlug: string, orderedChapterIds: string[], index: number): boolean {
  if (index <= 0) return true;
  const done = new Set(loadCourseProgress(courseSlug).completedChapterIds);
  for (let j = 0; j < index; j++) {
    if (!done.has(orderedChapterIds[j])) return false;
  }
  return true;
}

/** Highest index that is unlocked (always at least 0 when there is one chapter). */
export function maxUnlockedChapterIndex(courseSlug: string, orderedChapterIds: string[]): number {
  if (orderedChapterIds.length === 0) return 0;
  let max = 0;
  for (let i = 0; i < orderedChapterIds.length; i++) {
    if (isChapterIndexUnlocked(courseSlug, orderedChapterIds, i)) max = i;
    else break;
  }
  return max;
}
