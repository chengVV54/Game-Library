let globalAudioCtx = null;
function getAudioCtx(){
    if(!globalAudioCtx){
        globalAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return globalAudioCtx;
}
function playDogSound(){
    const audio = new Audio('/mp3/dog1.mp3');
    audio.volume = 0.6;
    audio.play();
}
function playCatHissSound(){
    const audioCtx = getAudioCtx();
    const bufferSize = audioCtx.sampleRate * 0.4;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i = 0; i < bufferSize; i++){
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / bufferSize * 2) * 0.5;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.value = 0.4;
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
}
function playDogEvolveSound(){
    const audio = new Audio('/mp3/dogangry.mp3');
    audio.volume = 0.8;
    audio.play();
}
function playBellSound(){
    const audioCtx = getAudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.3);
}
function playBubbleSound(){
    const audioCtx = getAudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
    osc.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
}
function playFeiduduSound(){
    const audio = new Audio('/mp3/feidudu.mp3');
    audio.volume = 0.7;
    audio.play();
}
let nailongAttackIndex = 0;
const nailongAttackSounds = [
    new Audio('/mp3/nailong1.mp3'),
    new Audio('/mp3/nailong2.mp3'),
    new Audio('/mp3/nailong3.mp3')
];

function playNailongAttackSound(){
    nailongAttackSounds[nailongAttackIndex].volume = 0.6;
    nailongAttackSounds[nailongAttackIndex].currentTime = 0;
    nailongAttackSounds[nailongAttackIndex].play();
    nailongAttackIndex = (nailongAttackIndex + 1) % 3;
}

function playNailongEvolveSound(){
    const audio = new Audio('/mp3/nailongjinhua.mp3');
    audio.volume = 0.8;
    audio.play();
}

function playNailongLaughSound(){
    const audio = new Audio('/mp3/nailonglaugh.mp3');
    audio.volume = 0.7;
    audio.play();
}