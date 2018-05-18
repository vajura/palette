import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import * as $ from 'jquery';
import {createEmptyImage, ImageInterface, numberOfColours, powerOf4} from '../models/image-interface';
declare var kd;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent  implements OnInit {

  imageUrl = '';
  htmlContainer: any;
  mainContainer: any;
  mainCanvas: any;
  mainCtx: any;

  images: ImageInterface[] = [];

  constructor(private cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    setInterval(() => {
      kd.tick();
    }, 25);

    this.images.push(createEmptyImage());
    this.images.push(createEmptyImage());
    for (let a = 0; a < 2; a++) {
      for (let b = 0; b < numberOfColours; b++) {
        this.images[a].palette[b] = 0;
      }
    }

    this.htmlContainer = $('html');
    this.mainContainer = $('#main-container');
    this.mainCanvas = <HTMLCanvasElement>document.getElementById('main-container');
    this.mainCtx = this.mainCanvas.getContext('2d');

    this.updateCanvas();
    setTimeout(() => {
      this.images[0].url = 'https://i.imgur.com/IhR8tZK.png';
      this.images[1].url = 'https://i.imgur.com/4koURS7.png';
      this.calculateImage(this.images[0]);
      this.calculateImage(this.images[1]);
      this.cdr.markForCheck();
    }, 1500);
  }

  updateCanvas() {
    /*const imageData = this.mainCtx.createImageData(this.width, this.height);
    const data32 = new Uint32Array(imageData.data.buffer);
    for (let a = 0; a < data32.length; a++) {
      // data32[a] = 0XFF000000;
    }
    this.mainCtx.putImageData(imageData, 0, 0);*/
  }

  paletteSwap() {
    this.mainContainer.width = this.images[1].width;
    this.mainContainer.height = this.images[1].height;
    this.mainCtx.canvas.height = this.images[1].height;
    this.mainCtx.canvas.width = this.images[1].width;
    const data32 = this.images[1].data32;
    const palette = this.images[0].reducedPalette;

    const imageData = this.mainCtx.createImageData(this.mainCtx.canvas.width, this.mainCtx.canvas.height);
    const newImageData32: Uint32Array = new Uint32Array(imageData.data.buffer);

    console.log(palette);
    for (let a = 0; a < data32.length; a++) {
      const color = data32[a] - powerOf4;
      const r1 = this.images[1].palette[color].r;
      const g1 = this.images[1].palette[color].g;
      const b1 = this.images[1].palette[color].b;

      let index = 0;
      let closest = Math.pow(palette[0].r - r1, 2) +
        Math.pow(palette[0].g - g1, 2) +
        Math.pow(palette[0].b - b1, 2);
      for (let b = 1; b < palette.length; b++) {
        const tempClosest = Math.pow(palette[b].r - r1, 2) +
          Math.pow(palette[b].g - g1, 2) +
          Math.pow(palette[b].b - b1, 2);
        if (tempClosest < closest) {
          closest = tempClosest;
          index = b;
        }
      }
      newImageData32[a] = palette[index].r * 256 * 256 + palette[index].g * 256 + palette[index].b + powerOf4;
    }
    this.mainCtx.putImageData(imageData, 0, 0);
    this.cdr.markForCheck();
  }

  async calculateImage(image: ImageInterface) {
    image.palette = [];
    for (let a = 0; a < numberOfColours; a++) {
      image.palette[a] = undefined;
    }
    image.colors = 0;
    image.reducedPalette = [];
    const img: HTMLImageElement = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const {data32, width, height} = this.getData32(img);
      image.data32 = data32;
      image.width = width;
      image.height = height;
      for (let a = 0; a < data32.length; a++) {
        const color = data32[a] - powerOf4;
        image.palette[color] = {
          r: (color & 0xFF0000) / 256 / 256,
          g: (color & 0x00FF00) / 256,
          b: (color & 0x0000FF)
        };
      }
      for (let a = 0; a < numberOfColours; a++) {
        if (image.palette[a]) {
          image.colors++;
          image.reducedPalette.push({
            r: (a & 0xFF0000) / 256 / 256,
            g: (a & 0x00FF00) / 256,
            b: (a & 0x0000FF)
          });
        }
      }
      console.log(image.reducedPalette);
      this.cdr.markForCheck();
    };
    img.src = image.url;
  }

  getData32(img: HTMLImageElement): any {
    const canvas: any = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: any = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // const imageData = ctx.createImageData(canvas.width, canvas.height);
    // const data32 = new Uint32Array(imageData.data.buffer);
    const data32 = new Uint8Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
    const imageData = ctx.createImageData(canvas.width, canvas.height);
    const newImageData32 = new Uint32Array(imageData.data.buffer);
    for (let a = 0; a < newImageData32.length; a++) {
      newImageData32[a] = powerOf4 + (data32[a * 4] + data32[a * 4 + 1] * 256 + data32[a * 4 + 2] * 256 * 256 );
    }
    return {data32: newImageData32, width: canvas.width, height: canvas.height};
  }
}
