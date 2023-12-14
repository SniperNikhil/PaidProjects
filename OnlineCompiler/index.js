// index.js
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { spawn } = require('child_process');
const { exec } = require('child_process');

const path = require("path")
const fs = require("fs")
const prettier = require('prettier');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.use(express.static('public'));

app.set("view engine", "hbs")
app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/views/index.html');
    res.render("index")
});

io.on('connection', (socket) => {
    socket.on('execute', (language, code, argument) => {
        (language == 'python') ? val = '-c' : false;
        (language == 'node') ? val = '-e' : false;
        (language == 'java') ? val = '-cp' : false;
        if (language != 'java') {
            if (    code.includes('http.createServer') ||
                    code.includes('express()') ||
                    code.includes('fs.readFile') ||
                    code.includes('fs.readFileSync') ||
                    code.includes('fs.writeFile') ||
                    code.includes('fs.writeFileSync') ||
                    code.includes('require("fs")')
                ) {
                const childProcess = spawn(language, [val, code, ...argument]);
                socket.emit('executionResult', 'Server or file based  code detected. Not executing.');
                childProcess.kill();
            } else {
                const childProcess = spawn(language, [val, code, ...argument]);

                childProcess.stdin.write(argument.join('\n'));
                childProcess.stdin.end();

                childProcess.stdout.on('data', (data) => {
                    socket.emit('executionResult', data.toString());
                });

                childProcess.stderr.on('data', (data) => {
                    socket.emit('executionResult', data.toString());
                });

                childProcess.on('close', (code) => {
                    socket.emit('executionResult', `Child process exited with code ${code}`);
                });
            }
        } else {
            const uniqueFileName = `Main.java`;
            const javaFilePath = path.join(__dirname, 'temp', uniqueFileName);
            fs.writeFileSync(javaFilePath, code);

            const compileProcess = spawn('javac', [javaFilePath]);

            compileProcess.stderr.on('data', (data) => {
                const error = data.toString();
                socket.emit('executionResult', error);
            });

            compileProcess.on('close', (compileCode) => {
                if (compileCode !== 0) {
                    socket.emit('executionResult', `Compilation failed with code ${compileCode}`);
                    return;
                }

                const className = path.basename(javaFilePath, '.java');
                const runProcess = spawn('java', [className, ...argument], { cwd: path.join(__dirname, 'temp') });

                runProcess.stdin.write(argument.join('\n'));
                runProcess.stdin.end();

                let stderrOutput = '';

                runProcess.stdout.on('data', (data) => {
                    const output = data.toString();
                    socket.emit('executionResult', output);
                });

                runProcess.stderr.on('data', (data) => {
                    const error = data.toString();
                    stderrOutput += error;
                    socket.emit('executionResult', error);
                });

                runProcess.on('close', (runCode) => {
                    if (runCode !== 0) {
                        const runtimeError = `Child process exited with code ${runCode}`;
                        socket.emit('executionResult', runtimeError);
                    } else {
                        socket.emit('executionResult', `Child process exited with code ${runCode}`);
                    }
                });
            });

        }
    });

    socket.on("InstallPackage", (package, language) => {
        if (language == "javascript") {
            const npmInstallCommand = `npm install ${package}`;

            const installProcess = exec(npmInstallCommand, (error, stdout, stderr) => {
                if (error) {
                    socket.emit("InstallDetail", `Error installing package: ${package}`)
                } else {
                    socket.emit("InstallDetail", `Package installed successfully: ${package}`)
                }
                // Listen for process exit event
                installProcess.on('exit', (code) => {
                    console.log(`Child process exited with code ${code}`);
                });
            });
        } else if (language == "python") {
            const pipInstallCommand = `pip install ${package}`;

            const installProcess = exec(pipInstallCommand, (error, stdout, stderr) => {
                if (error) {
                    socket.emit("InstallDetail", `Error installing package: ${package}`)
                } else {
                    socket.emit("InstallDetail", `Package installed successfully: ${package}`)
                }

                // Listen for process exit event
                installProcess.on('exit', (code) => {
                    console.log(`Child process exited with code ${code}`);
                });
            });
        } else if (language == "java") {
            socket.emit("InstallDetail", `External Java Packages are not supported in this compiler`)
        }
    })

    socket.on("PythonSuggesstions", () => {
        const suggestions = [
            { label: 'for', kind: 12, insertText: 'for' },
            { label: 'if', kind: 12, insertText: 'if' },
            { label: 'else', kind: 12, insertText: 'else' },
            { label: 'elif', kind: 12, insertText: 'elif' },
            { label: 'while', kind: 12, insertText: 'while' },
            { label: 'def', kind: 12, insertText: 'def' },
            { label: 'class', kind: 12, insertText: 'class' },
            { label: 'return', kind: 12, insertText: 'return' },
            { label: 'print', kind: 12, insertText: 'print' },
            { label: 'import', kind: 12, insertText: 'import' },
            { label: 'from', kind: 12, insertText: 'from' },
            { label: 'try', kind: 12, insertText: 'try' },
            { label: 'except', kind: 12, insertText: 'except' },
            { label: 'finally', kind: 12, insertText: 'finally' },
            { label: 'raise', kind: 12, insertText: 'raise' },
            { label: 'pass', kind: 12, insertText: 'pass' },
            { label: 'continue', kind: 12, insertText: 'continue' },
            { label: 'break', kind: 12, insertText: 'break' },
            { label: 'True', kind: 12, insertText: 'True' },
            { label: 'False', kind: 12, insertText: 'False' },
            { label: 'None', kind: 12, insertText: 'None' },
            { label: 'and', kind: 12, insertText: 'and' },
            { label: 'or', kind: 12, insertText: 'or' },
            { label: 'not', kind: 12, insertText: 'not' },
            { label: 'in', kind: 12, insertText: 'in' },
            { label: 'is', kind: 12, insertText: 'is' },
            { label: 'if __name__ == "__main__":', kind: 12, insertText: 'if __name__ == "__main__":\n\tmain()' },
            { label: 'assert', kind: 12, insertText: 'assert' },
            { label: 'with', kind: 12, insertText: 'with' },
            { label: 'as', kind: 12, insertText: 'as' },
            { label: 'lambda', kind: 12, insertText: 'lambda' },
            { label: 'global', kind: 12, insertText: 'global' },
            { label: 'nonlocal', kind: 12, insertText: 'nonlocal' },
            { label: 'del', kind: 12, insertText: 'del' },
            { label: 'yield', kind: 12, insertText: 'yield' },
            { label: '__init__', kind: 12, insertText: '__init__' },
            { label: '__main__', kind: 12, insertText: '__main__' },
            { label: '__name__', kind: 12, insertText: '__name__' },
            { label: '__doc__', kind: 12, insertText: '__doc__' },
            { label: '__class__', kind: 12, insertText: '__class__' },
            { label: 'enumerate', kind: 12, insertText: 'enumerate' },
            { label: 'zip', kind: 12, insertText: 'zip' },
            { label: 'range', kind: 12, insertText: 'range' },
            { label: 'sorted', kind: 12, insertText: 'sorted' },
            { label: 'min', kind: 12, insertText: 'min' },
            { label: 'max', kind: 12, insertText: 'max' },
            { label: 'sum', kind: 12, insertText: 'sum' },
            { label: 'open', kind: 12, insertText: 'open' },
            { label: 'read', kind: 12, insertText: 'read' },
            { label: 'write', kind: 12, insertText: 'write' },
            { label: 'close', kind: 12, insertText: 'close' },
            // Add more suggestions as needed
        ];
        var lang = 'python';
        var data = { suggestions, lang }
        socket.emit("suggestions", data);
    })
    socket.on("JavaSuggesstions", () => {
        const suggestions = [
            { label: 'public', kind: 12, insertText: 'public' },
            { label: 'private', kind: 12, insertText: 'private' },
            { label: 'protected', kind: 12, insertText: 'protected' },
            { label: 'static', kind: 12, insertText: 'static' },
            { label: 'void', kind: 12, insertText: 'void' },
            { label: 'int', kind: 12, insertText: 'int' },
            { label: 'double', kind: 12, insertText: 'double' },
            { label: 'float', kind: 12, insertText: 'float' },
            { label: 'String', kind: 12, insertText: 'String' },
            { label: 'boolean', kind: 12, insertText: 'boolean' },
            { label: 'char', kind: 12, insertText: 'char' },
            { label: 'class', kind: 12, insertText: 'class' },
            { label: 'interface', kind: 12, insertText: 'interface' },
            { label: 'extends', kind: 12, insertText: 'extends' },
            { label: 'implements', kind: 12, insertText: 'implements' },
            { label: 'this', kind: 12, insertText: 'this' },
            { label: 'super', kind: 12, insertText: 'super' },
            { label: 'new', kind: 12, insertText: 'new' },
            { label: 'if', kind: 12, insertText: 'if' },
            { label: 'else', kind: 12, insertText: 'else' },
            { label: 'for', kind: 12, insertText: 'for' },
            { label: 'while', kind: 12, insertText: 'while' },
            { label: 'do', kind: 12, insertText: 'do' },
            { label: 'switch', kind: 12, insertText: 'switch' },
            { label: 'case', kind: 12, insertText: 'case' },
            { label: 'break', kind: 12, insertText: 'break' },
            { label: 'continue', kind: 12, insertText: 'continue' },
            { label: 'return', kind: 12, insertText: 'return' },
            { label: 'try', kind: 12, insertText: 'try' },
            { label: 'catch', kind: 12, insertText: 'catch' },
            { label: 'finally', kind: 12, insertText: 'finally' },
            { label: 'throw', kind: 12, insertText: 'throw' },
            { label: 'throws', kind: 12, insertText: 'throws' },
            { label: 'import', kind: 12, insertText: 'import' },
            { label: 'package', kind: 12, insertText: 'package' },
            { label: 'abstract', kind: 12, insertText: 'abstract' },
            { label: 'final', kind: 12, insertText: 'final' },
            { label: 'native', kind: 12, insertText: 'native' },
            { label: 'synchronized', kind: 12, insertText: 'synchronized' },
            { label: 'transient', kind: 12, insertText: 'transient' },
            { label: 'volatile', kind: 12, insertText: 'volatile' },
            { label: 'instanceof', kind: 12, insertText: 'instanceof' },
            { label: 'assert', kind: 12, insertText: 'assert' },
            { label: 'enum', kind: 12, insertText: 'enum' },
            { label: 'long', kind: 12, insertText: 'long' },
            { label: 'byte', kind: 12, insertText: 'byte' },
            { label: 'short', kind: 12, insertText: 'short' },
            { label: 'true', kind: 12, insertText: 'true' },
            { label: 'false', kind: 12, insertText: 'false' },
            { label: 'null', kind: 12, insertText: 'null' },
            { label: 'goto', kind: 12, insertText: 'goto' },
            { label: 'System.out.println()', kind: 12, insertText: 'System.out.println($1);', insertTextRules: 4, },
            // Add more suggestions as needed
        ];
        var lang = 'java';
        var data = { suggestions, lang }
        socket.emit("suggestions", data);
    })
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
