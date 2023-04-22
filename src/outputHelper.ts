import * as core from '@actions/core';

const OUTPUT_KEY = 'RESULTS';

export function setResults(results: string) {
  core.setOutput(OUTPUT_KEY, results);
}

export function setNotFound() {
  setResults('No packages were added.');
}
