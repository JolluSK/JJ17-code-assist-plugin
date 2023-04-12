import * as vscode from 'vscode';
import { queryChatGPT4 } from './chatGPT4';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('chatGPT4.query', async () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('Please open a text editor to use Mr.jj17(GPT-4).');
			return;
		}

		// const prompt = await vscode.window.showInputBox({ prompt: 'Enter your query for Mr.jj17(GPT-4):' });
		// if (!prompt) {
		// 	return;
		// }

		// Get text from active editor
		const text = editor.document.getText();

		// Parse text to find comment with query
		const queryRegex = /\/\/\s*query:\s*(.*)/g;

		let queryMatch = queryRegex.exec(text);
		
		console.log(text,queryMatch);
		
		if (!queryMatch) {
			vscode.window.showErrorMessage('No query found in comments.');
			return;
		}

		const prompt = queryMatch[1];

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
