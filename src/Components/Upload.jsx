/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { CircularProgress, LinearProgress, Modal } from "@mui/material";
import {
  BackupRounded,
  CloseRounded,
  CloudDoneRounded,
} from "@mui/icons-material";
import ImageSelector from "./ImageSelector";
import styled from "styled-components";
import { Category } from "../Utils/Data";
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import app from "../../firebase";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlices";
import axios from "axios";
const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: top;
  justify-content: center;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  max-width: 500px;
  width: 100%;
  border-radius: 16px;
  margin: 50px 20px;
  height: min-content;
  background-color: ${({ theme }) => theme.card};
  color: ${({ theme }) => theme.text_primary};
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
  margin: 12px 20px;
`;

const TextInput = styled.input`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text_secondary};
`;

const Desc = styled.textarea`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  padding: 10px 0px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Label = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary + 80};
  margin: 12px 20px 0px 20px;
`;

const OutlinedBox = styled.div`
  min-height: 48px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  color: ${({ theme }) => theme.text_secondary};
  ${({ googleButton }) =>
    googleButton &&
    `
    user-select: none; 
  gap: 16px;`}
  ${({ button, theme }) =>
    button &&
    `
    user-select: none; 
  border: none;
    font-weight: 600;
    font-size: 16px;
    background: ${theme.button};
    color:'${theme.bg}';`}
    ${({ activeButton, theme }) =>
    activeButton &&
    `
    user-select: none; 
  border: none;
    background: ${theme.primary};
    color: white;`}
  margin: 3px 20px;
  font-weight: 600;
  font-size: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 14px;
`;

const Select = styled.select`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: transparent;
  outline: none;
  color: ${({ theme }) => theme.text_secondary};
`;

const Option = styled.option`
  width: 100%;
  border: none;
  font-size: 14px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.card};
  outline: none;
  color: ${({ theme }) => theme.text_secondary};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0px;
  margin: 6px 20px 20px 20px;
  align-items: center;
  gap: 12px;
`;

const FileUpload = styled.label`
  display: flex;
  min-height: 48px;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 16px 20px 3px 20px;
  border: 1px dashed ${({ theme }) => theme.text_secondary};
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  color: ${({ theme }) => theme.text_secondary};
  &:hover {
    background-color: ${({ theme }) => theme.text_secondary + 20};
  }
`;

const File = styled.input`
  display: none;
`;

const Uploading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px;
`;

const Upload = ({ setUploadOpen }) => {
  const dispatch = useDispatch();
  const [podcast, setPodcast] = useState({
    name: "",
    desc: "",
    thumbnail: "",
    tags: [],
    type: "audio",
    episodes: [
      {
        name: "",
        desc: "",
        type: "audio",
        file: "",
      },
    ],
  });
  useEffect(() => {
    if (podcast === null) {
      setDisabled(true);
      setPodcast({
        name: "",
        desc: "",
        thumbnail: "",
        tags: [],
        episodes: [
          {
            name: "",
            desc: "",
            type: "audio",
            file: "",
          },
        ],
      });
    } else {
      if (podcast.name === "" || podcast.desc === "") {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    }
  }, [podcast]);
  const token = localStorage.getItem("castwavetoken");
  useEffect(() => {
    if (
      podcast.episodes.length > 0 &&
      podcast.episodes.every(
        (episode) =>
          episode.file !== "" &&
          episode.name !== "" &&
          episode.desc !== "" &&
          podcast.name !== "" &&
          podcast.desc !== "" &&
          podcast.tags !== "" &&
          podcast.image !== "" &&
          podcast.image !== undefined &&
          podcast.image !== null
      )
    ) {
      if (podcast.episodes.every((episode) => episode.file.name === undefined))
        setCreateDisabled(false);
      else setCreateDisabled(true);
    }
  }, [podcast]);
  const uploadFile = (file, index) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        podcast.episodes[index].file.uploadProgress = Math.round(progress);
        setPodcast({ ...podcast, episodes: podcast.episodes });
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {},
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const newEpisodes = podcast.episodes;
          newEpisodes[index].file = downloadURL;
          setPodcast({ ...podcast, episodes: newEpisodes });
        });
      }
    );
  };

  const goToAddEpisodes = () => {
    setShowEpisodes(true);
    // console.log("meee");
  };
  const [backDisabled, setBackDisabled] = useState(false);
  const [createDisabled, setCreateDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const goBack = () => {
    setShowEpisodes(false);
  };
  const createPodcast = async () => {
    // console.log(podcast);
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/podcast/",
        podcast,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      // console.log(res);
      setDisabled(true);
      setBackDisabled(true);
      setUploadOpen(false);
      setLoading(false);
      dispatch(
        openSnackbar({
          open: true,
          message: "Podcast uploaded successfully",
          severity: "success",
        })
      );
    } catch (error) {
      setDisabled(false);
      setBackDisabled(false);
      setLoading(false);
      console.log(error);
      dispatch(
        openSnackbar({
          open: true,
          message: "Error creating podcast",
          severity: "error",
        })
      );
    }
  };

  return (
    <Modal open={true} onClose={() => setUploadOpen(false)}>
      <Container>
        <Wrapper>
          <CloseRounded
            style={{
              position: "absolute",
              top: "24px",
              right: "30px",
              cursor: "pointer",
            }}
            onClick={() => {
              setUploadOpen(false);
            }}
          />
          <Title>Upload Podcast</Title>
          {!showEpisodes ? (
            <>
              <Label>Podcast Details</Label>
              <ImageSelector podcast={podcast} setPodcast={setPodcast} />
              <OutlinedBox style={{ marginTop: "12px" }}>
                <TextInput
                  type={"text"}
                  placeholder={"Podcast Name"}
                  value={podcast?.name}
                  onChange={(e) => {
                    setPodcast({ ...podcast, name: e.target.value });
                  }}
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: "6px" }}>
                <Desc
                  name={"desc"}
                  placeholder={"Podcast Decription"}
                  rows={5}
                  value={podcast?.desc}
                  onChange={(e) => {
                    setPodcast({ ...podcast, desc: e.target.value });
                  }}
                />
              </OutlinedBox>
              <OutlinedBox style={{ marginTop: "6px" }}>
                <Desc
                  name={"tags"}
                  placeholder={"Tags Separate By..."}
                  rows={4}
                  value={podcast?.tags}
                  onChange={(e) => {
                    setPodcast({ ...podcast, tags: e.target.value.split(",") });
                  }}
                />
              </OutlinedBox>
              <div style={{ display: "flex", width: "100%", gap: "6px" }}>
                <OutlinedBox
                  style={{
                    marginTop: "6px",
                    width: "100%",
                    marginRight: "0px",
                  }}
                >
                  <Select
                    onChange={(e) => {
                      setPodcast({ ...podcast, type: e.target.value });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Option value={"audio"}>Audio</Option>
                    <Option value={"video"}>Video</Option>
                  </Select>
                </OutlinedBox>
                <OutlinedBox
                  style={{
                    marginTop: "6px",
                    width: "100%",
                    marginRight: "0px",
                  }}
                >
                  <Select
                    onChange={(e) => {
                      setPodcast({ ...podcast, category: e.target.value });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <Option value={Category[0].name} selected disabled hidden>
                      Select Category
                    </Option>
                    {Category.map((item) => (
                      <Option value={item.name} key={item.name}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </OutlinedBox>
              </div>
              <OutlinedBox
                button={true}
                activeButton={!disabled}
                style={{ marginTop: "22px", marginBottom: "18px" }}
                onClick={() => {
                  !disabled && goToAddEpisodes();
                }}
              >
                Next
              </OutlinedBox>
            </>
          ) : (
            <>
              <Label>Episode Details:</Label>
              {podcast.episodes.map((episode, index) => (
                <>
                  <FileUpload for={"fileField" + index}>
                    {podcast.episodes[index].file === "" ? (
                      <Uploading>
                        <BackupRounded />
                        Select Audio / Video
                      </Uploading>
                    ) : (
                      <Uploading>
                        {podcast.episodes[index].file?.name === undefined ? (
                          <div
                            style={{
                              color: "green",
                              display: "flex",
                              gap: "6px",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <CloudDoneRounded sx={{ color: "inherit" }} />
                            File Uploaded Successfully
                          </div>
                        ) : (
                          <>
                            File: {podcast.episodes[index].file.name}
                            <LinearProgress
                              sx={{
                                borderRadius: "10px",
                                height: 3,
                                width: "100%",
                              }}
                              variant="determinate"
                              value={
                                podcast.episodes[index].file.uploadProgress
                              }
                              color={"success"}
                            />
                            {podcast.episodes[index].file.uploadProgress}%
                            Uploaded
                          </>
                        )}
                      </Uploading>
                    )}
                  </FileUpload>
                  <File
                    type="file"
                    style={{ marginTop: "16px" }}
                    accept=".mp4, .mp3, .png, .jpg"
                    id={"fileField" + index}
                    onChange={(e) => {
                      podcast.episodes[index].file = e.target.files[0];
                      setPodcast({ ...podcast, episodes: podcast.episodes });
                      uploadFile(podcast.episodes[index].file, index);
                    }}
                  />
                  <OutlinedBox>
                    <TextInput
                      placeholder="Episode Name"
                      value={episode.name}
                      type="text"
                      onChange={(e) => {
                        podcast.episodes[index].name = e.target.value;
                        setPodcast({ ...podcast, episodes: podcast.episodes });
                      }}
                    />
                  </OutlinedBox>
                  <OutlinedBox style={{ marginTop: "6px" }}>
                    <Desc
                      placeholder="Episodes Description"
                      name="desc"
                      rows={5}
                      value={episode.desc}
                      onChange={(e) => {
                        podcast.episodes[index].desc = e.target.value;
                        setPodcast({ ...podcast, episodes: podcast.episodes });
                      }}
                    />
                  </OutlinedBox>
                  <OutlinedBox
                    button={true}
                    activeButton={false}
                    style={{
                      marginTop: "6px",
                      marginBottom: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setPodcast({
                        ...podcast,
                        episodes: podcast.episodes.filter(
                          (_, i) => i !== index
                        ),
                      })
                    }
                  >
                    Delete
                  </OutlinedBox>
                  <OutlinedBox
                    button={true}
                    activeButton={true}
                    style={{
                      marginTop: "6px",
                      marginBottom: "12px",
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setPodcast({
                        ...podcast,
                        episodes: [
                          ...podcast.episodes,
                          { name: "", desc: "", file: "" },
                        ],
                      })
                    }
                  >
                    Add Episode
                  </OutlinedBox>

                  <ButtonContainer>
                    <OutlinedBox
                      button={true}
                      activeButton={false}
                      style={{
                        marginTop: "6px",
                        width: "100%",
                        margin: 0,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        !backDisabled && goBack();
                      }}
                    >
                      Back
                    </OutlinedBox>
                    <OutlinedBox
                      button={true}
                      activeButton={true}
                      style={{
                        marginTop: "6px",
                        width: "100%",
                        margin: 0,
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        !disabled && createPodcast();
                      }}
                    >
                      {loading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        "Create"
                      )}
                    </OutlinedBox>
                  </ButtonContainer>
                </>
              ))}
            </>
          )}
        </Wrapper>
      </Container>
    </Modal>
  );
};

export default Upload;
