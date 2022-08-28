export const drawPixelTextInCanvas = (pixelText, canvas, pixelSize, startX, startY, color = "black", size = 1) => {
    const ctx = canvas.getContext("2d");
    const textPixelSize = pixelSize * size;
    const halfWidthPixelTextSize = (pixelText[0].length * textPixelSize) / 2;
    const halfHeightPixelTextSize = (pixelText.length * textPixelSize) / 2;
    const textWidthStartPosition = (startX * pixelSize) - halfWidthPixelTextSize;
    const textHeightStartPosition = (startY * pixelSize) - halfHeightPixelTextSize;
    pixelText.forEach((row, y) => row.forEach((val, x) => {
        if (val) {
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.fillRect(
                Math.round(textWidthStartPosition + (x * textPixelSize)),
                Math.round(textHeightStartPosition + (y * textPixelSize)),
                textPixelSize, textPixelSize);
        }
    }));
}

export const convertTextToPixelArt = (text) => {
    const textLetters = text.toString().split('');
    let pixelText = [];
    space.forEach((val, pixelLetterHeight) => {
        let newPixelTextArray = [];
        textLetters.forEach((val, letterPos) => {
            if (letterPos > 0) {
                newPixelTextArray.push([false]);
            }
            const currentPixelLetter = retrievePixelLetter(textLetters[letterPos]);
            newPixelTextArray.push(currentPixelLetter[pixelLetterHeight]);
        });
        pixelText.push(newPixelTextArray.flat());
    });
    return pixelText;
}

const retrievePixelLetter = (letter) => {
    switch (letter.toLowerCase()) {
        case 'a':
            return a;
        case 'b':
            return b;
        case 'c':
            return c;
        case 'd':
            return d;
        case 'e':
            return e;
        case 'f':
            return f;
        case 'g':
            return g;
        case 'h':
            return h;
        case 'i':
            return i;
        case 'j':
            return j;
        case 'k':
            return k;
        case 'l':
            return l;
        case 'm':
            return m;
        case 'n':
            return n;
        case 'o':
            return o;
        case 'p':
            return p;
        case 'r':
            return r;
        case 's':
            return s;
        case 't':
            return t;
        case 'u':
            return u;
        case 'v':
            return v;
        case 'w':
            return w;
        case 'x':
            return x;
        case 'y':
            return y;
        case 'z':
            return z;

        case '!':
            return excl;
        case '+':
            return plus;
        case '/':
            return slash;
        case '(':
            return leftParen;
        case ')':
            return rightParen;

        case '0':
            return zer;
        case '1':
            return one;
        case '2':
            return two;
        case '3':
            return thr;
        case '4':
            return fou;
        case '5':
            return fiv;
        case '6':
            return six;
        case '7':
            return sev;
        case '8':
            return eig;
        case '9':
            return nin;

        default:
            return space;
    }
};

const space = [
    [false],
    [false],
    [false],
    [false],
    [false]
];

const a = [
    [true, true, true],
    [true, false, true],
    [true, true, true],
    [true, false, true],
    [true, false, true]
];

const b = [
    [true, true, false],
    [true, false, true],
    [true, true, true],
    [true, false, true],
    [true, true, true]
];

const c = [
    [true, true, true],
    [true, false, false],
    [true, false, false],
    [true, false, false],
    [true, true, true]
];

const d = [
    [true, true, false],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const e = [
    [true, true, true],
    [true, false, false],
    [true, true, true],
    [true, false, false],
    [true, true, true]
];

const f = [
    [true, true, true],
    [true, false, false],
    [true, true, true],
    [true, false, false],
    [true, false, false]
];

const g = [
    [true, true, true],
    [true, false, false],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const h = [
    [true, false, true],
    [true, false, true],
    [true, true, true],
    [true, false, true],
    [true, false, true]
];

const i = [
    [true],
    [true],
    [true],
    [true],
    [true]
];

const j = [
    [true, true, true],
    [false, false, true],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const k = [
    [true, false, true],
    [true, false, true],
    [true, true, false],
    [true, false, true],
    [true, false, true]
];

const l = [
    [true, false, false],
    [true, false, false],
    [true, false, false],
    [true, false, false],
    [true, true, true]
];

const m = [
    [true, true, true, true, true],
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, false, true, false, true]
];

const n = [
    [true, true, true],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, false, true]
];

const o = [
    [true, true, true],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const p = [
    [true, true, true],
    [true, false, true],
    [true, true, true],
    [true, false, false],
    [true, false, false]
];

const r = [
    [true, true, true],
    [true, false, true],
    [true, true, false],
    [true, false, true],
    [true, false, true]
];

const s = [
    [true, true, true],
    [true, false, false],
    [true, true, true],
    [false, false, true],
    [true, true, true]
];

const t = [
    [true, true, true],
    [false, true, false],
    [false, true, false],
    [false, true, false],
    [false, true, false]
];

const u = [
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const v = [
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [false, true, false]
];

const w = [
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, true, true, true, true]
];

const x = [
    [true, false, true],
    [true, true, true],
    [false, true, false],
    [true, true, true],
    [true, false, true]
];

const y = [
    [true, false, true],
    [true, false, true],
    [true, true, true],
    [false, true, false],
    [false, true, false]
];

const z = [
    [true, true, true],
    [false, false, true],
    [false, true, false],
    [true, false, false],
    [true, true, true]
];

const excl = [
    [true, true],
    [true, true],
    [true, false],
    [false, false],
    [true, false]
];

const plus = [
    [false, false, false],
    [false, true, false],
    [true, true, true],
    [false, true, false],
    [false, false, false]
];

const slash = [
    [false, true],
    [false, true],
    [true, true],
    [true, false],
    [true, false]
];

const leftParen = [
    [false, true],
    [true, false],
    [true, false],
    [true, false],
    [false, true]
];

const rightParen = [
    [true, false],
    [false, true],
    [false, true],
    [false, true],
    [true, false]
];

const zer = [
    [true, true, true],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const one = [
    [true],
    [true],
    [true],
    [true],
    [true]
];

const two = [
    [true, true, true],
    [false, false, true],
    [true, true, true],
    [true, false, false],
    [true, true, true]
];

const thr = [
    [true, true, true],
    [false, false, true],
    [true, true, true],
    [false, false, true],
    [true, true, true]
];

const fou = [
    [false, true, true],
    [true, false, true],
    [true, false, true],
    [true, true, true],
    [false, false, true]
];

const fiv = [
    [true, true, true],
    [true, false, false],
    [true, true, true],
    [false, false, true],
    [true, true, true]
];

const six = [
    [true, true, true],
    [true, false, false],
    [true, true, true],
    [true, false, true],
    [true, true, true]
];

const sev = [
    [true, true, true],
    [false, false, true],
    [false, true, true],
    [false, true, false],
    [false, true, false]
];

const eig = [
    [true, true, true],
    [true, false, true],
    [true, true, true],
    [true, false, true],
    [true, true, true]
];

const nin = [
    [true, true, true],
    [true, false, true],
    [true, true, true],
    [false, false, true],
    [true, true, true]
];