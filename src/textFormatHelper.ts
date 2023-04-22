export function formatPackageSimilarity(
  similarityResults: PackageSimilarityResult[],
) {
  if (!similarityResults || similarityResults.length === 0) {
    return 'No similar packages found.';
  }

  const formattedResults = similarityResults.map(
    ({ pkgName1, pkgName2, description }) =>
      `- ${pkgName1} and ${pkgName2}: ${description}`,
  );

  return `Similar packages:\n\n${formattedResults.join('\n')}`;
}
