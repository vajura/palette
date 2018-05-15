import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
declare var kd;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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

  constructor() {

  }

  ngOnInit() {
    setInterval(() => {
      kd.tick();
    }, 25);

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

  toDataURL(url: string) {
    if (url.length > 5) {
      return fetch(url)
        .then((response) => {
          return response.blob();
        })
        .then(blob => {
          return URL.createObjectURL(blob);
        });
    } else {
      return '';
    }
  }
}
