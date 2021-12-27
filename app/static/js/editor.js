const socket = io();
const editor = document.getElementById('editor');
const gutters = document.getElementsByClassName('gutter');
const output = document.getElementById('output');
const copyBtn = document.getElementById('copy');
const copyAlert = document.getElementById('copy-alert');

copyBtn.addEventListener('click', () => {
    copyAlert.style.opacity = '1';
    setTimeout(() => {
        copyAlert.style.opacity = '0';
    }, 1500);

    return navigator.clipboard.writeText(output.value);
});

const getCols = textarea => {
    const style = window.getComputedStyle(textarea, null);
    const fontSize = parseFloat(style.getPropertyValue('font-size')) + "px";
    const canvas = getCols.canvas || (getCols.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    let rawWidth = textarea.offsetWidth;
    
    context.font = fontSize + ' ' + textarea.style.fontFamily;

    rawWidth -= parseInt(style.getPropertyValue('border-left-width'));
    rawWidth -= parseInt(style.getPropertyValue('border-right-width'));
    rawWidth -= parseInt(style.getPropertyValue('padding-right'));
    rawWidth -= parseInt(style.getPropertyValue('padding-left'));

    const rawCols = rawWidth / context.measureText('a').width;

    // I found that the rawCols calculation was off by a factor of 1.72. I have no idea why 1.72 but it works....
    return Math.floor(rawCols / 1.72);
}

editor.cols = getCols(editor);

const updateRows = (textarea, gutters, e) => {
    let rows = (textarea.value.match(/\n/g) != null) ? textarea.value.match(/\n/g).length + 1 : 1;

    if (textarea.value.length > (textarea.cols * rows) - 20 && e.keyCode != 8) {
        textarea.value = (textarea.value + '\n');
    }

    textarea.rows = rows;

    for (gutter of gutters) {
        gutter.innerHTML = "";

        for (let i = 0; i < textarea.rows; i++) {
            gutter.insertAdjacentHTML('beforeend', `<span>${i + 1}</span>`);
        }
    }

    return true;
}

socket.on('connect', () => {
    editor.addEventListener('keyup', e => {
        updateRows(editor, gutters, e);

        socket.emit('update', {
            'text': editor.value
        });
    
        socket.on('updated', res => {
            output.value = res.output;
        });
    });
});

