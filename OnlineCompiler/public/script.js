// script.js (frontend.js)
require.config({ paths: { 'vs': 'https://unpkg.com/monaco-editor@0.29.0/min/vs' } });

// Connect to the server
const socket = io();

require(['vs/editor/editor.main'], function () {
    var editor = monaco.editor.create(document.getElementById('editor'), {
        value: `//Please Note Server Based or file based code is not supported 
//Also Please Give a space after you give the arguments in input field     
console.log('Hello')
        `,
        language: 'javascript',
        theme: 'vs-dark',
        fontSize: 20,
    });

    function updateEditor(language, value) {
        editor.dispose();
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: value,
            language: language,
            theme: 'vs-dark',
            fontSize: 20,
        });
    }

    var language = document.getElementById('languageDropdown');
    language.addEventListener('change', () => {
        if (language.value === 'python') {
            socket.emit("PythonSuggesstions");
            updateEditor('python', `print('Hello World!')`);
        } else if (language.value === 'java') {
            socket.emit("JavaSuggesstions");
            updateEditor('java', `//Please Note Do not change class name Main
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
            `);
        } else {
            updateEditor('javascript', `//Please Note Server Based or file based code is not supported 
//Also Please Give a space after you give the arguments in input field       
console.log('Hello')
                    `);
        }
    });

    var runButton = document.getElementById('runButton');
    runButton.addEventListener('click', () => {
        const outputDiv = document.getElementById('output');
        outputDiv.innerHTML = "";
        if (editor) {
            var language1 = language.options[language.selectedIndex].value
            var code = editor.getValue();
            var argument = document.getElementById("argument1").value;
            var argumentsArray = argument.split(' ');
            const argumentArray1 = argumentsArray.map(arg => arg.split(','));

            if (language1 == 'javascript') {
                socket.emit('execute', 'node', code, argumentArray1)
            } else {
                socket.emit('execute', language1, code, argumentArray1)
            }
        } else {
            console.error('Editor is not yet initialized');
        }
    });

    let currentSuggestions = [];

    socket.on("suggestions", (data) => {
        currentSuggestions = data.suggestions;

        monaco.languages.registerCompletionItemProvider(data.lang, {
            provideCompletionItems: function (model, position) {
                const word = model.getWordUntilPosition(position).word;
                const filteredSuggestions = currentSuggestions.filter(suggestion => suggestion.label.startsWith(word));

                return {
                    suggestions: filteredSuggestions.map(suggestion => ({
                        ...suggestion,
                        range: new monaco.Range(position.lineNumber, position.column - word.length, position.lineNumber, position.column)
                    }))
                };
            }
        });
    });
});

socket.on("executionResult", (output) => {
    const outputDiv = document.getElementById('output');

    // Replace spaces with non-breaking spaces and use <br> for line breaks
    // const formattedOutput = output.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>');

    // Append the formatted output to the terminal
    outputDiv.innerHTML += `<span>${output}</span>`;

    // Scroll to the bottom to show the latest output
    outputDiv.scrollTop = outputDiv.scrollHeight;
})

function startLoading() {
    var loadingDiv = document.querySelector('.loading');
    loadingDiv.style.display = 'block';

    // Clear previous content
    loadingDiv.innerHTML = '';
    loadingDiv.innerHTML = '<div class="anim"></div>';

    var package = document.getElementById("packag").value;
    var language = document.getElementById('languageDropdown').value;

    socket.emit("InstallPackage", package, language);
}

socket.on("InstallDetail", (data) => {
    var loadingDiv = document.querySelector('.loading');

    loadingDiv.style.transform = 'translate(0, 0)';
    loadingDiv.innerHTML = `<h3>${data}</h3>`;
})