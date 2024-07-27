import { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f4f8;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
`;

const Section = styled.div`
  margin: 2rem 0;
  width: 80%;
  max-width: 800px;
  background-color: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #007bff;
  margin-bottom: 1rem;
`;

const OnlineUsersList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const UserItem = styled.li`
  font-size: 1rem;
  color: #555;
  padding: 0.5rem 0;
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
  margin-top: 1rem;

  &:hover {
    background-color: #0056b3;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

export const RoomManagement = () => {
  const [count, setCount] = useState(0);

  return (
    <Container>
      <Title>Room Management</Title>

      <Section>
        <SectionTitle>{`Current Online Users (${count})`}</SectionTitle>
        <OnlineUsersList>
          <UserItem>User1</UserItem>
          <UserItem>User2</UserItem>
          <UserItem>User3</UserItem>
          {/* Add more users as needed */}
        </OnlineUsersList>
      </Section>

      <Section>
        <SectionTitle>Create New Room</SectionTitle>
        <Link to="/new-room">
          <Button>Create Room</Button>
        </Link>
      </Section>

      <Section>
        <SectionTitle>Join Existing Room</SectionTitle>
        <Input type="text" placeholder="Enter room ID" />
        <Link to="/rooms/1">
          <Button>Join Room</Button>
        </Link>
      </Section>
    </Container>
  );
};
