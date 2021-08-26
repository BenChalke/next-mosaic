import { LoadingContainer, LoadingImg } from './styles';

const Loading: React.FC = () => {
  return (
    <>
      <LoadingContainer data-testid="loading">
        <LoadingImg src="/loading.gif"/>
        <p>Loading...</p>
      </LoadingContainer>   
    </>
  );
}

export default Loading;