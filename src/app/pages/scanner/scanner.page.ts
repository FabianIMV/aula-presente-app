import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { VIDEO_CONFIG } from './config.const';
import jsQR from 'jsQR'
import { Subject, takeUntil, timer } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.page.html',
  styleUrls: ['./scanner.page.scss'],
})
export class ScannerPage implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('videoElement') video!: ElementRef<HTMLVideoElement>
  @ViewChild('canvas', {static: true}) canvas!: ElementRef

  videoStream!: MediaStream

  config = structuredClone(VIDEO_CONFIG)

  private destroy$ = new Subject<void>()

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
      this.prepareScanner()
  }

  async prepareScanner(){
    const available: any = await this.checkCamera()
    if(available) this.startScanner()
  }

  changeCamera(){
    let { facingMode } = this.config.video
    
    this.config.video.facingMode = facingMode === 'environment' ? 'user' : 'environment'
    this.startScanner()
  }

  async startScanner(){
    this.videoStream = await navigator.mediaDevices.getUserMedia(this.config)
    this.video.nativeElement.srcObject = this.videoStream

    this.spyCamera()
  }

  spyCamera(){
    if (this.video.nativeElement) {
      const { clientWidth, clientHeight } = this.video.nativeElement

      this.canvas.nativeElement.width = clientWidth
      this.canvas.nativeElement.height = clientHeight

      const canvas = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D

      canvas.drawImage(this.video.nativeElement, 0, 0, clientWidth, clientHeight)

      const inversionAttempts = 'dontInvert'

      const image = canvas.getImageData(0, 0, clientWidth, clientHeight)
      const qrcode = jsQR(image.data, image.width, clientHeight, {inversionAttempts})
      
      if(qrcode){
        
      } else {
        timer(500).pipe(takeUntil(this.destroy$)).subscribe(() => {
          this.spyCamera()
        })
      }
    }
  }

   async checkCamera(){
    const cameraPermission = await navigator.permissions.query({name: 'camera'} as any)
    console.log(cameraPermission)

    const isOk = cameraPermission.state !== 'denied'

    const hasMediaDevice = 'mediaDevices' in navigator
    const hasUserMedia = 'getUserMedia' in navigator.mediaDevices

    if(!hasMediaDevice || (!hasUserMedia && isOk)){

    }
    return cameraPermission.state !== 'denied'
  }

  ngOnDestroy(): void {

    this.videoStream.getTracks().forEach((track) => track.stop())
    this.video = null!

    this.destroy$.next()
    this.destroy$.complete()
  }
}

