import { Component, Output, EventEmitter } from '@angular/core';
import { AudioComponent } from '../audio/audio.component';

@Component({
    selector: 'number-pad',
    templateUrl: './number-pad.component.html',
    styleUrls: ['./number-pad.component.css']
})
export class NumberPadComponent {
    @Output() numberChanged = new EventEmitter<string>();

    private typeSound: HTMLAudioElement;
    private backspaceSound: HTMLAudioElement;
    private clearSound: HTMLAudioElement;
    private userNumber: string = "";

    constructor() { }

    public async onType(char: string, sound: AudioComponent) {
        this.userNumber += char;
        this.onNumberChanged();
        if (sound) {
            await sound.play();
        }
    }

    public async onDelete(sound: AudioComponent) {
        if (this.userNumber && this.userNumber.length) {
            this.userNumber =
                this.userNumber.length > 1
                    ? this.userNumber.slice(0, -1)
                    : "";
            this.onNumberChanged();
        }
        if (sound) {
            await sound.play();
        }
    }

    public async onClear(sound: AudioComponent) {
        this.userNumber = "";
        this.onNumberChanged();
        if (sound) {
            await sound.play();
        }
    }

    private onNumberChanged(): void {
        this.numberChanged.emit(this.userNumber);
    }
}