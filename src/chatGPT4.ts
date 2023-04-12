import { readFileSync } from 'fs';
import { join } from 'path';
import { Configuration, OpenAIApi } from "openai";

const config = JSON.parse(readFileSync(join(__dirname, '..', 'config.json'), 'utf-8'));

const configuration = new Configuration({
    organization: config.organization,
    apiKey: config.openAI_apiKey,
});

const openai = new OpenAIApi(configuration);

export async function queryChatGPT4(prompt: string): Promise<string | null> {
    const models = ["gpt-4", "text-davinci-003", "text-davinci-002", "text-curie-002"]; // Specify the models in the order you want to try
    let bestCompletion: string | null = null;

    async function generateCompletion(model: string): Promise<string | null> {
        try {
            const completions: any = await openai.createCompletion({
                model: model,
                prompt: prompt,
                // eslint-disable-next-line @typescript-eslint/naming-convention
                max_tokens: 4096,
                temperature: 0.7,
            });

            const generatedText = completions.choices[0].text;
            return generatedText;
        } catch (error: any) {
            console.error(`Error querying model (${model}):`, error);
            return null;
        }
    }

    for (const model of models) {
        bestCompletion = await generateCompletion("gpt-4");

        if (!bestCompletion) {
            continue;
        }
        break;
    }

    return bestCompletion;
}

