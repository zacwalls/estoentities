const socket = io();
const editor = document.getElementById('editor');
const gutters = document.getElementsByClassName('gutter');
const output = document.getElementById('output');


const updateRows = (textarea, gutters) => {
    const text = textarea.value;
    let lines = text.match(/\n/gi);

    lines = lines ? lines.length + 1 : 1;
    textarea.rows = lines;

    for (gutter of gutters) {
        gutter.innerHTML = "";

        for (let i = 0; i < textarea.rows; i++) {
            console.log(`Line number inserted for ${gutter}`);
            gutter.insertAdjacentHTML('beforeend', `<span>${i + 1}</span>`);
        }
    }
}

socket.on('connect', () => {
    editor.addEventListener('input', () => {
        updateRows(editor, gutters);

        socket.emit('update', {
            'text': editor.value
        });
    
        socket.on('updated', res => {
            output.value = res.output;
        });
    });
});

