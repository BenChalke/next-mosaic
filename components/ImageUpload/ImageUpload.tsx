import { UploadContainer, StyledInput, StyledLabel } from './styles';
import { useEffect, useState } from 'react';
import Loading from '../Loading/Loading';
import ImageCanvas from '../ImageCanvas/ImageCanvas';

interface SvgArray {
  svg:string,
  x:number,
  y:number
}

interface Prop {
  stdTileWidth:string,  
  stdTileHeight:string,
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
  const [imgData, setImgData] = useState<any>();
  const [reset, setReset] = useState<Boolean>();

  useEffect(() => {
    setTileWidth(parseInt(stdTileWidth));
    setTileHeight(parseInt(stdTileHeight));

    const canvas:HTMLCanvasElement | null = document.querySelector("#imageCanvas") ? document.querySelector("#imageCanvas") : null;
    if(canvas) {
      canvas.height = document.body.offsetHeight - 200;
    }

    async function doRender() {
      if(tileCountX && tileCountY) {
        const tiles:any = await getTiles(tileCountX, tileCountY);
        drawTiles(tiles);
      }
    }

    doRender();
    
  }, [imgData]);

  useEffect(() => {
    // Reset the whole component if reset is true
    if(reset === true) {
      console.log('resetting');
      const canvas:HTMLCanvasElement | null = document.querySelector("#imageCanvas") ? document.querySelector("#imageCanvas") : null;
      if(canvas) {
        const ctx:CanvasRenderingContext2D | null = canvas.getContext("2d") ? canvas.getContext("2d") : null;
        if(ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }

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
    console.log('uploading...');
    
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
    console.log('init');
    const canvas:HTMLCanvasElement | null = document.querySelector("#imageCanvas") ? document.querySelector("#imageCanvas") : null;
    const container = document.querySelector(".uploadContainer") as HTMLCanvasElement;

    if (canvas) {
      canvas.width = container.offsetWidth;
      canvas.height = document.body.offsetHeight - 200;

      const ctx:CanvasRenderingContext2D | null = canvas.getContext("2d") ? canvas.getContext("2d") : null;
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
      // Need to ensure that the tile is divisible by 4
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
    
      const left = canvas.width / 2 - w / 2;
      const top = canvas.height / 2 - h / 2;
    
      if(tileWidth && tileHeight) {
        setTileCountX(~~(w / tileWidth));
        setTileCountY(~~(h / tileHeight));
      }
      setImgW(w);
      setImgH(h);
    
      if(ctx) {
        // ctx.drawImage(img, 0, 0);
        ctx.drawImage(img, left, top, w, h);
        setImgData(ctx.getImageData(left, top, w, h));
        ctx.clearRect(left, top, canvas.width, canvas.height);
      }
    }
  }
  
  //generate all tiles
  const getTiles = async (tileCountX:number, tileCountY:number) => {
    console.log('getting tiles');
    const tiles = [];
    // Ensure all needed variables are not undefined
    if(tileCountY && tileCountX && tileWidth && tileHeight) {
      for (let yi = 0; yi < tileCountY; yi++) {
        for (let xi = 0; xi < tileCountX; xi++) {
          tiles.push(await getTile(xi * tileWidth, yi * tileHeight));
        }
      }
    }
    return tiles;
  }
  
  //get a tile of size tileWidth*tileHeight from position xy
  const getTile = async (x:number, y:number) => {
    console.log('getTile');
    // TODO: Need to change type from any
    let tile:any = [];
    const data:[] = imgData.data;

    console.log(data);
    
    if(tileWidth) {
      for (let i = 0; i < tileWidth; i++) {
        await tile.push(...data.slice(getIndex(x, y + i), getIndex(x + tileWidth, y + i)));
      }
      //convert back to typed array and to imgdata object
      tile = new ImageData(new Uint8ClampedArray(tile), tileWidth, tileHeight);

      //save original position
      tile.x = x;
      tile.y = y;
      
      return tile;
    }
  }
  
  const getIndex = (x:number, y:number) => {
    const i = indexX(x) + indexY(y);
    if (i > imgData.length) console.warn("XY out of bounds");
    return i;
  }
  
  //get imgdata index from img px positions
  const indexX = (x:number) => {
    const i = x * 4;
    if (i > imgData.length) console.warn("X out of bounds");
    return i;
  }
  const indexY = (y:number) => {
    if(imgW) {
      const i = imgW * 4 * y;
      if (i > imgData.length) console.warn("Y out of bounds");
      return i;
    }
  }
  
  const drawTiles = async (tiles:[]) => {
    // Get all of the SVG data
    const svgArray:SvgArray[] = await fetchSvgs(tiles);
  
    const canvas:HTMLCanvasElement | null = document.querySelector("#imageCanvas") ? document.querySelector("#imageCanvas") : null;
    if (canvas) {
      const ctx:CanvasRenderingContext2D | null = canvas.getContext("2d") ? canvas.getContext("2d") : null;
      if (ctx) {
        // Get the returned data and convert to a usable HTML Object
        for (let i = 0; i < svgArray.length; i++) {
          const svgObject = new DOMParser().parseFromString(svgArray[i].svg, "text/xml");
          const svgURL = new XMLSerializer().serializeToString(svgObject);
      
          let url = window.btoa(svgURL);
          url = 'data:image/svg+xml;base64,' + url;
      
          // Convert the SVG code to an img
          const svgImage:HTMLImageElement = new Image();
          svgImage.src = url;

          if(i === 0) {
            setLoading(false);
          }
      
          // Need timeout to place one tile at a time
          setTimeout(() => {
            ctx.drawImage(svgImage, svgArray[i].x, svgArray[i].y, tileWidth, tileHeight);
          }, 5 * i);
        }
      }
    }
  }

  async function fetchSvgs (tiles:any) {
    let colour = '';
    let svgArray:SvgArray[] = [];
    console.log('tiles', tiles);
    for (const d of tiles) {
      // Get the RGB value of the tile
      colour = ((1 << 24) + (d.data[0] << 16) + (d.data[1] << 8) + d.data[2]).toString(16).slice(1);

      // Call the API to get the coloured SVG and store the value on an array
      const data:any = await fetch(`http://localhost:3000/api/colour/${colour}`, {cache: "force-cache", credentials: 'same-origin'});
      const dataResult:any = await data.text();
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