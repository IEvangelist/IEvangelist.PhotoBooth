import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { clearInterval, setInterval } from 'timers';
import { ImageService } from '../services/image.service';
import { ImageOptions } from '../models/image-options';

export enum WizardState {
    Idle,
    CountingDown,
    TakingPhoto,
    PresentingPhotos,
    SendingPhoto
};

@Component({
    selector: 'control-wizard',
    templateUrl: './control-wizard.component.html',
    styleUrls: ['./control-wizard.component.css']
})
export class ControlWizardComponent implements OnInit {
    @Output() takePhoto = new EventEmitter<number>();
    @Output() stateChange = new EventEmitter<WizardState>();

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

    public state: WizardState = WizardState.Idle;
    public photoCountDown: number;
    public images: string[] = [];
    public animationIndex: number = 0;

    private countDownTimer: NodeJS.Timer;
    private animationTimer: NodeJS.Timer;

    private imageOptions: ImageOptions;
    private photosTaken: number = 0;

    constructor(private readonly imageService: ImageService) { }

    async ngOnInit() {
        this.imageOptions = await this.imageService.getOptions();
        this.photoCountDown = this.imageOptions.photoCountDownDefault;
    }

    private changeState(state: WizardState): void {
        this.stateChange.emit(this.state = state);
    }

    public start(): void {
        this.changeState(WizardState.CountingDown);
        this.resetCountDownTimer();
    }

    public reset(): void {
        this.changeState(WizardState.Idle);
        this.photosTaken = 0;
        this.photoCountDown = this.imageOptions.photoCountDownDefault;
        this.stopCountDownTimer();
        this.stopAnimationTimer();
    }

    public async generate() {
        if (this.images) {
            const id =
                await this.imageService
                          .generateAnimiation(this.images);
        }
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
                            this.changeState(WizardState.TakingPhoto);
                            this.photoCountDown = this.imageOptions.photoCountDownDefault + 1;
                            this.takePhoto.emit(this.photosTaken);
                            ++this.photosTaken;
                        } else {
                            this.changeState(WizardState.CountingDown);
                            --this.photoCountDown;
                        }
                    } else {
                        this.stopCountDownTimer();
                        this.images = [];
                        for (var i = 0; i < this.imageOptions.photosToTake; ++ i) {
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