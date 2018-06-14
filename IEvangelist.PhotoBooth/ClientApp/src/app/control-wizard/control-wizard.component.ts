import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { clearInterval, setInterval } from 'timers';

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

  public state: WizardState = WizardState.Idle;
  public photoCountDown: number;

  private timer: NodeJS.Timer;
  private photosToTake: number = 3;
  private photoCountDownDefault = 3;  
  private photoCountDownToggle: number = 1;
  private photosTaken: number = 0;

  constructor() {
    this.photoCountDown = this.photoCountDownDefault;
  }

  ngOnInit() { }

  public start(): void {
    this.state = WizardState.CountingDown;
    this.resetTimer();
  }

  public reset(): void {
    this.state = WizardState.Idle;
    this.stopTimer();
  }

  public resetTimer(): void {
    this.stopTimer();
    this.startTimer();
  }

  public startTimer(): void {
    this.timer =
      setInterval(
        () => {
          if (this.photosTaken < this.photosToTake) {
            if (this.photoCountDownToggle === this.photoCountDown) {
              this.state = WizardState.TakingPhoto;
              this.photoCountDown = this.photoCountDownDefault + 1;

              this.takePhoto.emit(this.photosTaken);

              ++ this.photosTaken;              
            } else {
              this.state = WizardState.CountingDown;
              -- this.photoCountDown;
            }
          } else {
            this.stopTimer();
            this.state = WizardState.PresentingPhotos;
            this.photoCountDown = this.photoCountDownDefault;
          }
        },
        1000);
  }

  public stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  public isIdle(): boolean {
    return this.state === WizardState.Idle;
  }

  public isCountingDown(): boolean {
    return this.state === WizardState.CountingDown;
  }

  public isTakingPhoto(): boolean {
    return this.state === WizardState.TakingPhoto;
  }

  public isPresentingPhotos(): boolean {
    return this.state === WizardState.PresentingPhotos;
  }
}
