import "../../css/style.css";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
	flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f4f8;
`;

const Header = styled.h1`
  font-size: 3rem;
  color: #333;
`;

const SubHeader = styled.h2`
  font-size: 1.5rem;
  color: #666;
  margin-top: 0.5rem;
`;

const Description = styled.p`
  font-size: 1.2rem;
  color: #555;
  text-align: center;
  max-width: 600px;
  margin: 1rem 0;
`;

const Button = styled.button`
  padding: 0.8rem 2rem;
  font-size: 1rem;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

export const Home = () => {
  return (
    <Container>
      <Header>Welcome to Online Whiteboard</Header>
      <SubHeader>Collaborate. Create. Innovate.</SubHeader>
      <Description>
        Our online whiteboard system provides a seamless platform for teams to
        collaborate in real-time. Share your ideas, brainstorm together, and
        innovate without limits.
      </Description>
      <Button>Get Started</Button>
    </Container>
  );
};
