import * as core from '@actions/core';

export async function writeSummaryWithTable(
  similarityResults: PackageSimilarityResult[],
) {
  return await core.summary
    .addHeading('Package Similarity Results')
    .addTable([
      [
        { data: 'pkgName1', header: true },
        { data: 'pkgName2', header: true },
        { data: 'description', header: true },
      ],
      ...similarityResults.map((result) => [
        result.pkgName1,
        result.pkgName2,
        result.description,
      ]),
    ])
    .write();
}

export async function writeSummary(results: string) {
  return await core.summary
    .addHeading('Package Similarity Results')
    .addRaw(results)
    .write();
}
