export const drawPixelTextInCanvas = (pixelText, canvas, pixelSize, startX, startY, color = "black", size = 1) => {
    const ctx = canvas.getContext("2d");
    const textPixelSize = pixelSize * size;
    const halfWidthPixelTextSize = (pixelText[0].length * textPixelSize) / 2;
    const halfHeightPixelTextSize = (pixelText.length * textPixelSize) / 2;
    const textWidthStartPosition = (startX * pixelSize) - halfWidthPixelTextSize;
    const textHeightStartPosition = (startY * pixelSize) - halfHeightPixelTextSize;
    for (let y = 0; y < pixelText.length; y++) {
        for (let x = 0; x < pixelText[y].length; x++) {
            const drawPixel = pixelText[y][x];
            if (drawPixel) {
                ctx.beginPath();
                ctx.fillStyle = color;
                ctx.fillRect(
                    Math.round(textWidthStartPosition + (x * textPixelSize)),
                    Math.round(textHeightStartPosition + (y * textPixelSize)),
                    textPixelSize, textPixelSize);
            }
        }
    }
}

export const convertTextToPixelArt = (text) => {
    const textLetters = text.toString().split('');
    let pixelText = [];
    for (let pixelLetterHeight = 0; pixelLetterHeight < SPACE.length; pixelLetterHeight++) {
        let newPixelTextArray = [];
        for (let letterPos = 0; letterPos < textLetters.length; letterPos++) {
            if (letterPos > 0) {
                // space between letters
                newPixelTextArray.push([false]);
            }
            const currentPixelLetter = retrievePixelLetter(textLetters[letterPos]);
            newPixelTextArray.push(currentPixelLetter[pixelLetterHeight]);
        }
        pixelText.push(newPixelTextArray.flat());
    }
    return pixelText;
}

const retrievePixelLetter = (letter) => {
    switch (letter.toUpperCase()) {
        case 'A':
            return A;
        case 'B':
            return B;
        case 'C':
            return C;
        case 'D':
            return D;
        case 'E':
            return E;
        case 'F':
            return F;
        case 'G':
            return G;
        case 'H':
            return H;
        case 'I':
            return I;
        case 'J':
            return J;
        case 'K':
            return K;
        case 'L':
            return L;
        case 'M':
            return M;
        case 'N':
            return N;
        case 'O':
            return O;
        case 'P':
            return P;
        case 'Q':
            return Q;
        case 'R':
            return R;
        case 'S':
            return S;
        case 'T':
            return T;
        case 'U':
            return U;
        case 'V':
            return V;
        case 'W':
            return W;
        case 'X':
            return X;
        case 'Y':
            return Y;
        case 'Z':
            return Z;

        case '?':
            return INTERROGATION_MARK;
        case '!':
            return EXCLAMATION_MARK;
        case '+':
            return PLUS_MARK;
        case '/':
            return SLASH_MARK;

        case '0':
            return ZERO;
        case '1':
            return ONE;
        case '2':
            return TWO;
        case '3':
            return THREE;
        case '4':
            return FOUR;
        case '5':
            return FIVE;
        case '6':
            return SIX;
        case '7':
            return SEVEN;
        case '8':
            return EIGHT;
        case '9':
            return NINE;

        default:
            return SPACE;
    }
};

const SPACE = [
    [false],
    [false],
    [false],
    [false],
    [false]
];

const A = [
    [true, true, true],
    [true, false, true],
    [true, true, true],
    [true, false, true],
    [true, false, true]
];

const B = [
    [true, true, false],
    [true, false, true],
    [true, true, true],
    [true, false, true],
    [true, true, true]
];

const C = [
    [true, true, true],
    [true, false, false],
    [true, false, false],
    [true, false, false],
    [true, true, true]
];

const D = [
    [true, true, false],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const E = [
    [true, true, true],
    [true, false, false],
    [true, true, true],
    [true, false, false],
    [true, true, true]
];

const F = [
    [true, true, true],
    [true, false, false],
    [true, true, true],
    [true, false, false],
    [true, false, false]
];

const G = [
    [true, true, true],
    [true, false, false],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const H = [
    [true, false, true],
    [true, false, true],
    [true, true, true],
    [true, false, true],
    [true, false, true]
];

const I = [
    [true],
    [true],
    [true],
    [true],
    [true]
];

const J = [
    [true, true, true],
    [false, false, true],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const K = [
    [true, false, true],
    [true, false, true],
    [true, true, false],
    [true, false, true],
    [true, false, true]
];

const L = [
    [true, false, false],
    [true, false, false],
    [true, false, false],
    [true, false, false],
    [true, true, true]
];

const M = [
    [true, true, true, true, true],
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, false, true, false, true]
];

const N = [
    [true, true, true],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, false, true]
];

const O = [
    [true, true, true],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const P = [
    [true, true, true],
    [true, false, true],
    [true, true, true],
    [true, false, false],
    [true, false, false]
];

const Q = [
    [true, true, true],
    [true, false, true],
    [true, false, true],
    [true, true, true],
    [false, false, true]
];

const R = [
    [true, true, true],
    [true, false, true],
    [true, true, false],
    [true, false, true],
    [true, false, true]
];

const S = [
    [true, true, true],
    [true, false, false],
    [true, true, true],
    [false, false, true],
    [true, true, true]
];

const T = [
    [true, true, true],
    [false, true, false],
    [false, true, false],
    [false, true, false],
    [false, true, false]
];

const U = [
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const V = [
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [false, true, false]
];

const W = [
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, false, true, false, true],
    [true, true, true, true, true]
];

const X = [
    [true, false, true],
    [true, true, true],
    [false, true, false],
    [true, true, true],
    [true, false, true]
];

const Y = [
    [true, false, true],
    [true, false, true],
    [true, true, true],
    [false, true, false],
    [false, true, false]
];

const Z = [
    [true, true, true],
    [false, false, true],
    [false, true, false],
    [true, false, false],
    [true, true, true]
];

const INTERROGATION_MARK = [
    [true, true, true],
    [false, true, true],
    [false, true, true],
    [false, false, false],
    [false, true, false]
];

const EXCLAMATION_MARK = [
    [true, true],
    [true, true],
    [true, false],
    [false, false],
    [true, false]
];

const PLUS_MARK = [
    [false, false, false],
    [false, true, false],
    [true, true, true],
    [false, true, false],
    [false, false, false]
];

const SLASH_MARK = [
    [false, true],
    [false, true],
    [true, true],
    [true, false],
    [true, false]
];

const ZERO = [
    [true, true, true],
    [true, false, true],
    [true, false, true],
    [true, false, true],
    [true, true, true]
];

const ONE = [
    [false, true, false],
    [true, true, false],
    [false, true, false],
    [false, true, false],
    [true, true, true]
];

const TWO = [
    [true, true, true],
    [false, false, true],
    [true, true, true],
    [true, false, false],
    [true, true, true]
];

const THREE = [
    [true, true, true],
    [false, false, true],
    [true, true, true],
    [false, false, true],
    [true, true, true]
];

const FOUR = [
    [false, true, true],
    [true, false, true],
    [true, false, true],
    [true, true, true],
    [false, false, true]
];

const FIVE = [
    [true, true, true],
    [true, false, false],
    [true, true, true],
    [false, false, true],
    [true, true, true]
];

const SIX = [
    [true, true, true],
    [true, false, false],
    [true, true, true],
    [true, false, true],
    [true, true, true]
];

const SEVEN = [
    [true, true, true],
    [false, false, true],
    [false, false, true],
    [false, true, false],
    [false, true, false]
];

const EIGHT = [
    [true, true, true],
    [true, false, true],
    [true, true, true],
    [true, false, true],
    [true, true, true]
];

const NINE = [
    [true, true, true],
    [true, false, true],
    [true, true, true],
    [false, false, true],
    [true, true, true]
];