import * as vscode from 'vscode'
import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path'

var dayjs = require("dayjs")

class ActiveHandle {

    doWithFile(file: vscode.TextDocument) {
        if (file.languageId === 'markdown') {
            vscode.workspace.openTextDocument(file.uri.path).then((doc) => {
                vscode.window.showTextDocument(doc).then(() => {
                    const activeEditor: vscode.TextEditor | undefined = vscode.window.activeTextEditor
                    console.log(activeEditor?.document.lineAt(0).text);
                    console.log('===================');
                    console.log(`文件全路径\t ${file.uri.fsPath}`);
                    console.log(`文件名称\t ${file.fileName}`);

                    let fullPath = file.uri.path.replace('/Users/etcxy/Documents/MarkDown/', '')
                    let baseName = path.basename(fullPath, '.md');

                    console.log(`全路径为: ${fullPath}`);
                    console.log(`文件名为: ${baseName}`);


                    let birthtime = fs.statSync(file.uri.fsPath).birthtime

                    console.log(`文件创建时间\t ${dayjs(birthtime).format('YYYY-MM-DD HH:mm:ss')}`);
                    console.log('===================');

                    if (file.lineAt(0).text !== '---') {
                        console.log(file.lineAt(0).text);

                        let arr = fullPath.replace(`/${baseName}.md`, '').split('/')

                        const cate_arr = [];
                        // const tags_arr = [];


                        cate_arr.push(arr.shift())
                        // tags_arr.push(arr)

                        let birthtimeStr = dayjs(birthtime).format('YYYY-MM-DD HH:mm:ss')

                        let data = {
                            title: baseName,
                            date: birthtimeStr,
                            categories: cate_arr,
                            tags: arr
                        };


                        let yamlStr = `---\n${yaml.dump(data)}---\n\n`.replace(/\'/g, '').replace('[]', '');

                        console.log(yamlStr)

                        activeEditor?.edit((editBuilder) => {
                            editBuilder.insert(new vscode.Position(0, 0), yamlStr) // 插入
                            setTimeout(() => {
                                try {
                                    activeEditor.document.save()
                                } catch (err) {
                                    // handleError.showErrorMessage('fileHeader: headerAnnotation save', err)
                                }
                            }, 200)
                        })
                    }
                })
            })
        }
    }

    // 自动添加头文件
    watch() {
        vscode.workspace.onDidOpenTextDocument((file: vscode.TextDocument) => {
            this.doWithFile(file)
        })

        vscode.workspace.onDidCreateFiles((file: vscode.FileCreateEvent) => {

            const filePath = file.files[0].fsPath
            const openPath = vscode.Uri.file(filePath)


            vscode.workspace.openTextDocument(openPath).then((doc) => {
                vscode.window.showTextDocument(doc).then(() => {
                    try {
                        const activeEditor = vscode.window.activeTextEditor; // 每次运行选中文件
                        const fsPath = doc.uri.fsPath


                        console.log(`fsPath:${fsPath}`)

                        // activeEditor?.edit((editBuilder) => {
                        //     editBuilder.insert(new vscode.Position(1, 1), 'hellowoefasdfa')
                        // })
                        //const fsPath = activeEditor.document.uri.fsPath
                        // createAnnotation.headerAnnotation(editor, {
                        //     create: true
                        // })
                    } catch (err) {
                        //handleError.showErrorMessage('fileHeader: 自动添加注释', err)
                    }
                })
            })
        })
    }
}
module.exports = ActiveHandle