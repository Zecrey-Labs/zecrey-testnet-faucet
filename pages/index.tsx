import { useRef, useState } from "react";
import styled from "styled-components";
import Icon from "../components/Icon";
import Layout from "../components/layout/Layout";
import { CenterFlex, FlatBtn } from "../styles/global";

const Faucet = () => {
  return (
    <Layout>
      <FormCard />
    </Layout>
  );
};

export default Faucet;

// 120 263
const CardWrap = styled.div`
  position: absolute;
  top: calc(30% + 7.8rem);
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64rem;
  height: 30rem;
  margin: 0 auto;
  border-radius: 1rem;
  overflow: hidden;
  .title {
    width: 100%;
    height: 5rem;
    border-radius: 1rem 1rem 0 0;
    background-color: rgba(56, 56, 56, 0.5);
    background-image: url(/title-bg.png);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    backdrop-filter: blur(2.7rem);
    font-family: Lexend;
    font-weight: 800;
    font-size: 2.1rem;
    color: #ffffff;
  }
  .body {
    flex-direction: column;
    height: calc(100% - 5rem);
    border-radius: 0 0 1rem 1rem;
    background: rgba(56, 56, 56, 0.5);
    border: 0.1rem solid rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(2.7rem);
    text-align: center;
    padding: 7rem 0 6rem 0;
    span {
      display: block;
      font-family: IBM Plex Sans;
      font-weight: 600;
      font-size: 2.1rem;
      color: #ffffff;
      opacity: 0.6;
      padding-bottom: 5rem;
    }
    ${FlatBtn} {
      width: 20rem;
      height: 4rem;
      color: #252525;
      background: linear-gradient(360deg, #00b6ba 0%, #53f8ff 100%);
      box-shadow: 0 0 0 0.2rem rgba(42, 212, 217, 0.15);
      border-radius: 2.3rem;
      transition: box-shadow 120ms ease-out;
      svg {
        margin-right: 1.2rem;
        vertical-align: middle;
        &.connect {
          width: 2rem;
          height: 1.6rem;
        }
        &.connected {
          width: 3rem;
          height: 2.1rem;
        }
      }
      b {
        font-family: Lexend;
        font-size: 1.6rem;
        font-weight: 600;
        vertical-align: middle;
      }
      &:hover {
        box-shadow: 0 0 0 0.2rem rgba(42, 212, 217, 0.15),
          rgb(0 182 186 / 70%) 0 0.2rem 1.2rem;
      }
    }
  }
`;

const FormCard = () => {
  const [address, setAddress] = useState("");
  const dom = useRef<HTMLDivElement>(null);

  const onConnect = () => {
    let zecrey = (window as any).zecrey;
    if (zecrey) {
      zecrey
        .request({
          method: "eth_requestAccounts",
        })
        .then((result: string[]) => {
          if (dom.current && result[0]) {
            setAddress(
              result[0].substring(0, 6) + "..." + result[0].substring(38, 42)
            );
          }
        });
    } else {
      window.open(
        "https://chrome.google.com/webstore/detail/zecrey/ojbpcbinjmochkhelkflddfnmcceomdi"
      );
    }
  };

  return (
    <CardWrap>
      <CenterFlex className="title">Zecrey Testnet Faucet</CenterFlex>
      <div className="body" ref={dom}>
        <span>Connect wallet to claim test assets.</span>
        {address ? (
          <FlatBtn>
            <Icon className="connected" name="connected" />
            <b>{address}</b>
          </FlatBtn>
        ) : (
          <FlatBtn onClick={onConnect}>
            <Icon className="connect" name="connect" />
            <b>Connect Wallet</b>
          </FlatBtn>
        )}
      </div>
    </CardWrap>
  );
};
