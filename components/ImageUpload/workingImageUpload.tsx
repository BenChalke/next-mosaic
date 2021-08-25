// import { UploadContainer, StyledInput, StyledLabel, LoadingContainer } from './styles';
// import { useEffect, useState } from 'react';



// let container:HTMLCanvasElement;
// let canvas:HTMLCanvasElement;
// let ctx:CanvasRenderingContext2D;
// let input:HTMLInputElement;
// let reader:FileReader;
// let img:HTMLImageElement;
// let imgW:number; //px
// let imgH:number; //px
// // TODO: Need to change type from any
// let imgData:any;
// let tileDim:number = 16; //tile dimensions px
// let tileCountX:number; //how many tiles we can fit
// let tileCountY:number;

// // TODO: Need to change type from any
// let colourSvg:any;

// interface SvgArray {
//   svg:string,
//   x:number,
//   y:number
// };


// const ImageUpload: React.FC = () => {

//   const [imgUploaded, setImgUploaded] = useState<Boolean>(false);
//   const [loading, setLoading] = useState<Boolean>(false);

//   useEffect(() => {
//     canvas = document.querySelector("#imageCanvas") as HTMLCanvasElement;
//     container = document.querySelector(".uploadContainer") as HTMLCanvasElement;
//     canvas.width = container.offsetWidth;
//     canvas.height = document.body.offsetHeight - 200;
//     ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
//     input = document.querySelector("#image-upload") as HTMLInputElement;
//     reader = new FileReader() as FileReader;
//     img = new Image() as HTMLImageElement;
//   }, []);

//   const handleImageUpload = (e: React.FormEvent<HTMLInputElement>) => {
//     console.log('uploading...');
//     setImgUploaded(true);
//     const files = (e.target as HTMLInputElement).files;
//     if(files) {
//       reader.readAsDataURL(files[0]);
//       reader.onload = function() {
//         if(img) {
//           img.src = reader.result as string;
//           img.onload = function() {
//             //start
//             init();
//             // TODO: Need to change type from any
//             const tiles:any = getTiles();
//             drawTiles(tiles);
//           }
//         }
//       }
//     }
//   }

//   function init() {
//     const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
//     const w = Math.floor(img.width * scale);
//     const h = Math.floor(img.height * scale);

//     // Set the component wide img dimensions
//     imgW = w;
//     imgH = h;
  
//     const left = canvas.width / 2 - w / 2;
//     const top = canvas.height / 2 - h / 2;
  
//     tileCountX = ~~(w / tileDim);
//     tileCountY = ~~(h / tileDim);
  
//     if(ctx) {
//       // ctx.drawImage(img, 0, 0);
//       ctx.drawImage(img, left, top, w, h);
//       imgData = ctx.getImageData(left, top, w, h);
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//     }
//   }
  
//   //generate all tiles
//   function getTiles() {
//     var tiles = [];
//     for (var yi = 0; yi < tileCountY; yi++) {
//       for (var xi = 0; xi < tileCountX; xi++) {
//         tiles.push(getTile(xi * tileDim, yi * tileDim));
//       }
//     }
//     return tiles;
//   }
  
// //get a tile of size tileDim*tileDim from position xy
// function getTile(x:number, y:number) {
//   // TODO: Need to change type from any
//   let tile:any = [];
//   const data: [] = imgData.data;
//   //loop over rows
//   for (var i = 0; i < tileDim; i++) {
//     tile.push(...data.slice(getIndex(x, y + i), getIndex(x + tileDim, y + i)));
//   }
//   //convert back to typed array and to imgdata object
//   tile = new ImageData(new Uint8ClampedArray(tile), tileDim, tileDim);

//   //save original position
//   tile.x = x;
//   tile.y = y;
  
//   return tile;
// }
  
//   function getIndex(x:number, y:number) {
//     var i = indexX(x) + indexY(y);
//     if (i > imgData.length) console.warn("XY out of bounds");
//     return i;
//   }
  
//   //get imgdata index from img px positions
//   function indexX(x:number) {
//     var i = x * 4;
//     if (i > imgData.length) console.warn("X out of bounds");
//     return i;
//   }
//   function indexY(y:number) {
//     var i = imgW * 4 * y;
//     if (i > imgData.length) console.warn("Y out of bounds");
//     return i;
//   }
  
//   async function drawTiles(tiles:[]) {
//     setLoading(true);
//     // Get all of the SVG data
//     const svgArray:SvgArray[] = await fetchSvgs(tiles);
  
//     setLoading(false);
//     // Get the returned data and convert to a usable HTML Object
//     for (let i = 0; i < svgArray.length; i++) {
//       // console.log('data.svg', data.svg);
//       let svgObject = new DOMParser().parseFromString(svgArray[i].svg, "text/xml");
//       const svgURL = new XMLSerializer().serializeToString(svgObject);
  
//       // console.log(svgURL);
//       // return;
  
//       // make it base64
//       // var DOMURL = self.URL || self.webkitURL || self;
//       // var svg = new Blob([svgURL], {type: "image/svg+xml;charset=utf-8"});
//       // var url = DOMURL.createObjectURL(svg);
  
//       var url = window.btoa(svgURL);
//       url = 'data:image/svg+xml;base64,' + url;
  
//       // Convert the SVG code to an img
//       let svgImage = new Image();
//       svgImage.src = url;
//       svgImage.width = 16;
//       svgImage.height = 16;
  
//       // Need timeout to place one tile at a time
//       setTimeout(() => {
//         ctx.drawImage(svgImage, svgArray[i].x + 5, svgArray[i].y + 5);
//         console.log('done');
//         // return;
//       }, 5 * i);
//     }
    
//   }
  
//   const fetchSvgs = async (tiles:any) => {
//     let colour = '';
//     let svgArray:SvgArray[] = []
//     for (const d of tiles) {
//       // Get the RGB value of the tile
//       colour = ((1 << 24) + (d.data[0] << 16) + (d.data[1] << 8) + d.data[2]).toString(16).slice(1);
  
//       // Call the API to get the coloured SVG and store the value on an array
//       const data:any = await fetch(`http://localhost:3000/api/colour/${colour}`, {cache: "force-cache", credentials: 'same-origin'});
//       const dataResult:any = await data.text();
//       svgArray.push({svg:dataResult, x: d.x, y: d.y });
//     };
    
//     return svgArray;
//   }

//   return (
//     <UploadContainer className='uploadContainer'>
//       <>
//         <StyledLabel className={imgUploaded ? 'hidden' : ''} htmlFor="image-upload">Upload Image</StyledLabel>
//         <StyledInput id="image-upload" className={imgUploaded ? 'hidden' : ''} name="image-upload" type="file" onChange={handleImageUpload} />
//       </>
//       <canvas id="imageCanvas" className="imageCanvas">
//         <p>Canvas support needed!</p>
//       </canvas>
//       {loading &&
//         <LoadingContainer>
//           <img src="/loading.gif"/>
//           <p>Loading...</p>
//         </LoadingContainer>      
//       }

//     </UploadContainer>
//   );
// }

// export default ImageUpload;