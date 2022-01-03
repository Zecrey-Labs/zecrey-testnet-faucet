import { useState } from "react";
import styled from "styled-components";
import { CenterFlex, FlatBtn } from "../../styles/global";
import Icon from "../Icon";
import { BasicModalWrap } from "../modal-wrap";

const Wrap = styled.div`
  display: inline-block;
  button.trigger {
    font-family: IBM Plex Sans;
    font-style: italic;
    font-weight: 600;
    font-size: 1.4rem;
    text-decoration-line: underline;
    color: #2ad4d9;
    margin-left: 0.5rem;
  }
`;
const List = styled.div`
  width: 48rem;
  background: rgba(85, 85, 85, 0.5);
  border: 0.1rem solid rgba(255, 255, 255, 0.05);
  border-radius: 0.8rem;
  margin: 0 auto 1rem auto;
  padding: 0 2rem;
  .site {
    height: 6rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    &:last-child {
      border-bottom: none;
    }
    .icon {
      width: 3rem;
      height: 3rem;
      border: 0.1rem solid #e1e1e1;
      border-radius: 0.75rem;
      margin-right: 1.5rem;
      svg {
        max-width: 2rem;
        height: 2rem;
        color: #e1e1e1;
        &.near {
          width: 1.7rem;
        }
      }
    }
    .name {
      flex: 1;
      font-family: Lexend;
      font-weight: 500;
      font-size: 1.4rem;
      color: #f1f1f1;
    }
    .link {
      svg {
        width: 12px;
        height: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin-right: 0.8rem;
      }
      a {
        font-family: IBM Plex Sans;
        font-style: italic;
        font-weight: 600;
        font-size: 1.4rem;
        text-decoration-line: underline;
        color: #2ad4d9;
      }
    }
  }
`;
const Footer = styled(CenterFlex)`
  width: 48rem;
  height: 4rem;
  margin: 0 auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  svg {
    width: 1.6rem;
    height: 1.6rem;
    margin-right: 0.8rem;
    color: #999;
  }
  span {
    font-family: IBM Plex Sans;
    font-style: italic;
    font-weight: 500;
    font-size: 1.2rem;
    color: #999;
  }
`;

const sites = [
  {
    chain_id: 0,
    chain_name: "Ethereum Rinkeby",
    link: "https://faucet.rinkeby.io/",
  },
  {
    chain_id: 1,
    chain_name: "Polygon Testnet",
    link: "https://faucet.polygon.technology/",
  },
  {
    chain_id: 2,
    chain_name: "Aurora Testnet",
    link: "https://testnet.aurora.dev/faucet",
  },
  {
    chain_id: 3,
    chain_name: "Avalanche FUJI C-Chain",
    link: "https://faucet.avax-test.network/",
  },
  {
    chain_id: 4,
    chain_name: "Binance Smart Chain-Testnet",
    link: "https://testnet.binance.org/faucet-smart",
  },
];

const chain = ["ethereum", "polygon", "near", "avalanche", "binance"];

const FaucetList = () => {
  const [ac, setAc] = useState(false);

  return (
    <Wrap>
      <FlatBtn className="trigger" onClick={() => setAc(!ac)}>
        Faucet List
      </FlatBtn>
      {ac ? (
        <BasicModalWrap label="Faucet List" cancel={() => setAc(false)}>
          <List className="list">
            {sites.map((i, index) => (
              <CenterFlex className="site" key={index}>
                <CenterFlex className="icon">
                  <Icon
                    className={chain[i.chain_id]}
                    name={chain[i.chain_id]}
                  />
                </CenterFlex>
                <div className="name">{i.chain_name}</div>
                <CenterFlex className="link">
                  <Icon name="link" />
                  <a href={i.link} target="_blank">
                    Website
                  </a>
                </CenterFlex>
              </CenterFlex>
            ))}
          </List>
          <Footer className="footer">
            <Icon name="question-alt" />
            <span>
              If you get any problem, you can visit the websites in the list for
              manual operation.
            </span>
          </Footer>
        </BasicModalWrap>
      ) : null}
    </Wrap>
  );
};
export default FaucetList;
