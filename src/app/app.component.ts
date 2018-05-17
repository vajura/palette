import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery';
declare var kd;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent  implements OnInit {

  paletteUrl = '';
  imageUrl = '';
  width = 800;
  height = 800;
  htmlContainer: any;
  mainContainer: any;
  mainCanvas: any;
  mainCtx: any;

  numberOfColours = 255 * 255 * 255;
  palettePixels = [];
  differentColours = 0;

  constructor(private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    setInterval(() => {
      kd.tick();
    }, 25);

    for (let a = 0; a < this.numberOfColours; a++) {
      this.palettePixels[a] = 0;
    }
    this.htmlContainer = $('html');
    this.mainContainer = $('#main-container');
    this.mainCanvas = <HTMLCanvasElement>document.getElementById('main-container');
    this.mainCtx = this.mainCanvas.getContext('2d');

    this.updateCanvas();
  }

  updateCanvas() {
    const imageData = this.mainCtx.createImageData(this.width, this.height);
    const data32 = new Uint32Array(imageData.data.buffer);
    for (let a = 0; a < data32.length; a++) {
      // data32[a] = 0XFF000000;
    }
    this.mainCtx.putImageData(imageData, 0, 0);
  }

  async paletteChanged() {
    const img: HTMLImageElement = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const {data32, width, height, ctx} = this.getData32(img);
      for (let a = 0; a < data32.length; a += 4) {
        const index = data32[a] * 255 * 255 + data32[a + 1] * 255 + data32[a + 2];
        this.palettePixels[index]++;
      }
      for (let a = 0; a < this.numberOfColours; a++) {
        if (this.palettePixels[a] > 0) {
          this.differentColours++;
        }
      }
      console.log(this.differentColours);
      this.cdr.markForCheck();
    };
    img.src = this.paletteUrl;
  }

  imageChanged() {

  }

  getData32(img: HTMLImageElement): any {
    const canvas: any = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: any = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // const imageData = ctx.createImageData(canvas.width, canvas.height);
    // const data32 = new Uint32Array(imageData.data.buffer);
    const data32 = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
    return {data32: data32, width: canvas.width, height: canvas.height, ctx: ctx};
  }
}
