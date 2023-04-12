import * as vscode from 'vscode';
import { queryChatGPT4 } from './chatGPT4';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('chatGPT4.query', async () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('Please open a text editor to use Mr.JJ17(GPT-4).');
			return;
		}

		const prompt = await vscode.window.showInputBox({ prompt: 'Enter your query for Mr.JJ17(GPT-4):' });
		if (!prompt) {
			return;
		}

		try {

			const generatedText: any = await queryChatGPT4(prompt);

			if (generatedText) {
				editor.edit((editBuilder) => {
					const currentPosition = editor.selection.active;
					editBuilder.insert(currentPosition, generatedText);
				});
			} else {
				vscode.window.showErrorMessage('An error occurred while querying ChatGPT-4.');
			}

		} catch (error: any) {
			vscode.window.showErrorMessage(`Error generating completion: ${error.message}`);
		}
	});

	context.subscriptions.push(disposable);
}

export function deactivate() { /* TODO document why this function 'deactivate' is empty */ }
