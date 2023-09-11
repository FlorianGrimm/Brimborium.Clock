"use strict";
const oneMinuteMS = 60000;
const durationFadeInMS = 5000;
const durationFadeOutMS = 5000;
const msOfMinuteFadeOut = oneMinuteMS - durationFadeOutMS;
function splitTime(addMS = 0) {
    const t = new Date();
    const timeLocalMS = (addMS + (t.getTime()) - (t.getTimezoneOffset() * 60 * 1000)) % (24 * 60 * 60 * 1000);
    const msOfMinute = (timeLocalMS % 60000);
    const timeLocal = (timeLocalMS / 1000) | 0;
    const seconds = (timeLocal % 60);
    const minute = ((timeLocal / 60) | 0) % 60;
    const hour = ((timeLocal / 3600) | 0);
    // console.log("hour", hour, "minute", minute, "seconds", seconds);
    return { hour, minute, seconds, msOfMinute };
}
var ClockLoopMode;
(function (ClockLoopMode) {
    ClockLoopMode[ClockLoopMode["Auto"] = 0] = "Auto";
    ClockLoopMode[ClockLoopMode["Wait"] = 1] = "Wait";
    ClockLoopMode[ClockLoopMode["FadeIn"] = 2] = "FadeIn";
    ClockLoopMode[ClockLoopMode["FadeOut"] = 3] = "FadeOut";
})(ClockLoopMode || (ClockLoopMode = {}));
class Clock {
    // arrVideo :HTMLVideoElement[] = [];
    constructor(arrVideo, arrInfo) {
        this.arrVideo = arrVideo;
        this.arrInfo = arrInfo;
        this.arrDigit = [10, 10, 10, 10];
    }
    init() {
        // this.tickFadeIn({hour:1, minute:2, seconds:30, msOfMinute:30000});
        // this.tickFadeOut({hour:1, minute:3, seconds:0, msOfMinute:0});
        // this.tickFadeIn({hour:1, minute:3, seconds:0, msOfMinute:0});
        // this.tickFadeOut({hour:1, minute:4, seconds:0, msOfMinute:0});
        // this.tickFadeIn({hour:1, minute:4, seconds:0, msOfMinute:0});
        const splittedTime = splitTime();
        this.tickFadeIn(splittedTime);
        this.loopWait(splittedTime);
    }
    loopWait(splittedTime, mode = ClockLoopMode.Auto) {
        const { hour, minute, seconds, msOfMinute } = splittedTime;
        //55 .. 0    0..5
        //Fade out   Fade In
        const waitForFadeOut = (oneMinuteMS + msOfMinuteFadeOut - msOfMinute) % oneMinuteMS;
        const waitForFadeIn = (2 * oneMinuteMS - msOfMinute) % oneMinuteMS;
        if (mode === ClockLoopMode.Auto) {
            if (waitForFadeOut < waitForFadeIn) {
                mode = ClockLoopMode.FadeOut;
            }
            else {
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
    tickFadeIn(splittedTime) {
        const { hour, minute, seconds, msOfMinute } = splittedTime;
        console.log("FadeIn ", splittedTime);
        const nextArrDigit = this.getArrDigit(hour, minute);
        for (let idx = 0; idx <= 3; idx++) {
            const nextDigit = nextArrDigit[idx];
            if (this.arrDigit[idx] === nextDigit) {
                //
            }
            else {
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
    tickFadeOut(splittedTime) {
        const { hour, minute, seconds, msOfMinute } = splittedTime;
        console.log("FadeOut ", splittedTime);
        const nextArrDigit = this.getArrDigit(hour, minute);
        for (let idx = 0; idx <= 3; idx++) {
            const currentDigit = this.arrDigit[idx];
            const nextDigit = nextArrDigit[idx];
            if (currentDigit === nextDigit) {
                //
            }
            else {
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
    getArrDigit(hour, minute) {
        return [(hour / 10) | 0, hour % 10, (minute / 10) | 0, minute % 10];
    }
}
function getDigit(name) {
    const digit = window.document.getElementById(name);
}
function init() {
    const digit0 = window.document.getElementById('digit0');
    const digit1 = window.document.getElementById('digit1');
    const digit2 = window.document.getElementById('digit2');
    const digit3 = window.document.getElementById('digit3');
    const info0 = window.document.getElementById('info0');
    const info1 = window.document.getElementById('info1');
    const info2 = window.document.getElementById('info2');
    const info3 = window.document.getElementById('info3');
    if (digit0 && digit1 && digit2 && digit3
        && info0 && info1 && info2 && info3) {
        const clock = new Clock([digit0, digit1, digit2, digit3], [info0, info1, info2, info3]);
        clock.init();
        console.log("clock running");
    }
    else {
        console.error("clock not init");
    }
}
try {
    init();
}
catch (err) {
    console.error(err);
}
//
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zaXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxNQUFNLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDMUIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7QUFDOUIsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUM7QUFDL0IsTUFBTSxpQkFBaUIsR0FBRyxXQUFXLEdBQUcsaUJBQWlCLENBQUM7QUFJMUQsU0FBUyxTQUFTLENBQUMsUUFBZ0IsQ0FBQztJQUNoQyxNQUFNLENBQUMsR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0lBQ3JCLE1BQU0sV0FBVyxHQUFHLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDO0lBQzFHLE1BQU0sVUFBVSxHQUFHLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLE1BQU0sU0FBUyxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMzQyxNQUFNLE9BQU8sR0FBRyxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqQyxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMzQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLG1FQUFtRTtJQUNuRSxPQUFPLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFDLENBQUM7QUFDL0MsQ0FBQztB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