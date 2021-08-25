import { useState } from "react";
import ImageUpload from "../components/ImageUpload/ImageUpload";
import Loading from "../components/Loading/Loading";
import { MainTitle } from "../styles/app";

function Homepage(): JSX.Element {
  const TILE_WIDTH = process.env.NEXT_PUBLIC_TILE_WIDTH;
  const TILE_HEIGHT = process.env.NEXT_PUBLIC_TILE_HEIGHT;
  const [imageAvailable, setImageAvailable] = useState<Boolean>(false);

  return (
    <>
      <MainTitle>Next.js Mosaic</MainTitle>
      <ImageUpload stdTileWidth={`${TILE_WIDTH}`}  stdTileHeight={`${TILE_HEIGHT}`} />
    </>
  );
}

export default Homepage;
