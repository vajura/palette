export const numberOfColours = 256 * 256 * 256;
export const powerOf4 = 4278190080;
export interface ImageInterface {
  width: number;
  height: number;
  data32: Uint32Array;
  url: string;
  palette: any[];
  colors: number;
  reducedPalette?: any[];
}

export function createEmptyImage(): ImageInterface {
  return {
    width: 0,
    height: 0,
    data32: new Uint32Array(1),
    url: '',
    palette: [],
    colors: 0,
    reducedPalette: []
  };
}
