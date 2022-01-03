import { ReactNode } from "react";
import styled from "styled-components";
import { CenterFlex } from "../../styles/global";
import ReactDOM from "react-dom";
import ModalHeaderButton from "./ModalHeaderButton";
import Icon from "../Icon";

const ScrollBar = styled.div`
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 0.5rem;
    background: none;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 0.3rem;
    background-color: #6d6d6d;
  }
`;
const ScrollWrap = styled(ScrollBar)`
  position: fixed;
  z-index: 100;
  min-width: 83rem;
  top: 7.8rem;
  left: 0;
  width: 100%;
  height: calc(100vh - 7.8rem);
  min-height: 40rem;
  background: rgba(0, 0, 0, 0.3);
  overflow-y: scroll;
`;
const Modal = styled.div`
  position: absolute;
  top: calc(35% + 4.8rem);
  left: 50%;
  transform: translate(-50%, -50%);
  width: 53rem;
  border-radius: 1rem;
  border: 0.1rem solid rgba(255, 255, 255, 0.05);
  background: rgba(56, 56, 56, 0.95);
`;
const Header = styled(CenterFlex)`
  position: relative;
  height: 4.1rem;
  margin-bottom: 0.9rem;
  label {
    font-family: Lexend;
    font-weight: 800;
    font-size: 1.8rem;
    color: #2ad4d9;
  }
  button {
    left: 1.6rem;
    &:last-child {
      left: auto;
      right: 1.6rem;
    }
  }
`;

export const BasicModalWrap = (props: {
  label: string;
  cancel: () => void;
  back?: () => void;
  children?: ReactNode;
  marginTop?: string;
}) =>
  ReactDOM.createPortal(
    <ScrollWrap>
      <Modal>
        <Header>
          {props.back
            ? true
            : false && (
                <ModalHeaderButton onClick={props.back}>
                  <Icon name="dart" />
                </ModalHeaderButton>
              )}
          <label>{props.label}</label>
          <ModalHeaderButton onClick={props.cancel}>
            <Icon name="close" />
          </ModalHeaderButton>
        </Header>
        {props.children || null}
      </Modal>
    </ScrollWrap>,
    document.getElementById("modal-container")
  );
