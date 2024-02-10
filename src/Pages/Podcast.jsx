import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Avatar, CircularProgress } from "@mui/material";
import { openSnackbar } from "../redux/snackbarSlices";
import { format } from "timeago.js";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import styled from "styled-components";
import Episodecard from "../Components/Episodecard";

const Container = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Loadings = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
const Favorite = styled.div`
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.text_secondary + 95} !important;
  color: ${({ theme }) => theme.text_primary} !important;
`;
const Topic = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const Image = styled.img`
  width: 250px;
  height: 250px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.text_secondary};
  object-fit: cover;
`;
const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
const Title = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: ${({ theme }) => theme.text_primary};
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const Description = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary};
`;
const Tags = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  flex-wrap: wrap;
`;
const Tag = styled.div`
  background-color: ${({ theme }) => theme.text_secondary + 50};
  color: ${({ theme }) => theme.text_primary};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
`;
const CreatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const CreatorDetails = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;
const Views = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
  margin-left: 20px;
`;
const Icon = styled.div`
  color: white;
  font-size: 12px;
  margin-left: 20px;
  border-radius: 50%;
  background: #9000ff !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
`;
const Creator = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 12px;
`;
const Episodes = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const EpisodeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const Top = styled.div`
color: ${({ theme }) => theme.text_primary};
font-size: 22px;
font-weight: 540;
display: flex;
justify-content space-between;
align-items: center;`;

const Podcast = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [Loading, setLoading] = useState(false);
  const [favourite, setFavourite] = useState(false);
  const [podcast, setPodcast] = useState();
  const [user, setUser] = useState();
  const token = localStorage.getItem("castwavetoken");
  const getUser = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      dispatch(
        openSnackbar({
          message: error.message,
          severity: "error",
        })
      );
    }
  };

  const getPodcast = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:3000/api/podcast/get/${id}`
      );
      if (res.status === 200) {
        setPodcast(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      dispatch(
        openSnackbar({
          message: error.message,
          severity: "error",
        })
      );
    }
  };
  const favoritePodcasts = async () => {
    try {
      setLoading(true);
      if (podcast != undefined && podcast != null) {
        const res = await axios.post(
          "http://localhost:3000/api/podcast/favorites",
          {
            id: podcast?._id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // console.log(res);
        if (res.status === 200) {
          setFavourite(!favourite);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      dispatch(
        openSnackbar({
          message: error.message,
          severity: "error",
        })
      );
    }
  };
  useState(() => {
    getPodcast();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      getUser();
    }
    if (user?.favourites?.find((fav) => fav._id === podcast._id)) {
      setFavourite(true);
    }
  }, [currentUser, podcast]);
  return (
    <Container>
      {Loading ? (
        <Loadings>
          <CircularProgress />
        </Loadings>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <Favorite onClick={() => favoritePodcasts()}>
              {favourite ? (
                <FavoriteIcon
                  style={{ color: "#E30022", width: "16px", height: "16px" }}
                />
              ) : (
                <FavoriteIcon style={{ widtha: "16px", height: "16px" }} />
              )}
            </Favorite>
          </div>
          <Topic>
            <Image src={podcast?.thumbnail} />
            <Details>
              {({ theme }) => console.log(theme.text_primary)}
              <Title>{podcast?.name}</Title>
              <Description>{podcast?.desc}</Description>
              <Tags>
                {podcast?.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </Tags>
              <CreatorContainer>
                <CreatorDetails>
                  <Avatar
                    src={podcast?.creator?.img}
                    sx={{ width: "26px", height: "26px" }}
                  >
                    {podcast?.creator?.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Creator>{podcast?.creator?.name}</Creator>
                </CreatorDetails>
                <Views>• {podcast?.views} Views</Views>
                <Views>• {format(podcast?.createdAt)}</Views>
                <Icon>
                  {podcast?.type === "audio" ? (
                    <HeadphonesIcon />
                  ) : (
                    <PlayArrowIcon />
                  )}
                </Icon>
              </CreatorContainer>
            </Details>
          </Topic>
          <Episodes>
            <Top>All Episodes</Top>
            <EpisodeWrapper>
              {podcast?.episodes.map((episode, index) => (
                <Episodecard
                  key={index}
                  episode={episode}
                  podid={podcast}
                  user={user}
                  type={podcast?.type}
                  index={index}
                />
              ))}
            </EpisodeWrapper>
          </Episodes>
        </>
      )}
    </Container>
  );
};

export default Podcast;
