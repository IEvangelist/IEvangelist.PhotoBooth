import { Component, AfterViewInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'ccc-audio',
    templateUrl: './audio.component.html'
})
export class AudioComponent implements AfterViewInit {
    @Input('src') src: string;
    @Input('autoplay') autoplay: boolean = false;
    @ViewChild('audio') audioElement: ElementRef;    

    private audio: HTMLAudioElement;

    async ngAfterViewInit() {
        if (this.audioElement && this.audioElement.nativeElement) {
            this.audio = this.audioElement.nativeElement as HTMLAudioElement;
        }

        if (this.autoplay) {
            await this.play();
        }
    }

    public async play() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            try {
                await this.audio.play();
            } catch (e) {
                console.warn(e);
            }            
        }
    }
}