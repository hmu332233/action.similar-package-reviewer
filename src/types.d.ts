/**
 * @typedef {Object} PackageSimilarityResult
 * @property {string} pkgName1 - The package name from the first list.
 * @property {string} pkgName2 - The package name from the second list.
 * @property {string} description - A brief explanation of the similarity between the two packages.
 */
type PackageSimilarityResult = {
  pkgName1: string;
  pkgName2: string;
  description: string;
};

type Inputs = {
  openaiKey: string;
  originBranch: string;
  targetBranch: string;
  useFunctionCall: boolean;
  model: string;
};
