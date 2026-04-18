function normalizeLink(value?: string | null): string {
  return typeof value === "string" ? value.trim() : "";
}

export function normalizeExamRecord(exam: any) {
  if (!exam) return exam;
  const applyLink = normalizeLink(exam.applyLink || exam.applicationLink || exam.officialWebsite);
  const officialWebsite = normalizeLink(exam.officialWebsite || exam.official_url || applyLink);
  const canonicalLink = officialWebsite || applyLink;

  return {
    ...exam,
    applyLink: applyLink || canonicalLink,
    officialWebsite: canonicalLink,
    official_url: canonicalLink,
    createdAt:
      typeof exam.createdAt === "string"
        ? exam.createdAt
        : exam.createdAt?.toISOString?.() ?? exam.createdAt,
  };
}
