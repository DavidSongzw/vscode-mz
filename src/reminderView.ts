'use strict';
import * as vscode from 'vscode';
import Asset from './asset';

export class ReminderView {
    private static panel: vscode.WebviewPanel | undefined;

    public static show(context: vscode.ExtensionContext, ) {
        let asset: Asset = Asset.getInstance(context);

        const assetData = asset.getData();

        if (this.panel) {
            this.panel.webview.html = this.generateHtml(assetData.uri, assetData.title);
            this.panel.reveal();
        } else {
            this.panel = vscode.window.createWebviewPanel("mz", "頑張がんばりましょうか", vscode.ViewColumn.Two, {
                enableScripts: true,
                retainContextWhenHidden: true,
            });
            this.panel.webview.html = this.generateHtml(assetData.uri, assetData.title);
            this.panel.onDidDispose(() => {
                this.panel = undefined;
            });
        }
    }

    protected static generateHtml(imagePath: vscode.Uri|string, title: string): string {
        let html = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>妹子</title>
        </head>
        <body>
            <div><h1>${title}</h1></div>
            <div><img src="${imagePath}"></div>
        </body>
        </html>`;

        return html;
    }
}