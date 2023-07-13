import styled from "styled-components";

export const Potion = styled.img`
  position: absolute;
  aspect-ratio: 1/1;
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: 2s ease-out 0s 1 potionAppear;
  animation: 1s ease-in-out 0s 1 logoAppear;
  filter: drop-shadow(8px 4px 4px rgba(0, 0, 0, 0.25));
`
