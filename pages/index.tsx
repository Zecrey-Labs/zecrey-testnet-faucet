import classNames from "classnames";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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

const CardWrap = styled.div`
  position: absolute;
  top: calc(35% + 7.8rem);
  left: 50%;
  transform: translate(-50%, -50%);
  width: 64rem;
  .card {
    height: 30rem;
    margin: 0 auto;
    border-radius: 1rem;
    border: 0.1rem solid rgba(255, 255, 255, 0.1);
    margin-bottom: 11.6rem;
  }
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
    backdrop-filter: blur(2.7rem);
    text-align: center;
    span.text {
      display: block;
      font-family: IBM Plex Sans;
      font-weight: 600;
      font-size: 2.1rem;
      color: #ffffff;
      opacity: 0.6;
      padding-bottom: 5rem;
    }
  }
  .body.un-connected {
    padding: 7rem 0 6rem 0;
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
  .body.connected {
    padding: 3.9rem 0 6rem 0;
    .address {
      margin-bottom: 1.8rem;
      svg {
        width: 2.4rem;
        height: 2.4rem;
        margin-right: 1rem;
        vertical-align: middle;
      }
      span {
        font-family: IBM Plex Sans;
        font-weight: 600;
        font-size: 2.1rem;
        color: #ffffff;
        vertical-align: middle;
      }
    }
    .text {
      padding-bottom: 3rem;
    }
    button.claim {
      width: 10rem;
      height: 4rem;
      background: linear-gradient(135deg, #00b6ba 0%, #53f8ff 100%);
      border-radius: 1rem;
      border: none;
      font-family: Lexend;
      font-weight: 600;
      font-size: 1.6rem;
      color: #252525;
      transition: box-shadow 120ms ease-out;
      margin-left: 1rem;
      &:hover {
        box-shadow: 0 0 0 0.2rem rgba(42, 212, 217, 0.15),
          rgb(0 182 186 / 70%) 0 0.2rem 1.2rem;
      }
    }
  }
`;

const options = [
  { name: "Ethereum", id: 0 },
  { name: "Polygon", id: 1 },
  { name: "NEAR Aurora", id: 2 },
  { name: "Avalanche", id: 3 },
  { name: "Binance", id: 4 },
];

const FormCard = () => {
  const [address, setAddress] = useState("");
  const [selected, setSelected] = useState<{ name: string; id: number }>(
    options[0]
  );
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
              result[0].substring(0, 5) + "..." + result[0].substring(38, 42)
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
      <div className="card" ref={dom}>
        <CenterFlex className="title">Zecrey Testnet Faucet</CenterFlex>
        {address ? (
          <div className="body connected">
            <div className="address">
              <Icon name="user" />
              <span>{address}</span>
            </div>
            <span className="text">Select a chain to claim test tokens.</span>
            <CenterFlex>
              <Selector selected={selected} setSelected={setSelected} />
              <button className="claim" onClick={() => {}}>
                Claim
              </button>
            </CenterFlex>
          </div>
        ) : (
          <div className="body un-connected">
            <span className="text">Connect wallet to claim test assets.</span>
            <FlatBtn onClick={onConnect}>
              <Icon className="connect" name="connect" />
              <b>Connect Wallet</b>
            </FlatBtn>
          </div>
        )}
      </div>
    </CardWrap>
  );
};

const SelectWrap = styled.div`
  position: relative;
  height: 4rem;
  button.trigger {
    width: 100%;
    height: 100%;
    background: transparent;
    border: 0.2rem solid #2ad4d9;
    border-radius: 1rem;
    font-family: IBM Plex Sans;
    font-weight: 600;
    font-size: 1.6rem;
    color: #2ad4d9;
    padding: 0 1.8rem 0 2.6rem;
    transition: box-shadow 120ms ease-out;
    svg {
      width: 1.3rem;
      height: 0.8rem;
      margin-left: 1.4rem;
      transform: rotate(180deg);
      transition: transform 220ms ease-out;
    }
    &.ac svg {
      transform: rotate(0deg);
    }
    &:hover {
      box-shadow: 0 0 0 0.2rem rgba(42, 212, 217, 0.15),
        rgb(0 182 186 / 70%) 0 0.2rem 1.2rem;
    }
  }
  .options {
    position: absolute;
    left: 0;
    top: 5rem;
    background: rgba(40, 40, 40, 0.8);
    border: 0.2rem solid #2ad4d9;
    border-radius: 1rem;
    padding: 0.8rem;
  }
  .opt {
    width: 100%;
    height: 2.6rem;
    border-radius: 0.4rem;
    border: none;
    background: none;
    font-family: IBM Plex Sans;
    font-size: 1.6rem;
    color: #ffffff;
    padding: 0 0.8rem;
    text-align: left;
    &:hover {
      color: #282828;
      background: #2ad4d9;
    }
  }
`;
const Selector = (props: {
  selected: { name: string; id: number };
  setSelected: Dispatch<SetStateAction<{ name: string; id: number }>>;
}) => {
  const [ac, setAc] = useState(false);
  const dom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dom.current?.contains(e.target as Element)) setAc(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SelectWrap ref={dom}>
      <button
        className={classNames("trigger", { ac })}
        onClick={() => setAc(!ac)}
      >
        {props.selected.name} <Icon name="dart" />
      </button>
      {ac ? (
        <div className="options">
          {options.map((i, index) => (
            <button
              key={index}
              className="opt"
              onClick={() => {
                props.setSelected(i);
                setAc(false);
              }}
            >
              {i.name}
            </button>
          ))}
        </div>
      ) : null}
    </SelectWrap>
  );
};
