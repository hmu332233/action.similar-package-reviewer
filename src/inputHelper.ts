import * as core from '@actions/core';
import * as github from '@actions/github';

export function getInputs() {
  const inputs: Inputs = {
    originBranch: core.getInput('origin_branch') || 'origin/main',
    targetBranch:
      core.getInput('target_branch') ||
      `origin/${github.context.payload.pull_request?.head.ref}`,
  };
  return inputs;
}
