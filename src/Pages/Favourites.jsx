import styled from "styled-components";
import PodcastCard from "../Components/PodcastCard";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import nullImg from "../assets/null.png";
const Container = styled.div`
  padding: 20px 30px;
  padding-bottm: 200px;
  height: 100%;
  gap: 20px;
  display: flex;
  overflow-y: scroll;
  flex-direction: column;
`;

const Topic = styled.div`
  font-size: 24px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Cards = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
  padding: 18px 6px;
  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const Loader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;
const Display = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text_primary};
`;
const Img = styled.img``;
const Favourites = () => {
  const [user, setUser] = useState();
  const [Loading, setLoading] = useState(false);
  const token = localStorage.getItem("castwavetoken");
  const { currentUser } = useSelector((state) => state.user);
  const getUser = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getUserActual = async () => {
    setLoading(true);
    await getUser();
    setLoading(false);
  };

  useEffect(() => {
    getUserActual();
  }, [currentUser]);
  return (
    <>
      <Container>
        <Topic>Favourites</Topic>
        {Loading ? (
          <Loader>
            <CircularProgress />
          </Loader>
        ) : (
          <Cards>
            {/* {console.log(user)} */}
            {user?.favourites?.length === 0 && (
              <Display>
                <Img src={nullImg} />
              </Display>
            )}
            {user?.favourites?.length > 0 &&
              user.favourites.map((item, key) => (
                <PodcastCard podcast={item} key={key} user={user} />
              ))}
          </Cards>
        )}
      </Container>
    </>
  );
};

export default Favourites;
