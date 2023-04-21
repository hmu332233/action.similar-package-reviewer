import { exec } from 'shelljs';

export function getInstalledPackages() {
  const shellResults = exec(`npm ls --parseable`, { silent: true });

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

export function comparePackagesBetweenGitBranches(
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
