import classNames from "classnames";
import { ReactNode } from "react";
import styled from "styled-components";

const Button = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.2rem;
  height: 3.2rem;
  border: none;
  border-radius: 50%;
  background: none;
  svg {
    width: 1.4rem;
    height: 1.4rem;
    color: #fff;
    opacity: 0.3;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.2);
    svg {
      color: #fff;
      opacity: 1;
    }
  }
`;

interface Props {
  children?: ReactNode;
  className?: string;
  onClick: () => void;
}
const ModalHeaderButton = (props: Props) => {
  return (
    <Button
      className={classNames("modal-header-btn", props.className)}
      onClick={props.onClick}
    >
      {props.children}
    </Button>
  );
};

export default ModalHeaderButton;
