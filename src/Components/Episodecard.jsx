/* eslint-disable react/prop-types */
import axios from "axios";
import { MdOutlinePlayCircleOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { openSnackbar } from "../redux/snackbarSlices";
import { openplayer } from "../redux/audioPlayerSlice";

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.text_secondary};
  object-fit: cover;
`;
const Card = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  align-items: center;
  padding: 20px 30px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.card};
  cursor: pointer;
  &:hover {
    cursor: pointer;
    transform: translateY(-8px);
    transition: all 0.4s ease-in-out;
    box-shadow: 0 0 18px 0 rgba(0, 0, 0, 0.3);
    filter: brightness(1.3);
  }
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const ImageContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;
const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;
const Title = styled.div`
  font-size: 18px;
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
const Episodecard = ({ episode, podid, user, type, index }) => {
  const dispatch = useDispatch();
  const addViewToPodcast = async () => {
    try {
      // console.log(podid?._id);
      await axios.post(
        `http://localhost:3000/api/podcast/addorview/${podid?._id}`
      );
      // console.log(res);
    } catch (error) {
      dispatch(
        openSnackbar({
          message: error.message,
          severity: "error",
        })
      );
    }
  };
  return (
    <Card
      onClick={async () => {
        await addViewToPodcast();
        // console.log(type);
        if (type === "audio") {
          // open audio player
          dispatch(
            openplayer({
              type: "audio",
              episode: episode,
              podid: podid,
              index: index,
              currenttime: 0,
            })
          );
        } else {
          // open video player
          dispatch(
            openplayer({
              type: "video",
              episode: episode,
              podid: podid,
              index: index,
              currenttime: 0,
            })
          );
        }
      }}
    >
      <ImageContainer>
        <Image src={podid?.thumbnail} />
        <MdOutlinePlayCircleOutline
          style={{
            position: "absolute",
            top: "26px",
            left: "26px",
            color: "white",
            width: "50px",
            height: "50px",
          }}
        />
      </ImageContainer>
      <Details>
        <Title>{episode?.name}</Title>
        <Description>{episode?.desc}</Description>
      </Details>
    </Card>
  );
};

export default Episodecard;
