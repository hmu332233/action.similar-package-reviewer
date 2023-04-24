import * as dotenv from 'dotenv';
dotenv.config();

import * as inputHelper from './inputHelper';
import * as outputHelper from './outputHelper';
import * as openaiHelper from './openaiHelper';
import * as packageDiffHelper from './packageDiffHelper';
import * as textFormatHelper from './textFormatHelper';

async function run(): Promise<void> {
  const { openaiKey, originBranch, targetBranch } = inputHelper.getInputs();

  const { originPackages, addedPackages } =
    packageDiffHelper.getPackageChangesBetweenBranches(
      originBranch,
      targetBranch,
    );

  if (addedPackages.length === 0) {
    return outputHelper.setNotFound();
  }

  const packageSimilarityResults =
    await openaiHelper.comparePackagesUsingOpenAI(
      openaiKey,
      originPackages,
      addedPackages,
    );
  const formattedResults = textFormatHelper.formatPackageSimilarity(
    packageSimilarityResults,
  );

  return outputHelper.setResults(formattedResults);
}

run();
