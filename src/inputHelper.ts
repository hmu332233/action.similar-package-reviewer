import * as core from '@actions/core';

/**
 * Get input values from the GitHub Actions.
 * If the input is not available, the default value will be used.
 * @returns {Inputs} input object.
 */
export function getInputs() {
  const inputs: Inputs = {
    openaiKey: core.getInput('openai_key') || process.env.OPENAI_API_KEY!,
    originBranch: core.getInput('origin_branch', { required: true }),
    targetBranch: core.getInput('target_branch', { required: true }),
    useFunctionCall: core.getInput('use_functioncall') === 'true',
    model: core.getInput('model'),
  };
  return inputs;
}
