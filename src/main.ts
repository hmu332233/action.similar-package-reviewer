import * as core from '@actions/core';
import * as dotenv from 'dotenv';
dotenv.config();

import * as inputHelper from './inputHelper';
import * as outputHelper from './outputHelper';
import * as openaiHelper from './openaiHelper';
import * as packageDiffHelper from './packageDiffHelper';
import * as textFormatHelper from './textFormatHelper';
import * as summaryHelper from './summaryHelper';

async function run(): Promise<void> {
  const { openaiKey, originBranch, targetBranch } = inputHelper.getInputs();

  core.startGroup('Get Package List');
  const { originPackages, addedPackages } =
    packageDiffHelper.getPackageChangesBetweenBranches(
      originBranch,
      targetBranch,
    );
  core.endGroup();

  if (addedPackages.length === 0) {
    return outputHelper.setNotFound();
  }

  core.startGroup('Compare Packages Using OpenAI');
  const packageSimilarityResults =
    await openaiHelper.comparePackagesUsingOpenAI(
      openaiKey,
      originPackages,
      addedPackages,
    );
  core.endGroup();

  core.startGroup('Format Messages');
  const formattedResults = textFormatHelper.formatPackageSimilarity(
    packageSimilarityResults,
  );
  core.debug(`message: ${formattedResults}`);
  core.endGroup();

  core.startGroup('Set Results');
  outputHelper.setResults(formattedResults);
  await summaryHelper.writeSummary(formattedResults);
  core.endGroup();

  return;
}

run();
