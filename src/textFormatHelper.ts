/**
 * Formats an array of `PackageSimilarityResult` into a user-friendly string.
 * @param similarityResults - An array of `PackageSimilarityResult` to format.
 * @returns A formatted string containing the similarity results.
 */
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
