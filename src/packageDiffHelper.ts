import { exec } from 'shelljs';

/**
 * Retrieves a list of installed npm packages.
 * @returns {string[]} An array of installed package names.
 */
function getInstalledPackages() {
  const shellResults = exec(`npm i; npm ls --parseable`, { silent: true });

  if (shellResults.code !== 0) {
    console.log(shellResults.stderr);
    return [];
  }

  const installedPackages = shellResults.stdout
    .split('\n')
    .map((line) => line.split('node_modules/')[1])
    .filter(Boolean);

  return installedPackages;
}

/**
 * Retrieves a list of added package names from the Git diff between two branches.
 * @param {string} branch1 - The first branch to compare.
 * @param {string} branch2 - The second branch to compare.
 * @returns {string[]} An array of added package names.
 */
function getAddedPackagesFromGitDiff(branch1: string, branch2: string) {
  const shellResults = exec(
    `git diff ${branch1} ${branch2} -- package.json | grep -E '^\\+' | grep -E '\".+\":\\s*\".+"' | sed -E 's/^\\+.*\"([^"]+)\":.*$/\\1/' | tr '\\n' ',' | sed 's/,$//'`,
    { silent: true },
  );

  if (shellResults.code !== 0) {
    console.log(shellResults.stderr);
    return [];
  }

  const addedPackages = shellResults.stdout.split(',').filter(Boolean);
  return addedPackages;
}

/**
 * Retrieves the package changes between two Git branches, returning the unmodified (original) and added packages.
 * @param {string} branch1 - The first branch to compare.
 * @param {string} branch2 - The second branch to compare.
 * @returns {Object} An object containing the original and added packages as arrays.
 * @property {string[]} originPackages - An array of unmodified (original) package names.
 * @property {string[]} addedPackages - An array of added package names.
 */
export function getPackageChangesBetweenBranches(
  branch1: string,
  branch2: string,
) {
  const installedPackages = getInstalledPackages();
  const addedPackages = getAddedPackagesFromGitDiff(branch1, branch2);

  const originPackages = installedPackages.filter(
    (v) => !addedPackages.includes(v),
  );

  return { originPackages, addedPackages };
}
