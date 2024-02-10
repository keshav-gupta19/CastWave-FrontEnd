import styled from "styled-components";
import PodcastCard from "../Components/PodcastCard";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { CircularProgress } from "@mui/material";

const DashboardMain = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 6px 10px;
  }
`;
const FilterComponent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.bg};
  border-radius: 10px;
  padding: 20px 30px;
`;
const Topic = styled.div`
  color: ${({ theme }) => theme.text_primary};
  font-size: 24px;
  font-weight: 540;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;
const Span = styled.div`
  color: ${({ theme }) => theme.text_secondary};
  font-size: 16px;
  font-weight: 400;
  cursor: pointer;
  @media (max-width: 768px) {
    font-size: 14px;
  }
  color: ${({ theme }) => theme.primary};
  &:hover {
    transition: 0.2s ease-in-out;
  }
`;
const Podcasts = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;
const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
const Dashboard = () => {
  const [mostPopular, setMostPopular] = useState([]);
  const [user, setUser] = useState("");
  const [comedy, setComedy] = useState([]);
  const [news, setNews] = useState([]);
  const [sports, setSports] = useState([]);
  const [crime, setCrime] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [Loading, setLoading] = useState(false);
  const Navigate = useNavigate();

  const token = localStorage.getItem("castwavetoken");
  const getPopularPodcast = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/podcast/mostpopular"
      );
      setMostPopular(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getComedyPodcasts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/podcast/category?q=comedy`
      );
      setComedy(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getNewsPodcasts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/podcast/category?q=news`
      );
      setNews(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getSportsPodcasts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/podcast/category?q=sports`
      );
      setSports(res.data);
      // console.log("hell", res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getCrimePodcasts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/podcast/category?q=crime`
      );
      setCrime(res.data);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUser = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/users/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllData = async () => {
    setLoading(true);
    try {
      if (currentUser) {
        setLoading(true);
        await getUser();
      }
      await getPopularPodcast();
      await getComedyPodcasts();
      await getCrimePodcasts();
      await getSportsPodcasts();
      await getNewsPodcasts();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllData();
  }, [currentUser]);

  // console.log("crime", crime);
  // console.log("news", news);
  // console.log("sports", sports);
  // console.log("comedy", comedy);
  return (
    <DashboardMain>
      {Loading ? (
        <>
          <Loader>
            <CircularProgress />
          </Loader>
        </>
      ) : (
        <>
          {currentUser && user?.podcasts?.length > 0 && (
            <>
              {/* {console.log("yaha")} */}
              <FilterComponent box={true}>
                <Topic>
                  Your Uploads
                  <Link to={"/profile"} style={{ textDecoration: "none" }}>
                    <Span>Show All</Span>
                  </Link>
                </Topic>
                <Podcasts>
                  {user?.podcasts?.map((podcast, key) => (
                    <PodcastCard podcast={podcast} key={key} user={user} />
                  ))}
                </Podcasts>
              </FilterComponent>
            </>
          )}
          <FilterComponent>
            <Topic>
              Most Popular
              <Span
                onClick={() => {
                  Navigate("/showpodcasts/mostpopular");
                }}
              >
                Show all
              </Span>
            </Topic>
            <Podcasts>
              {mostPopular.slice(0, 10).map((podcast, key) => (
                <PodcastCard podcast={podcast} user={user} key={key} />
              ))}
            </Podcasts>
          </FilterComponent>
          <FilterComponent>
            <Topic>
              Comedy
              <Span
                onClick={() => {
                  Navigate("/showpodcasts/comedy");
                }}
              >
                Show all
              </Span>
            </Topic>
            <Podcasts>
              {comedy.slice(0, 10).map((podcast, key) => (
                <PodcastCard podcast={podcast} user={user} key={key} />
              ))}
            </Podcasts>
          </FilterComponent>
          <FilterComponent>
            <Topic>
              News
              <Span
                onClick={() => {
                  Navigate("/showpodcasts/news");
                }}
              >
                Show all
              </Span>
            </Topic>
            <Podcasts>
              {news.slice(0, 10).map((podcast, key) => (
                <PodcastCard podcast={podcast} user={user} key={key} />
              ))}
            </Podcasts>
          </FilterComponent>
          <FilterComponent>
            <Topic>
              Crime
              <Span
                onClick={() => {
                  Navigate("/showpodcasts/crime");
                }}
              >
                Show all
              </Span>
            </Topic>
            <Podcasts>
              {crime.slice(0, 10).map((podcast) => {
                <PodcastCard podcast={podcast} user={user} />;
              })}
            </Podcasts>
          </FilterComponent>
          <FilterComponent>
            <Topic>
              Sports
              <Span
                onClick={() => {
                  Navigate("/showpodcasts/sports");
                }}
              >
                Show all
              </Span>
            </Topic>
            <Podcasts>
              {sports.slice(0, 10).map((podcast, key) => (
                <PodcastCard podcast={podcast} user={user} key={key} />
              ))}
            </Podcasts>
          </FilterComponent>
        </>
      )}
    </DashboardMain>
  );
};

export default Dashboard;
