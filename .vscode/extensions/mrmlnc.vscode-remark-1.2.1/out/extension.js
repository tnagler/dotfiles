'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const remark = require("remark");
const npm_module_path_1 = require("npm-module-path");
const fs_1 = require("./utils/fs");
let output;
/**
 * Show message in output channel.
 */
function showOutput(msg) {
    msg = msg.toString();
    if (!output) {
        output = vscode.window.createOutputChannel('Remark');
    }
    output.clear();
    output.appendLine('[Remark]');
    output.append(msg);
    output.show();
}
function getWorkspaceConfig() {
    return vscode.workspace.findFiles('**/*remarkrc*', '**/node_modules/**').then((files) => {
        if (files.length === 0) {
            return null;
        }
        if (files[0].fsPath.endsWith('.js')) {
            try {
                return require(files[0].fsPath);
            }
            catch (err) {
                return 'SyntaxError';
            }
        }
        return fs_1.fileRead(files[0].fsPath).then((content) => {
            try {
                return JSON.parse(content);
            }
            catch (err) {
                return 'SyntaxError';
            }
        });
    });
}
function getPlugins(list) {
    const root = vscode.workspace.rootPath || '';
    const pluginList = list.map((name) => {
        if (typeof name === 'string') {
            return 'remark-' + name;
        }
        return 'remark-' + name[0];
    });
    return npm_module_path_1.resolveMany(pluginList, root).then((filepaths) => {
        return filepaths.map((filepath, index) => ({
            name: list[index],
            package: filepath !== undefined ? require(filepath) : undefined,
            settings: typeof list[index] !== 'string' ? list[index][1] : undefined
        }));
    });
}
function getRemarkSettings() {
    return __awaiter(this, void 0, void 0, function* () {
        let config;
        let remarkSettings;
        if (vscode.workspace.rootPath) {
            config = yield getWorkspaceConfig();
        }
        if (config && Object.keys(config).length !== 0) {
            remarkSettings = config;
            remarkSettings.rules = config.settings;
            remarkSettings.plugins = config.plugins || [];
            return remarkSettings;
        }
        remarkSettings = vscode.workspace.getConfiguration('remark').get('format');
        remarkSettings = Object.assign({
            plugins: [],
            rules: {}
        }, remarkSettings);
        return remarkSettings;
    });
}
function runRemark(document, range) {
    return __awaiter(this, void 0, void 0, function* () {
        let api = remark();
        const errors = [];
        const remarkSettings = yield getRemarkSettings();
        let plugins = [];
        if (remarkSettings.plugins.length !== 0) {
            plugins = yield getPlugins(remarkSettings.plugins);
        }
        api = api.use({ settings: remarkSettings.rules });
        if (plugins.length !== 0) {
            plugins.forEach((plugin) => {
                if (plugin.package === undefined) {
                    errors.push({
                        name: plugin.name,
                        err: 'Package not found'
                    });
                    return;
                }
                try {
                    const settings = plugin.settings !== undefined
                        ? plugin.settings : remarkSettings[plugin.name];
                    if (settings !== undefined) {
                        api = api.use(plugin.package, settings);
                    }
                    else {
                        api = api.use(plugin.package);
                    }
                }
                catch (err) {
                    errors.push({
                        name: plugin.name,
                        err
                    });
                }
            });
        }
        if (errors.length !== 0) {
            let message = '';
            errors.forEach((error) => {
                if (error.err === 'Package not found') {
                    message += `[${error.name}]: ${error.err.toString()}. Use **npm i remark-${error.name}** or **npm i -g remark-${error.name}**.\n`;
                    return;
                }
                message += `[${error.name}]: ${error.err.toString()}\n`;
            });
            return Promise.reject(message);
        }
        let text;
        if (!range) {
            const lastLine = document.lineAt(document.lineCount - 1);
            const start = new vscode.Position(0, 0);
            const end = new vscode.Position(document.lineCount - 1, lastLine.text.length);
            range = new vscode.Range(start, end);
            text = document.getText();
        }
        else {
            text = document.getText(range);
        }
        return api.process(text).then((result) => {
            if (result.messages.length !== 0) {
                let message = '';
                result.messages.forEach((msg) => {
                    message += msg.toString() + '\n';
                });
                return Promise.reject(message);
            }
            return Promise.resolve({
                content: result.contents,
                range
            });
        });
    });
}
function activate(context) {
    const supportedDocuments = [
        { language: 'markdown', scheme: 'file' }
    ];
    const command = vscode.commands.registerTextEditorCommand('remark.reformat', (textEditor) => {
        runRemark(textEditor.document, null)
            .then((result) => {
            textEditor.edit((editBuilder) => {
                editBuilder.replace(result.range, result.content);
            });
        })
            .catch(showOutput);
    });
    const formatCode = vscode.languages.registerDocumentRangeFormattingEditProvider(supportedDocuments, {
        provideDocumentRangeFormattingEdits(document, range) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const action = yield runRemark(document, range).then((result) => {
                        return [vscode.TextEdit.replace(range, result.content)];
                    });
                    return action;
                }
                catch (error) {
                    showOutput(error);
                }
            });
        }
    });
    // Subscriptions
    context.subscriptions.push(command);
    context.subscriptions.push(formatCode);
}
exports.activate = activate;
