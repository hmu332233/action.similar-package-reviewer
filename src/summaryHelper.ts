import * as core from '@actions/core';

export async function writeSummary(results: string) {
  return await core.summary.addRaw(results).write();
}
