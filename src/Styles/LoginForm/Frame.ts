import styled from 'styled-components';

export const Frame = styled.div`
  border: 3px solid #f3f1f0;
  padding: 15px 20px 25px 20px;
  border-radius: 3px;
  @media(max-width: 600px){
    padding: 15px;
  }
`;

export const InnerFrame = styled(Frame)`
  margin: 0;
`;