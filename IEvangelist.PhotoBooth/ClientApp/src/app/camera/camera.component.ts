import { Component, Inject, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WizardState } from '../control-wizard/control-wizard.component';
import { ImageOptions } from '../models/image-options';

@Component({
    selector: 'camera',
    templateUrl: './camera.component.html',
    styleUrls: ['./camera.component.css']
})
export class CameraComponent implements AfterViewInit {
    @ViewChild('video') videoElement: ElementRef;
    private video: HTMLVideoElement;

    @ViewChild('canvas') canvasElement: ElementRef;
    private canvas: HTMLCanvasElement;

    public isPresentingPhotos: boolean = false;
    public isTextingLink: boolean = false;
    public isTakingPhoto: boolean = false;
    public imageWidth = 640;
    public imageHeight = 480;

    constructor() { }

    ngAfterViewInit(): void {
        if (this.videoElement && this.videoElement.nativeElement) {
            this.video = this.videoElement.nativeElement as HTMLVideoElement;
            if (this.video
                && navigator.mediaDevices
                && navigator.mediaDevices.getUserMedia) {
                navigator
                    .mediaDevices
                    .getUserMedia({ video: true })
                    .then((stream: MediaStream) => this.video.srcObject = stream);

                this.video.height = window.innerHeight;
            }
        }
        if (this.canvasElement && this.canvasElement.nativeElement) {
            this.canvas = this.canvasElement.nativeElement as HTMLCanvasElement;
        }
    }

    public onTakePhoto(count: number): void {
        if (this.canvas) {
            const context = this.canvas.getContext('2d');
            if (context) {
                context.drawImage(this.video, 0, 0, this.imageWidth, this.imageHeight);
                const url = this.canvas.toDataURL('image/png');
                localStorage.setItem(`${count}.image.png`, url);
            }
        }
    }

    public onStateChanged(state: WizardState): void {
        this.isPresentingPhotos = state === WizardState.PresentingPhotos;
        this.isTextingLink = state === WizardState.TextingLink;
        this.isTakingPhoto = state === WizardState.TakingPhoto;
    }

    public onOptionsReceived(imageOptions: ImageOptions): void {
        if (imageOptions) {
            this.imageHeight = imageOptions.imageHeight;
            this.imageWidth = imageOptions.imageWidth;
        }
    }

    public adjustVideoHeight(event): void {
        if (event && this.video) {
            this.video.height = event.target.innerHeight;
        }
    }
}