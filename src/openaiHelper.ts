import * as core from '@actions/core';
import { Configuration, OpenAIApi } from 'openai';

const SYSTEM_PROMPT = `Both list A and B are node module packages.
Please compare the packages in lists A and B, and find the replaceable packages.
The replaceable package means similar and alternative package.
If replaceable packages are found, please present the information in the following JSON format:
[ { "pkgName1": "[package from A list]", "pkgName2": "[package from B list]", "description": "[brief explanation of the similarity]" }]
If no replaceable packages are found, output []. Please ensure only the JSON format is provided in the response.`;

const PARSE_FUNCTION = {
  name: 'parse_transaction',
  parameters: {
    type: 'object',
    properties: {
      items: {
        type: 'array',
        description:
          'An array of objects representing replaceable packages and explanation. If no replaceable packages are found, input empty array',
        items: {
          type: 'object',
          properties: {
            pkgName1: {
              type: 'string',
              description: 'package from A list',
            },
            pkgName2: {
              type: 'string',
              description: 'package from A list',
            },
            description: {
              type: 'string',
              description: 'brief explanation of the similarity',
            },
          },
        },
      },
    },
  },
};

/**
 * Creates a prompt for OpenAI API to compare packages from two lists and identify any with similar purposes.
 * @param {string[]} pkgNames1 - The first list of package names.
 * @param {string[]} pkgNames2 - The second list of package names.
 * @returns {string} A formatted prompt to be used with OpenAI API.
 */
function createPrompt(pkgNames1: string[], pkgNames2: string[]) {
  return `A List: ${pkgNames1.join(', ')}\nB List: ${pkgNames2.join(', ')}`;
}

/**
 * Compares packages from two lists using OpenAI API, and returns the similarities between them.
 * @param {string} openaiKey - openai key.
 * @param {string[]} originPackages - The first list of package names.
 * @param {string[]} addedPackages - The second list of package names.
 * @returns {Promise<PackageSimilarityResult[]>} A promise that resolves to an array of package similarity results.
 */
export async function comparePackagesUsingMessage(
  openaiKey: string,
  originPackages: string[],
  addedPackages: string[],
  model: string,
): Promise<PackageSimilarityResult[]> {
  const configuration = new Configuration({
    apiKey: openaiKey,
  });
  const openai = new OpenAIApi(configuration);

  const content = createPrompt(originPackages, addedPackages);
  core.debug(`prompt: ${content}`);

  const completion = await openai.createChatCompletion({
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content },
    ],
  });

  const messageContent = completion.data.choices[0].message?.content || '[]';
  const comparedPkgs = safelyParseJSON<PackageSimilarityResult[]>(
    messageContent,
    [],
  );
  core.debug(`comparedPkgs: ${JSON.stringify(comparedPkgs)}`);

  return comparedPkgs;
}

/**
 * Compares packages from two lists using OpenAI API, and returns the similarities between them.
 * @param {string} openaiKey - openai key.
 * @param {string[]} originPackages - The first list of package names.
 * @param {string[]} addedPackages - The second list of package names.
 * @returns {Promise<PackageSimilarityResult[]>} A promise that resolves to an array of package similarity results.
 */
export async function comparePackagesUsingFunctionCall(
  openaiKey: string,
  originPackages: string[],
  addedPackages: string[],
  model: string,
): Promise<PackageSimilarityResult[]> {
  const configuration = new Configuration({
    apiKey: openaiKey,
  });
  const openai = new OpenAIApi(configuration);

  const content = createPrompt(originPackages, addedPackages);
  core.debug(`prompt: ${content}`);

  const completion = await openai.createChatCompletion({
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content },
    ],
    functions: [PARSE_FUNCTION],
    function_call: { name: PARSE_FUNCTION.name },
  });

  const messageContent =
    completion.data.choices[0].message?.function_call?.arguments ||
    '{"items":[]}';
  const { items: comparedPkgs } = safelyParseJSON<{
    items: PackageSimilarityResult[];
  }>(messageContent, { items: [] });
  core.debug(`comparedPkgs: ${JSON.stringify(comparedPkgs)}`);

  return comparedPkgs;
}

function safelyParseJSON<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json);
  } catch (error) {
    core.error(`safelyParseJSON: parsing error: ${error}`);
    return defaultValue;
  }
}
