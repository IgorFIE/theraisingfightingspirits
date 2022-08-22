class Sound {
    constructor() {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.context = new AudioContext();

        this.loopTime = 0.01;
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
            this.playSound("square", 174.6, 0.5, 0, 2); // Bb5
        }
    }

    takeDamageSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 32.70, 1, 0, 1); // C1
            this.playSound("square", 36.71, 0.8, 0.1, 2); // D1
            this.playSound("square", 16.35, 1, 0.2, 3); // C0
        }
    }

    gainShield() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 233.1, 0.2, 0, 1); // Bb3
            this.playSound("square", 466.2, 0.4, 0.1, 2); // Bb4
        }
    }

    spawnSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 293.7, 0.4, 0, 3); // D4
        }
    }

    deadSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 18.35, 0.3, 0, 1); // D0
            this.playSound("square", 36.71, 0.5, 0.1, 2); // D1
            this.playSound("square", 73.42, 0.8, 0.2, 3); // D2
        }
    }

    buffSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 932.3, 0.3, 0, 1); // Bb5
            this.playSound("square", 1865, 0.5, 0.1, 2); // Bb6
        }
    }

    playMusic() {
        if (this.isSoundOn && this.isSoundInitialized) {
            if (this.currentTime >= (this.loopMaxTime / this.notesPeerLoop)) {

                this.playSound("triangle", musicbass[this.musicBassNote], 1, 0, 2);
                this.musicBassNote++;
                if (this.musicBassNote >= musicbass.length) {
                    this.musicBassNote = 0;
                }
                this.playSound("square", musicMelody[this.musicMelodyNote], 0.2, 0, 2);
                this.musicMelodyNote++;
                if (this.musicMelodyNote >= musicMelody.length) {
                    this.musicMelodyNote = 0;
                }

                this.currentTime = 0;
            } else {
                this.currentTime = this.currentTime + this.loopTime;
            }
        }
    }

    playGameOverSound() {
        if (this.isSoundOn && this.isSoundInitialized) {
            this.playSound("square", 32.70, 0.5, 0, 0.1); // C1
            this.playSound("square", 36.71, 0.3, 0.1, 0.2); // D1
            this.playSound("square", 16.35, 0.5, 0.2, 1); // C0
        }
    }

    playSound(type, value, volume, start, end) {
        const o = this.context.createOscillator();
        const g = this.context.createGain();
        o.type = type;
        o.frequency.value = value;
        g.gain.value = volume;
        g.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + end);
        o.connect(g);
        g.connect(this.context.destination);
        o.start(start);
        o.stop(this.context.currentTime + end);
    }
}

const bassB = 61.74;
const bassFs = 92.50;
const bassD = 73.42;
const bassA = 110.0;

const musicbass = [
    bassB, null, bassFs, null, bassB, null, bassFs, null, bassB, null, bassFs, null, bassB, null, bassFs, null,
    bassD, null, bassA, null, bassD, null, bassA, null, bassD, null, bassA, null, bassD, null, bassA, null
];

const melodyB = 246.9;
const melodyBHigh = 493.9;
const melodyCs = 277.2;
const melodyD = 293.7;
const melodyE = 329.6;
const melodyFs = 370.0;
const melodyF = 349.2;
const melodyA = 440.0;
const melodyC = 261.6;

const highG = 784.0;
const highA = 880.0;
const highB = 987.8;
const highC = 1047;
const highD = 1175;
const highDs = 1245;
const highE = 1319;

const musicMelody = [
    melodyB, melodyCs, melodyD, melodyE, melodyFs, melodyD, melodyFs, null,
    melodyF, melodyCs, melodyF, null, melodyE, melodyC, melodyE, null,
    melodyB, melodyCs, melodyD, melodyE, melodyFs, melodyD, melodyFs, melodyBHigh,
    melodyA, melodyFs, melodyD, melodyFs, melodyA, null, null, null,
    melodyB, melodyCs, melodyD, melodyE, melodyFs, melodyD, melodyFs, null,
    melodyF, melodyCs, melodyF, null, melodyE, melodyC, melodyE, null,
    melodyB, melodyCs, melodyD, melodyE, melodyFs, melodyD, melodyFs, melodyBHigh,
    melodyA, melodyFs, melodyD, melodyFs, melodyA, null, null, null,
    highG, highA, highB, highC, highD, highB, highD, null,
    highDs, highB, highDs, null, highD, highB, highD, null,
    highG, highA, highB, highC, highD, highB, highD, null,
    highE, highB, highE, null, highD, null, null, null,
    highG, highA, highB, highC, highD, highB, highD, null,
    highDs, highB, highDs, null, highD, highB, highD, null,
    highG, highA, highB, highC, highD, highB, highD, null,
    highE, highB, highE, null, highD, null, null, null,
];

export const SoundInstance = new Sound();