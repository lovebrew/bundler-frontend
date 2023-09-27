import tw from "tailwind-styled-components";
import Logo from "@/src/assets/logo.svg";

const FlaskImage = tw.img`
max-w-full
max-h-full
aspect-square
object-contain
flex-auto
drop-shadow-flask
animate-potionAppear
`;

const FlaskContainer = tw.div`
flex
overflow-hidden 
w-full
max-h-full
min-h-[80%]
grow
`;

function Flask() {
  return (
    <FlaskContainer>
      <FlaskImage src={Logo} />
    </FlaskContainer>
  );
}

export default Flask;
