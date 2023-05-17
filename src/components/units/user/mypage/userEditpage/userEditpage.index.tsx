import styled from "@emotion/styled";
import UserEditBody from "./body/UserEditBody.index";
import UserEditFooter from "./footer/UserEditFooter.index";
import UserEditHeader from "./header/UserEditHeader.index";

const Body = styled.div`
  display: flex;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 823px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function UserEdit(): JSX.Element {
  return (
    <Body>
      <Wrapper>
        <UserEditHeader />
        <UserEditBody />
        <UserEditFooter />
      </Wrapper>
    </Body>
  );
}
