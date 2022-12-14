export class Sound {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();

        this.loopTime = 0.016;
        this.loopMaxTime = 4;
        this.notesPeerLoop = 32;
        this.currentTime = this.loopMaxTime / this.notesPeerLoop;

        this.musicBassNote = 0;
        this.musicMelodyNote = 0;

        this.isSoundOn = true;
        this.isSoundInitialized = false;
    }

    muteMusic() {
        this.isSoundOn = !this.isSoundOn;
    }

    initSound() {
        this.isSoundInitialized = true;
        this.context.resume();
    }

    clickSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound(square, 174.6, 0.14, 0, 0.2);
        }
    }

    takeDmgSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound(square, 32.70, 0.14, 0, 0.1);
            this.playSound(square, 36.71, 0.14, 0.1, 0.2);
            this.playSound(square, 16.35, 0.16, 0.2, 0.2);
        }
    }

    gainShield() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound(square, 233.1, 0.1, 0, 0.1);
            this.playSound(square, 466.2, 0.1, 0.1, 0.2);
        }
    }

    spawnSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound(square, 293.7, 0.1, 0, 0.2);
        }
    }

    deadSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound(square, 18.35, 0.1, 0, 0.1);
            this.playSound(square, 36.71, 0.1, 0.1, 0.2);
            this.playSound(square, 73.42, 0.1, 0.2, 0.2);
        }
    }

    buffSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound(square, 932.3, 0.1, 0, 0.1);
            this.playSound(square, 1865, 0.1, 0.1, 0.2);
        }
    }

    playMusic() {
        if (this.isSoundOn && this.isSoundInitialized) {
            if (this.currentTime >= (this.loopMaxTime / this.notesPeerLoop)) {

                this.playSound("triangle", mB[this.musicBassNote], 0.5, 0, 0.2);
                this.musicBassNote++;
                if (this.musicBassNote >= mB.length) {
                    this.musicBassNote = 0;
                }
                this.playSound(square, mM[this.musicMelodyNote], 0.08, 0, 0.2);
                this.musicMelodyNote++;
                if (this.musicMelodyNote >= mM.length) {
                    this.musicMelodyNote = 0;
                }

                this.currentTime = 0;
            } else {
                this.currentTime = this.currentTime + this.loopTime;
            }
        }
    }

    playOverSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound(square, 32.70, 0.3, 0, 0.1);
            this.playSound(square, 36.71, 0.2, 0.1, 0.2);
            this.playSound(square, 16.35, 0.3, 0.2, 0.1);
        }
    }

    playSound(type, value, volume, start, end) {
        const o = this.context.createOscillator();
        const g = this.context.createGain();
        o.type = type;
        o.frequency.value = value;

        g.gain.setValueAtTime(volume, this.context.currentTime);
        g.gain.linearRampToValueAtTime(0.00001, this.context.currentTime + end);

        o.connect(g);
        g.connect(this.context.destination);
        o.start(start);
        o.stop(this.context.currentTime + end);
    }
}

const square = "square";

const mB = [
    61.74, null, 92.50, null, 61.74, null, 92.50, null, 61.74, null, 92.50, null, 61.74, null, 92.50, null,
    73.42, null, 110.0, null, 73.42, null, 110.0, null, 73.42, null, 110.0, null, 73.42, null, 110.0, null
];

const mM = [
    246.9, 277.2, 293.7, 329.6, 370.0, 293.7, 370.0, null,
    349.2, 277.2, 349.2, null, 329.6, 261.6, 329.6, null,
    246.9, 277.2, 293.7, 329.6, 370.0, 293.7, 370.0, 493.9,
    440.0, 370.0, 293.7, 370.0, 440.0, null, null, null,
    246.9, 277.2, 293.7, 329.6, 370.0, 293.7, 370.0, null,
    349.2, 277.2, 349.2, null, 329.6, 261.6, 329.6, null,
    246.9, 277.2, 293.7, 329.6, 370.0, 293.7, 370.0, 493.9,
    440.0, 370.0, 293.7, 370.0, 440.0, null, null, null,
    784.0, 880.0, 987.8, 1047, 1175, 987.8, 1175, null,
    1245, 987.8, 1245, null, 1175, 987.8, 1175, null,
    784.0, 880.0, 987.8, 1047, 1175, 987.8, 1175, null,
    1319, 987.8, 1319, null, 1175, null, null, null,
    784.0, 880.0, 987.8, 1047, 1175, 987.8, 1175, null,
    1245, 987.8, 1245, null, 1175, 987.8, 1175, null,
    784.0, 880.0, 987.8, 1047, 1175, 987.8, 1175, null,
    1319, 987.8, 1319, null, 1175, null, null, null,
];