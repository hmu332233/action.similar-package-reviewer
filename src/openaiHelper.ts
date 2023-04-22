import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

/**
 * Creates a prompt for OpenAI API to compare packages from two lists and identify any with similar purposes.
 * @param {string[]} pkgNames1 - The first list of package names.
 * @param {string[]} pkgNames2 - The second list of package names.
 * @returns {string} A formatted prompt to be used with OpenAI API.
 */
function createPrompt(pkgNames1: string[], pkgNames2: string[]) {
  return `Please compare the packages in lists A and B, and identify any with similar purposes.
If a similar package is found, please present the information in the following JSON format:
[ { "pkgName1": "[package from A list]", "pkgName2": "[package from B list]", "description": "[brief explanation of the similarity]" }]
If no similar packages are found, output "[]". Please ensure only the JSON format is provided in the response.
  
Here are the package lists:
A List: ${pkgNames1.join(',')}
B List: ${pkgNames2.join(',')}`;
}

/**
 * Compares packages from two lists using OpenAI API, and returns the similarities between them.
 * @param {string[]} originPackages - The first list of package names.
 * @param {string[]} addedPackages - The second list of package names.
 * @returns {Promise<PackageSimilarityResult[]>} A promise that resolves to an array of package similarity results.
 */
export async function comparePackagesUsingOpenAI(
  originPackages: string[],
  addedPackages: string[],
): Promise<PackageSimilarityResult[]> {
  const content = createPrompt(originPackages, addedPackages);

  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content }],
  });

  const comparedPkgs = JSON.parse(
    completion.data.choices[0].message?.content || '[]',
  );
  return comparedPkgs;
}
