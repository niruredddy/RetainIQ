export function skillAlignment(
  currentSkills: string[],
  requiredSkills: string[],
) {
  const normalize = (skill: string) => skill.trim().toLocaleLowerCase();
  const unique = (skills: string[]) => [
    ...new Map(
      skills
        .filter((skill) => skill.trim())
        .map((skill) => [normalize(skill), skill.trim()]),
    ).values(),
  ];
  const current = unique(currentSkills);
  const required = unique(requiredSkills);
  const present = new Set(current.map(normalize));
  const overlap = required.filter((skill) => present.has(normalize(skill)));
  const gaps = required.filter((skill) => !present.has(normalize(skill)));
  return {
    current,
    required,
    overlap,
    gaps,
    match: required.length
      ? Math.round((overlap.length / required.length) * 100)
      : 0,
  };
}
export function riskLevel(score: number) {
  return score > 70 ? "Critical" : score > 30 ? "Elevated" : "Low";
}
