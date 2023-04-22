import * as core from '@actions/core';
import * as github from '@actions/github';

/**
 * Get input values from the GitHub Actions.
 * If the input is not available, the default value will be used.
 * @returns {Inputs} input object.
 */
export function getInputs() {
  const inputs: Inputs = {
    originBranch: core.getInput('origin_branch') || 'origin/main',
    targetBranch:
      core.getInput('target_branch') ||
      `origin/${github.context.payload.pull_request?.head.ref}`,
  };
  return inputs;
}
