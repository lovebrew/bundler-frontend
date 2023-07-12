import styled from "styled-components";

export const Potion = styled.img`
  max-width: 100%;
  max-height: 100%;
  min-height: 80%;
  aspect-ratio: 1/1;
  object-fit: contain;
  animation: 2s ease-out 0s 1 potionAppear;
  animation: 1s ease-in-out 0s 1 logoAppear;
  filter: drop-shadow(8px 4px 4px rgba(0, 0, 0, 0.25));
  flex:1 1 auto;
`