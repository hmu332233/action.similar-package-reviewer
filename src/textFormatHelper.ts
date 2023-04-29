const HEADER_TEXT =
  '**Here are the package comparison results! 📦🔍😃 Check it out!**';
const COMMENT_MARKER = '<!-- compare-dependencies-comment-marker -->';

/**
 * Formats an array of `PackageSimilarityResult` into a user-friendly string.
 * @param similarityResults - An array of `PackageSimilarityResult` to format.
 * @returns A formatted string containing the similarity results.
 */
export function formatPackageSimilarity(
  similarityResults: PackageSimilarityResult[],
) {
  if (!similarityResults?.length) {
    return wrapContentWithHeaderAndFooter('No similar packages found.');
  }

  const tableRows = similarityResults.map(createTableRow).join('');
  const markdownTable = createTableHeader() + tableRows;

  return wrapContentWithHeaderAndFooter(markdownTable);
}

function wrapContentWithHeaderAndFooter(content: string) {
  return `${HEADER_TEXT}\n\n${content}\n\n${COMMENT_MARKER}`;
}

function createTableHeader(): string {
  return '| Existing Package | New Package | description |\n| --- | --- | --- |\n';
}

function createTableRow(row: PackageSimilarityResult): string {
  return `| ${row.pkgName1} | ${row.pkgName2} | ${row.description} |\n`;
}
