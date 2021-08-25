import { UploadContainer, StyledInput, StyledLabel } from './styles';
import { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';
import ImageCanvas from '../ImageCanvas/ImageCanvas';

interface SvgArray {
  svg:string,
  x:number,
  y:number
}

interface ModifiedImageData {
  (
    data:Uint8ClampedArray,
    width:number,
    height:number,
    x?:number,
    y?:number
  ):void
};

interface Prop {
  stdTileWidth:string,  
  stdTileHeight:string,
}

interface SvgImage extends HTMLImageElement {
  svgX?:number,
  svgY?:number,
}

const ImageUpload: React.FC<Prop> = ({ stdTileWidth, stdTileHeight }) => {

  const [imgUploaded, setImgUploaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [imgW, setImgW] = useState<number>();
  const [imgH, setImgH] = useState<number>();
  const [tileWidth, setTileWidth] = useState<number>();
  const [tileHeight, setTileHeight] = useState<number>();
  const [tileCountX, setTileCountX] = useState<number | undefined>();
  const [tileCountY, setTileCountY] = useState<number | undefined>();
  const [imgData, setImgData] = useState<ModifiedImageData>();
  const [reset, setReset] = useState<Boolean>();

  useEffect(() => {
    // Set the tile dimensions with the ENV setting
    setTileWidth(parseInt(stdTileWidth));
    setTileHeight(parseInt(stdTileHeight));

    // Get the canvas and set the height
    const canvas:HTMLCanvasElement | null = document.querySelector("#imageCanvas");
    canvas!.height = document.body.offsetHeight - 200;

    async function doRender() {
      const tiles:ModifiedImageData[][] = await getTiles(tileCountX!, tileCountY!);
      drawTiles(tiles!);
    }

    doRender();
    
  }, [imgData]);

  useEffect(() => {
    // Reset the whole component if reset is true
    if(reset === true) {
      const canvas:HTMLCanvasElement | null = document.querySelector("#imageCanvas");
      const ctx:CanvasRenderingContext2D | null = canvas!.getContext("2d");
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);

      // Reset all states to original states
      setImgUploaded(false);
      setLoading(false);
      setImgW(undefined);
      setImgH(undefined);
      setTileWidth(undefined);
      setTileHeight(undefined);
      setTileCountX(undefined);
      setTileCountY(undefined);
      setImgData(undefined);
      setReset(false);
    }
  }, [reset]);

  const handleImageUpload = (e: React.FormEvent<HTMLInputElement>) => {
    
    const files = (e.target as HTMLInputElement).files;
    if(files) {
      const reader = new FileReader() as FileReader;
      const img:HTMLImageElement = new Image();
      reader.readAsDataURL(files[0]);
      reader.onload = () => {
        if(img) {
          img.src = reader.result as string;
          img.onload = () => {
            // Needed to stop double loading the image
            if(imgUploaded === false) {
              setImgUploaded(true);
              setLoading(true);
              init(img);
            }
          }
        }
      }
    }
  }

  const init = (img:HTMLImageElement) => {
    // Get the canvas
    const canvas:HTMLCanvasElement | null = document.querySelector("#imageCanvas") ? document.querySelector("#imageCanvas") : null;
    const container = document.querySelector(".uploadContainer") as HTMLCanvasElement;

    // Make the canvas fill its parent container
    canvas!.width = container.offsetWidth;
    canvas!.height = document.body.offsetHeight - 200;

    // Get the canvas data
    const ctx:CanvasRenderingContext2D | null = canvas!.getContext("2d") ? canvas!.getContext("2d") : null;
    const scale = Math.min(canvas!.width / img.width, canvas!.height / img.height);

    // Need to ensure that the tile is divisible by 4
    const w = Math.round(img.width * scale);
    const h = Math.round(img.height * scale);
  
    // Center the image in the canvas
    const left = canvas!.width / 2 - w / 2;
    const top = canvas!.height / 2 - h / 2;

    // Calculate the amount of tiles
    setTileCountX(~~(w / tileWidth!));
    setTileCountY(~~(h / tileHeight!));

    // Globaly set the new img dimensions
    setImgW(w);
    setImgH(h);
    
    // Draw the image - set the image data - clear the canvas
    ctx!.drawImage(img, left, top, w, h);
    setImgData(ctx!.getImageData(left, top, w, h));
    ctx!.clearRect(left, top, canvas!.width, canvas!.height);
  }
  
  //generate all tiles
  const getTiles = async (tileCountX:number, tileCountY:number) => {
    const tiles = [];

    // Ensure all needed variables are not undefined
    for (let yi = 0; yi < tileCountY; yi++) {
      for (let xi = 0; xi < tileCountX; xi++) {
        tiles.push(await getTile(xi * tileWidth!, yi * tileHeight!));
      }
    }

    return tiles;
  }
  
  // Get a tile of size tileWidth and tileHeight from position xy
  const getTile = async (x:number, y:number) => {
    let tile:ModifiedImageData[] = [];
    const data:number[] = imgData!.data;
    
    for (let i = 0; i < tileWidth!; i++) {
      await tile.push(...data.slice(getIndex(x, y + i), getIndex(x + tileWidth!, y + i)));
    }
    // Convert back to typed array and to imgdata object
    tile = new ImageData(new Uint8ClampedArray(tile), tileWidth!, tileHeight!);

    // Save original tile position to array
    tile.x = x;
    tile.y = y;
    
    return tile;
  }
  
  const getIndex = (x:number, y:number) => {
    const i = indexX(x) + indexY(y)!;
    if (i > imgData!.length) console.warn("XY out of bounds");
    return i;
  }
  
  //get imgdata index from img px positions
  const indexX = (x:number) => {
    const i = x * 4;
    if (i > imgData!.length) console.warn("X out of bounds");
    return i;
  }
  const indexY = (y:number) => {
    if(imgW) {
      const i = imgW * 4 * y;
      if (i > imgData!.length) console.warn("Y out of bounds");
      return i;
    }
  }
  
  const drawTiles = async (tiles:[]) => {
    // Get all of the SVG data
    const svgArray:SvgArray[] = await fetchSvgs(tiles);
    
    // Get the canvas data
    const canvas:HTMLCanvasElement | null = document.querySelector("#imageCanvas");
    const ctx:CanvasRenderingContext2D | null = canvas!.getContext("2d");

    let svgImgArr:SvgImage[] = [];

    // Get the returned data and convert to a usable HTML Object
    for (let i = 0; i < svgArray.length; i++) {
      // Get the SVG string and make it useable
      const svgObject = new DOMParser().parseFromString(svgArray[i].svg, "text/xml");
      const svgURL = new XMLSerializer().serializeToString(svgObject);
  
      // Convert the SVG to Base64
      let url = window.btoa(svgURL);
      url = 'data:image/svg+xml;base64,' + url;
  
      // Convert the SVG code to an img
      const svgImage:SvgImage = new Image();
      svgImage.src = url;
      svgImage.svgX = svgArray[i].x;
      svgImage.svgY = svgArray[i].y;

      svgImgArr.push(svgImage);
    }

    setLoading(false);
    const svgRows = getSvgRows(svgImgArr);
    console.log(svgRows);

    svgRows.forEach((row) => {
      // Need this timeout in order to avoid the render from going too fast and missing out of tiles for the very first render
      // Tested on Firefox fresh browser with no cache --- Found it requires 1000 timeout
      setTimeout(() => {
        row.forEach((item) => {
            ctx!.drawImage(item, item.svgX!, item.svgY!, tileWidth!, tileHeight!);
        })
      }, 1000);
    });
  }

  const getSvgRows = (svgImgArr:SvgImage[]) => {
    let resultArr:SvgImage[][] = [];
    let row:number = 0;
    let arrNum = 0;

    for(let i:number = 0;i < svgImgArr.length!;i++) {
      // Initalise the first row in the array
      if(i === 0) {
        resultArr[arrNum] = [];
      }
      // Check if the row exists and also if the SVG is in the same row as the previous
      if(svgImgArr[i].svgY === row){
        resultArr[arrNum].push(svgImgArr[i]);
      } else {
        arrNum++;
        row = row + tileWidth!;
        resultArr[arrNum] = [];
        resultArr[arrNum].push(svgImgArr[i]);
      }
    }
    return resultArr;
  }

  async function fetchSvgs (tiles:ImageData[]) {
    let colour = '';
    let svgArray:SvgArray[] = [];
    for (const d of tiles) {
      // Get the RGB value of the tile
      colour = ((1 << 24) + (d.data[0] << 16) + (d.data[1] << 8) + d.data[2]).toString(16).slice(1);

      // Call the API to get the coloured SVG and store the value on an array
      const data:Response = await fetch(`http://localhost:3000/api/colour/${colour}`, {cache: "force-cache", credentials: 'same-origin'});
      const dataResult:string = await data.text();
      svgArray.push({svg:dataResult, x: d.x, y: d.y });
    };
    
    return svgArray;
  }

  return (
    <UploadContainer className='uploadContainer'>
      <>
        <StyledLabel className={imgUploaded ? 'hidden' : ''} htmlFor="image-upload">Upload Image</StyledLabel>
        <StyledInput id="image-upload" className={imgUploaded ? 'hidden' : ''} name="image-upload" type="file" onChange={handleImageUpload} />
      </>
      <ImageCanvas setResetFn={setReset} />
      {loading && <Loading />}
    </UploadContainer>
  );
}

export default ImageUpload;