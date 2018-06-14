import { Component, Inject, ViewChild, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string) { }

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
        context.drawImage(this.video, 0, 0, 640, 480);
        const url = this.canvas.toDataURL('image/png');
        localStorage.setItem(`${count}.image.png`, url);
      }
    }
  }

  public adjustVideoHeight(e): void {
    if (e && this.video) {
      this.video.height = e.target.innerHeight;
    }    
  }
}
