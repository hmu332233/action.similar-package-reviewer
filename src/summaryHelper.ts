import * as core from '@actions/core';

export async function writeSummary(results: string) {
  return await core.summary
    .addHeading('Package Similarity Results')
    .addRaw(results)
    .write();
}
