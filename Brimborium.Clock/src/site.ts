const oneMinuteMS = 60000;
const durationFadeInMS = 5000;
const durationFadeOutMS = 5000;
const msOfMinuteFadeOut = oneMinuteMS - durationFadeOutMS;


type SplitTimeResult={hour:number; minute:number; seconds:number; msOfMinute:number;};
function splitTime(addMS: number = 0) {
    const t = new Date();
    const timeLocalMS = (addMS + (t.getTime()) - (t.getTimezoneOffset() * 60 * 1000)) % (24 * 60 * 60 * 1000);
    const msOfMinute = (timeLocalMS % 60000);
    const timeLocal = (timeLocalMS / 1000) | 0;
    const seconds = (timeLocal % 60);
    const minute = ((timeLocal / 60) | 0) % 60;
    const hour = ((timeLocal / 3600) | 0);
    // console.log("hour", hour, "minute", minute, "seconds", seconds);
    return {hour, minute, seconds, msOfMinute};
}


enum ClockLoopMode { Auto, Wait, FadeIn, FadeOut }

class Clock {
    arrDigit = [10, 10, 10, 10];
    // arrVideo :HTMLVideoElement[] = [];

    constructor(
        public arrVideo: HTMLVideoElement[],
        public arrInfo: HTMLDivElement[]
    ) {
    }

    init() {
        
        // this.tickFadeIn({hour:1, minute:2, seconds:30, msOfMinute:30000});
        // this.tickFadeOut({hour:1, minute:3, seconds:0, msOfMinute:0});
        // this.tickFadeIn({hour:1, minute:3, seconds:0, msOfMinute:0});
        // this.tickFadeOut({hour:1, minute:4, seconds:0, msOfMinute:0});
        // this.tickFadeIn({hour:1, minute:4, seconds:0, msOfMinute:0});
        const splittedTime=splitTime();
        this.tickFadeIn(splittedTime);
        this.loopWait(splittedTime);
    }

    loopWait(splittedTime:SplitTimeResult, mode: ClockLoopMode = ClockLoopMode.Auto) {
        const {hour, minute, seconds, msOfMinute} = splittedTime;
        //55 .. 0    0..5
        //Fade out   Fade In
        const waitForFadeOut = (oneMinuteMS + msOfMinuteFadeOut - msOfMinute) % oneMinuteMS;
        const waitForFadeIn = (2*oneMinuteMS - msOfMinute) % oneMinuteMS;
        if (mode === ClockLoopMode.Auto) {
            if (waitForFadeOut < waitForFadeIn) {
                mode = ClockLoopMode.FadeOut;
            } else {
                mode = ClockLoopMode.FadeIn;
            }
        }
        if (mode === ClockLoopMode.FadeOut) {
            console.log("waitForFadeOut", waitForFadeOut, "waitForFadeIn", waitForFadeIn);
            window.setTimeout(() => {
                this.tickFadeOut(splitTime(durationFadeOutMS));
                this.loopWait(splitTime(0), ClockLoopMode.FadeIn);
            }, waitForFadeOut);
        }
        if (mode === ClockLoopMode.FadeIn) {
            console.log("waitForFadeIn", waitForFadeIn, "waitForFadeOut", waitForFadeOut);
            window.setTimeout(() => {
                this.tickFadeIn(splitTime(0));
                this.loopWait(splitTime(0), ClockLoopMode.FadeOut);
            }, waitForFadeIn);
        }
    }

    tickFadeIn(splittedTime:SplitTimeResult) {
        const {hour, minute, seconds, msOfMinute} = splittedTime;
        console.log("FadeIn ", splittedTime);

        const nextArrDigit = this.getArrDigit(hour, minute);

        for (let idx = 0; idx <= 3; idx++) {
            const nextDigit = nextArrDigit[idx];
            if (this.arrDigit[idx] === nextDigit) {
                //
            } else {
                this.arrDigit[idx] = nextDigit;
                const video = this.arrVideo[idx];
                const info = this.arrInfo[idx];
                const src = `d${nextDigit}i.mp4`; //"d0i.mp4";
                video.src = src;
                video.play();
                info.innerText = src;
                console.log("FadeIn change digit", idx, src);
            }
        }
    }

    tickFadeOut(splittedTime:SplitTimeResult) {
        const {hour, minute, seconds, msOfMinute} = splittedTime;
        console.log("FadeOut ", splittedTime);

        const nextArrDigit = this.getArrDigit(hour, minute);

        for (let idx = 0; idx <= 3; idx++) {
            const currentDigit = this.arrDigit[idx];
            const nextDigit = nextArrDigit[idx];
            if (currentDigit === nextDigit) {
                //
            } else {
                this.arrDigit[idx] = -currentDigit;
                const video = this.arrVideo[idx];
                const info = this.arrInfo[idx];
                const src = `d${currentDigit}o.mp4`; //"d0i.mp4";
                video.src = src;
                video.play();
                info.innerText = src;
                console.log("FadeOut change digit", idx, src);
            }
        }
    }

    getArrDigit(hour: number, minute: number) {
        return [(hour / 10) | 0, hour % 10, (minute / 10) | 0, minute % 10];
    }
}

function getDigit(name: string) {
    const digit = window.document.getElementById(name) as (HTMLVideoElement | undefined);
}

function init() {
    const digit0 = window.document.getElementById('digit0') as (HTMLVideoElement | undefined);
    const digit1 = window.document.getElementById('digit1') as (HTMLVideoElement | undefined);
    const digit2 = window.document.getElementById('digit2') as (HTMLVideoElement | undefined);
    const digit3 = window.document.getElementById('digit3') as (HTMLVideoElement | undefined);
    const info0 = window.document.getElementById('info0') as (HTMLDivElement | undefined)
    const info1 = window.document.getElementById('info1') as (HTMLDivElement | undefined)
    const info2 = window.document.getElementById('info2') as (HTMLDivElement | undefined)
    const info3 = window.document.getElementById('info3') as (HTMLDivElement | undefined)
    if (digit0 && digit1 && digit2 && digit3
        && info0 && info1 && info2 && info3) {
        const clock = new Clock(
            [digit0, digit1, digit2, digit3],
            [info0, info1, info2, info3]);
        clock.init();
        console.log("clock running");
    } else {
        console.error("clock not init");
    }
}

try {
    init();
} catch (err) {
    console.error(err);
}
//