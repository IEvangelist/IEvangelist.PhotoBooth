import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { clearInterval, setInterval } from 'timers';
import { ImageService } from '../services/image.service';
import { ImageOptions } from '../models/image-options';
import { AudioComponent } from '../audio/audio.component';

export enum WizardState {
    Idle,
    CountingDown,
    TakingPhoto,
    PresentingPhotos,
    SendingPhoto,
    TextingLink
};

export interface PhotoDetails {
    photoCount: number;
    interval: number;
};

@Component({
    selector: 'control-wizard',
    templateUrl: './control-wizard.component.html',
    styleUrls: ['./control-wizard.component.css']
})
export class ControlWizardComponent implements OnInit {
    @Output() takePhoto = new EventEmitter<PhotoDetails>();
    @Output() stateChange = new EventEmitter<WizardState>();
    @Output() optionsReceived = new EventEmitter<ImageOptions>();

    public get isIdle(): boolean {
        return this.state === WizardState.Idle;
    }

    public get isCountingDown(): boolean {
        return this.state === WizardState.CountingDown;
    }

    public get isTakingPhoto(): boolean {
        return this.state === WizardState.TakingPhoto;
    }

    public get isPresentingPhotos(): boolean {
        return this.state === WizardState.PresentingPhotos;
    }

    public get isTextingLink(): boolean {
        return this.state === WizardState.TextingLink;
    }

    public get gridClasses(): any {
        return {
            'grid-start': this.isIdle,
            'grid-countdown': this.isCountingDown,
            'grid-taking-photo': this.isTakingPhoto,
            'grid-texting-link': this.isTextingLink,
            'grid-presenting-photos': this.isPresentingPhotos
        }
    }

    public isSending = false;

    public state: WizardState = WizardState.Idle;
    public photoCountDown: number;
    public images: string[] = [];
    public animationIndex: number = 0;
    public phoneNumber: string = '(414) 000-0000';

    private countDownTimer: NodeJS.Timer;
    private animationTimer: NodeJS.Timer;

    private imageOptions: ImageOptions;
    private photosTaken: number = 0;

    constructor(private readonly imageService: ImageService) { }

    async ngOnInit() {
        this.imageOptions = await this.imageService.getOptions();
        this.optionsReceived.emit(this.imageOptions);
        this.photoCountDown = this.imageOptions.photoCountDownDefault;
    }

    private changeState(state: WizardState): void {
        console.log(`State: ${WizardState[state]}`);
        this.stateChange.emit(this.state = state);
    }

    public async start(sound: AudioComponent) {
        if (sound) {
            await sound.play();
        }
        this.changeState(WizardState.CountingDown);
        this.resetCountDownTimer();
    }

    public async reset(sound: AudioComponent) {
        if (sound) {
            await sound.play();
        }
        this.changeState(WizardState.Idle);
        this.photosTaken = 0;
        this.phoneNumber = '(414) 000-0000';
        this.photoCountDown = this.imageOptions.photoCountDownDefault;
        this.stopCountDownTimer();
        this.stopAnimationTimer();
    }

    public async generate(sound: AudioComponent) {
        if (sound) {
            await sound.play();
        }
        if (this.phoneNumber && this.images && this.images.length) {
            this.isSending = true;
            const id =
                await this.imageService
                          .generateAnimation(this.phoneNumber, this.images)
                          .then(() => this.isSending = false);
        }
    }

    public async send(sound: AudioComponent) {
        if (sound) {
            await sound.play();
        }
        this.changeState(WizardState.TextingLink);
    }

    public onPhoneNumberChanged(number: string): void {
        this.phoneNumber = number;
    }

    private resetCountDownTimer(): void {
        this.stopCountDownTimer();
        this.startCountDownTimer();
    }

    private startCountDownTimer(): void {
        this.countDownTimer =
            setInterval(
                () => {                    
                    if (this.photosTaken < this.imageOptions.photosToTake) {
                        if (this.photoCountDown === 1) {
                            this.photoCountDown = this.imageOptions.photoCountDownDefault + 1;
                            this.changeState(WizardState.TakingPhoto);
                            const details = {
                                photoCount: this.photosTaken,
                                interval: this.imageOptions.intervalBetweenCountDown
                            };
                            this.takePhoto.emit(details);
                            ++ this.photosTaken;
                        } else {
                            this.changeState(WizardState.CountingDown);
                            -- this.photoCountDown;
                        }
                    } else {
                        this.stopCountDownTimer();
                        this.images = [];
                        for (let i = 0; i < this.imageOptions.photosToTake; ++ i) {
                            this.images.push(localStorage.getItem(`${i}.image.png`));
                        }
                        this.startAnimationTimer();
                        this.changeState(WizardState.PresentingPhotos);
                        this.photoCountDown = this.imageOptions.photoCountDownDefault;
                    }
                },
                this.imageOptions.intervalBetweenCountDown);
    }

    private startAnimationTimer(): void {
        this.stopAnimationTimer();
        this.animationTimer =
            setInterval(() => {
                const index = (this.animationIndex + 1);
                if (index >= this.images.length) {
                    this.animationIndex = 0;
                } else {
                    this.animationIndex = index;
                }
            }, this.imageOptions.animationFrameDelay);
    }

    private stopAnimationTimer(): void {
        if (this.animationTimer) {
            clearInterval(this.animationTimer);
        }
    }

    private stopCountDownTimer(): void {
        this.images = [];
        if (this.countDownTimer) {
            clearInterval(this.countDownTimer);
        }
    }
}
