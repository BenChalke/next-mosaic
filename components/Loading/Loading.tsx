import { LoadingContainer } from './styles';

const Loading: React.FC = () => {
  return (
    <>
      <LoadingContainer>
        <img src="/loading.gif"/>
        <p>Loading...</p>
      </LoadingContainer>   
    </>
  );
}

export default Loading;