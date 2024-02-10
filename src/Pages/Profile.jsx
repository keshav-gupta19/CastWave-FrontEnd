import { Avatar } from "@mui/material";
import PodcastCard from "../Components/PodcastCard";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
const ProfileAvatar = styled.div`
  padding-left: 3rem;
  @media (max-width: 768px) {
    padding-left: 0rem;
  }
`;
const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 768px) {
    align-items: center;
  }
`;
const ProfileName = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 34px;
  font-weight: 500;
`;
const Profile_email = styled.div`
  color: #2b6fc2;
  font-size: 14px;
  font-weight: 400;
`;
const FilterContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  ${({ box, theme }) =>
    box &&
    `
background-color: ${theme.bg};
  border-radius: 10px;
  padding: 20px 30px;
`}
`;
const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Podcasts = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  padding: 18px 6px;
  @media (max-width: 550px) {
    justify-content: center;
  }
`;
const ProfileMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const UserDetails = styled.div`
display flex;
gap: 120px;
@media (max-width: 768px) {
    width: fit-content;
    flex-direction: column; 
    gap: 20px;
    justify-content: center;
    align-items: center;
  }
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ButtonContainer = styled.div`
  font-size: 14px;
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.primary};
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 12px;
  width: 100%;
  max-width: 70px;
  padding: 8px 10px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  &:hover {
    background-color: ${({ theme }) => theme.primary};
    color: ${({ theme }) => theme.text_primary};
  }
`;
const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser);
  const [user, setUser] = useState();
  const [name, setName] = useState("");
  const token = localStorage.getItem("castwavetoken");

  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setName(res.data.name);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (currentUser) {
      getUser();
    }
  }, [currentUser]);
  console.log(user);
  return (
    <ProfileMain>
      <UserDetails>
        <ProfileAvatar>
          <Avatar
            sx={{ height: 165, width: 165, fontSize: "24px" }}
            src={user?.img}
          />
        </ProfileAvatar>
        <ProfileContainer>
          <ProfileName>{name}</ProfileName>
          <Profile_email>Email: {user?.email}</Profile_email>
        </ProfileContainer>
      </UserDetails>
      {currentUser && user?.podcasts.length > 0 && (
        <FilterContainer box={true}>
          <Topic>Your Uploads</Topic>
          <Podcasts>
            {user?.podcasts?.map((podcast, key) => (
              <PodcastCard podcast={podcast} user={user} key={key} />
            ))}
          </Podcasts>
        </FilterContainer>
      )}
      {currentUser && user?.podcasts?.length === 0 && (
        <FilterContainer box={true}>
          <Topic>Your Uploads</Topic>
          <Container>
            <ButtonContainer onClick={() => {}}>Upload</ButtonContainer>
          </Container>
        </FilterContainer>
      )}
      <FilterContainer box={true}>
        <Topic>Your Favourites</Topic>
        <Podcasts>
          {user &&
            user?.favourites?.map((podcast, key) => (
              <PodcastCard podcast={podcast} user={user} key={key} />
            ))}
        </Podcasts>
      </FilterContainer>
    </ProfileMain>
  );
};

export default Profile;
