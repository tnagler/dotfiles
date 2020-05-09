"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs-extra");
class DocumentClass {
    constructor(extension) {
        this.suggestions = [];
        this.extension = extension;
    }
    initialize(classes) {
        Object.keys(classes).forEach(key => {
            const item = classes[key];
            const cl = new vscode.CompletionItem(item.command, vscode.CompletionItemKind.Module);
            cl.detail = item.detail;
            cl.documentation = new vscode.MarkdownString(`[${item.documentation}](${item.documentation})`);
            this.suggestions.push(cl);
        });
    }
    provide() {
        if (this.suggestions.length === 0) {
            const allClasses = JSON.parse(fs.readFileSync(`${this.extension.extensionRoot}/data/classnames.json`).toString());
            this.initialize(allClasses);
        }
        return this.suggestions;
    }
}
exports.DocumentClass = DocumentClass;
//# sourceMappingURL=documentclass.js.map