import tw from "tailwind-styled-components";
import Logo from "@/src/assets/logo.svg";

const FlaskImage = tw.img`
max-w-full
max-h-full
h-4/5
aspect-square
object-contain
flex-auto
drop-shadow-lg
animate-potionAppear
`;

function Flask() {
  return <FlaskImage src={Logo} />;
}

export default Flask;
