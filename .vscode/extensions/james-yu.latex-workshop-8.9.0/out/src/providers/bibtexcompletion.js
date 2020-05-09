"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const fs = require("fs-extra");
class BibtexCompleter {
    constructor(extension) {
        this.entries = [];
        this.extension = extension;
        try {
            this.loadDefaultItems();
        }
        catch (err) {
            this.extension.logger.addLogMessage(`Error reading data: ${err}.`);
        }
    }
    loadDefaultItems() {
        const defaultEntries = fs.readFileSync(`${this.extension.extensionRoot}/data/bibtex-entries.json`, { encoding: 'utf8' });
        const entriesReplacements = vscode.workspace.getConfiguration('latex-workshop').get('intellisense.bibtexJSON.replace');
        const config = vscode.workspace.getConfiguration('latex-workshop');
        const leftright = config.get('bibtex-format.surround') === 'Curly braces' ? ['{', '}'] : ['"', '"'];
        const tabs = { '2 spaces': '  ', '4 spaces': '    ', 'tab': '\t' };
        const bibtexFormat = {
            tab: tabs[config.get('bibtex-format.tab')],
            case: config.get('bibtex-format.case'),
            left: leftright[0],
            right: leftright[1],
            sort: config.get('bibtex-format.sortby')
        };
        const entries = JSON.parse(defaultEntries);
        const entriesList = [];
        Object.keys(entries).forEach(entry => {
            if (entry in entriesList) {
                return;
            }
            if (entry in entriesReplacements) {
                this.entries.push(this.entryToCompletion(entry, entriesReplacements[entry], bibtexFormat));
            }
            else {
                this.entries.push(this.entryToCompletion(entry, entries[entry], bibtexFormat));
            }
            entriesList.push(entry);
        });
    }
    entryToCompletion(itemName, itemFields, config) {
        const suggestion = new vscode.CompletionItem(itemName, vscode.CompletionItemKind.Snippet);
        suggestion.detail = itemName;
        suggestion.documentation = `Add a @${itemName} entry`;
        let count = 1;
        // The following code is copied from bibtexutils.ts:bibtexFormat
        // Find the longest field name in entry
        let maxFieldLength = 0;
        itemFields.forEach(field => {
            maxFieldLength = Math.max(maxFieldLength, field.length);
        });
        let s = itemName + '{${0:key}';
        itemFields.forEach(field => {
            s += ',\n' + config.tab + (config.case === 'lowercase' ? field : field.toUpperCase());
            s += ' '.repeat(maxFieldLength - field.length) + ' = ';
            s += config.left + `$${count}` + config.right;
            count++;
        });
        s += '\n}';
        suggestion.insertText = new vscode.SnippetString(s);
        return suggestion;
    }
    provideCompletionItems(document, position, _token, _context) {
        return new Promise((resolve, _reject) => {
            const currentLine = document.lineAt(position.line).text;
            if (currentLine.match(/@[a-zA-Z]*$/)) {
                resolve(this.entries);
                return;
            }
            resolve();
        });
    }
}
exports.BibtexCompleter = BibtexCompleter;
//# sourceMappingURL=bibtexcompletion.js.map