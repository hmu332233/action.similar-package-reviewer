import * as core from '@actions/core';

const OUTPUT_KEY = 'RESULTS';

/**
 * Sets the output of the Github Action with the provided results.
 * @param results - The string results to set as the output.
 */
export function setResults(results: string) {
  core.setOutput(OUTPUT_KEY, results);
}

/**
 * Sets the output of the Github Action to indicate that no packages were added.
 */
export function setNotFound() {
  setResults('No packages were added.');
}
