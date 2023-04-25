const COMMENT_MARKER = '<!-- compare-dependencies-comment-marker -->';

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

  const tableRows = similarityResults.map(createTableRow).join('');
  const markdownTable = createTableHeader() + tableRows;

  return `${markdownTable}\n\n${COMMENT_MARKER}`;
}

function createTableHeader(): string {
  return '| pkgName1 | pkgName2 | description |\n| --- | --- | --- |\n';
}

function createTableRow(row: PackageSimilarityResult): string {
  return `| ${row.pkgName1} | ${row.pkgName2} | ${row.description} |\n`;
}
