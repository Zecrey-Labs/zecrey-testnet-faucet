import { ReactNode, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import classNames from "classnames";
import Lottie, { LottiePlayer } from "lottie-web";
import Dark from "./dark.json";
import { CenterFlex } from "../../styles/global";
import ImgBox from "../ImgBox";

const MainContainer = styled.div`
  width: 100%;
  min-width: 72rem;
  position: absolute;
  display: flex;
  width: 100%;
  height: 100%;
  background: #2b2b2b;
  z-index: 100;
  overflow: hidden;
`;
const BodyScrollWrap = styled.div`
  width: 100%;
  min-width: 72rem;
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0.2rem;
    background: none;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 0.3rem;
    background-color: #6d6d6d;
  }
`;
const BodyContainer = styled.div`
  position: relative;
  width: 100%;
  min-width: 72rem;
  height: calc(100% - 7.8rem);
  min-height: 35rem;
  padding: 2rem 2.4rem;
  margin: 0 auto;
  @media (max-width: 1440px) {
    padding-top: 2rem;
    padding-left: 2.4rem;
    padding-bottom: 2rem;
    padding-right: 0;
  }
`;
const Div = styled.div<{ dark: boolean; darker: boolean }>`
  position: absolute;
  width: 100vw;
  height: calc(100vh - 7.8rem);
  top: 7.8rem;
  z-index: -10;
  opacity: ${(props) => (props.darker ? 0.6 : 1)};
  &.go-lighter {
    animation: ${(props) => (props.dark ? "shineUp 1s ease forwards" : "none")};
  }
  &.go-darker {
    animation: ${(props) =>
      props.dark ? "shineDown 1s ease forwards" : "none"};
  }
  @keyframes shineUp {
    0% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes shineDown {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;

interface Props {
  children?: ReactNode;
  darkerBG?: boolean;
}
const Layout = (props: Props) => {
  const [lottie, setLottie] = useState<LottiePlayer | null>(null);
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLottie(Lottie);
  }, []);
  useEffect(() => {
    if (!lottie) return;
    lottie.destroy();
    lottie.loadAnimation({
      container: dom.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: Dark,
      rendererSettings: {
        preserveAspectRatio: "xMaxYMid slice",
      },
    });
  }, [lottie]);

  return (
    <>
      <MainContainer>
        <Div
          className={classNames("layout-animation-wrap")}
          dark={true}
          darker={props.darkerBG}
          ref={dom}
        ></Div>
        <Cubes dark={true} darkBG={props.darkerBG} />
        <BodyScrollWrap>
          <Header />
          <BodyContainer>{props.children}</BodyContainer>
        </BodyScrollWrap>
      </MainContainer>
    </>
  );
};

export default Layout;

const HeaderWrap = styled(CenterFlex)`
  width: 100%;
  height: 7.8rem;
  background: rgba(56, 56, 56, 0.7);
  border: 0.1rem solid rgba(255, 255, 255, 0.1);
  .header {
    width: 144rem;
    justify-content: space-between;
    padding: 0 4.9rem 0 3.6rem;
  }
  .divider {
    width: 0.1rem;
    height: 2.5rem;
    background: #fff;
    margin: 0 2.7rem 0 2.1rem;
  }
`;
const Header = () => (
  <HeaderWrap>
    <CenterFlex className="header">
      <CenterFlex>
        <ImgBox
          src="/zecrey-logo-dark.png"
          alt="logo"
          width={131}
          height={47}
        />
        <div className="divider" />
        <ImgBox
          src="/testnet-faucet.svg"
          alt="Faucet"
          width={119}
          height={13}
        />
      </CenterFlex>
      <ImgBox
        src="/Zecrey_Wallet_bar.svg"
        alt="Zecrey Wallet"
        width={154}
        height={33}
      />
    </CenterFlex>
  </HeaderWrap>
);

const CubesWrap = styled(CenterFlex)<{ dark: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -10;
  opacity: ${(props) => (props.dark ? 1 : 0)};
  .cubes {
    width: 127.7vw;
    height: 58.7vw;
    margin-left: -13.8vw;
    margin-right: -13.8vw;
    -webkit-backface-visibility: hidden;
    filter: blur(1.5rem);
  }
  .cubes.darker {
    opacity: 0.6;
  }
  .cubes.go-lighter {
    animation: ${(props) => (props.dark ? "shineUp 1s ease forwards" : "none")};
  }
  .cubes.go-darker {
    animation: ${(props) =>
      props.dark ? "shineDown 1s ease forwards" : "none"};
  }
  @keyframes shineUp {
    0% {
      opacity: 0.6;
    }
    100% {
      opacity: 1;
    }
  }
  @keyframes shineDown {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.6;
    }
  }
`;
const Cubes = (props: { dark: boolean; darkBG?: boolean }) => {
  return (
    <CubesWrap dark={props.dark}>
      <ImgBox
        className={classNames("cubes", { darker: props.darkBG })}
        src="/cubes-background.png"
        alt="background"
      />
    </CubesWrap>
  );
};
