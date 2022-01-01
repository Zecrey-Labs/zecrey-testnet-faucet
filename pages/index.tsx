import classNames from "classnames";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import Icon from "../components/Icon";
import Layout from "../components/layout/Layout";
import { CenterFlex, FlatBtn } from "../styles/global";
import { throttle } from "lodash";
import Head from "next/head";
import { ethers } from "ethers";
import ABI from "../abi/claimABI.json";

const Faucet = () => {
  return (
    <>
      <Head>
        <title>Zecrey Testnet Faucet</title>
      </Head>
      <Layout>
        <FormCard />
      </Layout>
    </>
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
  { name: "Ethereum Rinkeby", id: 0 },
  { name: "Polygon Testnet", id: 1 },
  { name: "Aurora Testnet", id: 2 },
  { name: "Avalanche FUJI C-Chain", id: 3 },
  { name: "Binance Smart Chain - Testnet", id: 4 },
];

// const MockClaim = () => {
//   return new Promise<void>((resolve, reject) => {
//     setTimeout(() => {
//       let val = Date.now() % 2 === 0;
//       if (val) {
//         resolve();
//       } else {
//         reject({ message: "fail" });
//       }
//     }, 1 * 1000);
//   });
// };

const claim = (chain_id: number) => {
  return new Promise<void>(async (resolve, reject) => {
    // let zecrey = (window as any).zecrey;
    // if (!zecrey) return;
    // zecrey
    //   .request({
    //     method: "zecrey_claim",
    //     params: [chain_id],
    //   })
    //   .then((result) => {
    //     console.log(result);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });
    let eth = (window as any).ethereum;
    let current_chain_id = await eth.request({ method: "eth_chainId" });
    if (Number(CHAIN_CONFIGS[chain_id].chainId) !== Number(current_chain_id)) {
      try {
        await eth.request({
          method: "wallet_addEthereumChain",
          params: [CHAIN_CONFIGS[chain_id]],
        });
        eth.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CHAIN_CONFIGS[chain_id].chainId }],
        });
      } catch (err) {
        console.log("Error: failed to switch network.");
        return reject(err);
      }
    }
    let current_chain_id2 = await eth.request({ method: "eth_chainId" });
    if (Number(CHAIN_CONFIGS[chain_id].chainId) !== Number(current_chain_id2)) {
      // user refuse to switch chain anyway
      return reject({ message: "wrong chain" });
    } else {
      const signer = new ethers.providers.Web3Provider(eth).getSigner();
      const CLAIM_CONTRACT_ADDRESS = [
        "0xf5Fe43147a969180841c0E4BB766eD67938fFd2a",
        "0xbA0F5553cC7996a59F860F5a347976684e9Ae680",
        "0x0daB3AD6eE0Ca0AE3a5C0628cE54286589525ce1",
        "0x19c9e0490BeE1781a3C80648Cc2a061bcBc106e0",
        "0xA0C6126A241eeFD3D783667a19fb944500d88573",
      ];
      const contract = new ethers.Contract(
        CLAIM_CONTRACT_ADDRESS[chain_id],
        ABI,
        signer
      );
      contract
        .claimBatch()
        .then((tx) => {
          // console.log("tx:", tx);
          tx.wait()
            .then((res) => {
              // console.log("res: ", res);
              resolve();
            })
            .catch((err) => reject(err));
        })
        .catch((err) => reject(err));
    }
  });
};

const rinkeby_config = {
  chainId: "0x4",
  chainName: "Rinkeby testnet",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
  blockExplorerUrls: ["https://rinkeby.etherscan.io"],
};
const polygon_config = {
  chainId: "0x13881",
  chainName: "Polygon",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
  blockExplorerUrls: ["https://mumbai.polygonscan.com"],
};
const near_aurora_config = {
  chainId: "0x4e454153",
  chainName: "Aurora Testnet",
  nativeCurrency: {
    name: "ETH",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: ["https://testnet.aurora.dev/"],
  blockExplorerUrls: ["https://explorer.testnet.aurora.dev/"],
};
const avalanche_config = {
  chainId: "0xa869",
  chainName: "Avalanche FUJI C-Chain",
  nativeCurrency: {
    name: "AVAX",
    symbol: "AVAX",
    decimals: 18,
  },
  rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
  blockExplorerUrls: ["https://testnet.snowtrace.io/"],
};
const binance_config = {
  chainId: "0x61",
  chainName: "Binance Smart Chain - Testnet",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
  blockExplorerUrls: ["https://testnet.bscscan.com"],
};
const CHAIN_CONFIGS: {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
}[] = [
  rinkeby_config,
  polygon_config,
  near_aurora_config,
  avalanche_config,
  binance_config,
];

const FormCard = () => {
  const [address, setAddress] = useState("");
  const [selected, setSelected] = useState<{ name: string; id: number }>(
    options[0]
  );
  const [claimed, setClaimed] = useState(0); // 0 for not yet, 1 for claiming, 2 for claimed, 3 for failed
  const dom = useRef<HTMLDivElement>(null);

  const onConnect = () => {
    // let zecrey = (window as any).zecrey;
    // console.log(zecrey);
    // if (zecrey) {
    //   zecrey
    //     .request({
    //       method: "eth_requestAccounts",
    //     })
    //     .then((result: string[]) => {
    //       console.log(result);
    //       if (dom.current && result[0]) {
    //         setAddress(
    //           result[0].substring(0, 5) + "..." + result[0].substring(38, 42)
    //         );
    //       }
    //     });
    // } else {
    //   window.open(
    //     "https://chrome.google.com/webstore/detail/zecrey/ojbpcbinjmochkhelkflddfnmcceomdi"
    //   );
    // }
    let eth = (window as any).ethereum;
    if (eth) {
      eth.request({ method: "eth_requestAccounts" }).then((res) => {
        if (dom.current && res[0]) {
          setAddress(res[0].substring(0, 5) + "..." + res[0].substring(38, 42));
        }
      });
    }
  };
  const onClaim = useRef(
    throttle(
      (chainId: number) => {
        setClaimed(1);
        claim(chainId)
          .then(() => {
            if (dom.current) {
              setClaimed(2);
            }
          })
          .catch(() => {
            if (dom.current) {
              setClaimed(3);
            }
          })
          .finally(() => {
            setTimeout(() => {
              if (dom.current) {
                setClaimed(0);
              }
            }, 3.5 * 1000);
          });
      },
      1000,
      { trailing: false }
    )
  ).current;
  const BtnLabel = useMemo(() => {
    switch (claimed) {
      case 0:
        return "Claim";
      case 1:
        return "Claiming";
      case 2:
        return "Claimed";
      case 3:
        return "Failed";
      default:
        return "Claim";
    }
  }, [claimed]);
  useEffect(() => {
    const handle = (accounts: Array<string>) => {
      if (dom.current && accounts[0]) {
        setAddress(
          accounts[0].substring(0, 5) + "..." + accounts[0].substring(38, 42)
        );
      }
    };
    let eth = (window as any).ethereum;
    if (eth) {
      eth.on("accountsChanged", handle);
    }
    return () => {
      if (eth) eth.removeListener("accountsChanged", handle);
    };
  }, []);

  useEffect(() => {
    if (!address) return;
    const switchChain = async (chainId: number) => {
      let { ethereum } = window as any;
      if (!ethereum) return;
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [CHAIN_CONFIGS[chainId]],
        });
        ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: CHAIN_CONFIGS[chainId].chainId }],
        });
      } catch (err) {
        console.log("Error: failed to switch network.");
      }
    };
    switchChain(selected.id);
  }, [selected, address]);

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
              <button
                className="claim"
                onClick={() => onClaim(selected.id)}
                disabled={claimed !== 0}
              >
                {BtnLabel}
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
    min-width: 27rem;
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
