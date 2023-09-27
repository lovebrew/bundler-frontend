import tw from "tailwind-styled-components";

const FooterContainer = tw.footer`
flex
p-3
bg-neutral-800
flex-row
max-sm:flex-col
max-sm:text-base
content-center
justify-center
items-center
font-coolvetica
text-xl
w-full
gap-1
drop-shadow-footer
`;

const Spacer = tw.span`
px-2
max-sm:hidden
`;

type LinkProps = {
  icon: string;
  href?: string;
  children: string;
};

function Link(props: LinkProps) {
  return (
    <span>
      <i className={`${props.icon} px-1`}></i>
      {(props.href === undefined && <span>{props.children}</span>) || (
        <a href={props.href}>{props.children}</a>
      )}
    </span>
  );
}

function Footer() {
  return (
    <FooterContainer>
      <Link
        icon="fa-solid fa-flask"
        href="https://github.com/lovebrew/lovepotion"
      >
        LÖVE Potion
      </Link>
      <Spacer>•</Spacer>
      <Link
        icon="fa-brands fa-github"
        href="https://github.com/lovebrew/lovebrew-webserver"
      >
        Source code
      </Link>
      <Spacer>•</Spacer>
      <Link
        icon="fa-brands fa-paypal"
        href="https://paypal.me/TurtleP?country.x=US&locale.x=en_US"
      >
        Donate
      </Link>
      <Spacer>•</Spacer>
      <Link icon="fa-regular fa-copyright">LÖVEBrew Team</Link>
    </FooterContainer>
  );
}

export default Footer;
