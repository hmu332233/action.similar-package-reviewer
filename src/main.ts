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
  const { openaiKey, originBranch, targetBranch, useFunctionCall, model } =
    inputHelper.getInputs();

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
  const comparePackages = useFunctionCall
    ? openaiHelper.comparePackagesUsingFunctionCall
    : openaiHelper.comparePackagesUsingMessage;
  const packageSimilarityResults = await comparePackages(
    openaiKey,
    originPackages,
    addedPackages,
    model,
  );
  core.endGroup();

  core.startGroup('Set Results');
  const formattedResults = textFormatHelper.formatPackageSimilarity(
    packageSimilarityResults,
  );
  outputHelper.setResults(formattedResults);
  await summaryHelper.writeSummary(formattedResults);
  core.debug(`message: ${formattedResults}`);
  core.endGroup();

  return;
}

run();
