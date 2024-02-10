import styled from "styled-components";
import SearchCard from "../Components/SearchCard";
import { FcSearch } from "react-icons/fc";
import { Category } from "../Utils/Data";
import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../redux/snackbarSlices";
import { CircularProgress } from "@mui/material";
import TopResult from "../Components/TopResult";
import MoreResult from "../Components/MoreResult";
import { Link } from "react-router-dom";
const SearchContainer = styled.div`
  padding: 20px 30px;
  padding-bottom: 200px;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  gap: 20px;
  @media (max-width: 768px) {
    padding: 20px 9px;
  }
`;
const SearchBox = styled.div`
  display: flex;
  width: 100%;
  height: 30px;
  max-width: 700px;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  border-radius: 30px;
  cursor: pointer;
  padding: 12px 16px;
  justify-content: flex-start;
  align-items: center;
  gap: 6px;
  color: ${({ theme }) => theme.text_secondary};
`;
const Topic = styled.div`
  align-items: flex-start;
  color: ${({ theme }) => theme.text_primary};
  font-size: 22px;
  font-weight: 540;
  margin: 10px 14px;
`;
const Cards = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  padding: 14px;
`;
const Categories = styled.div`
  margin: 20px 10px;
`;
const Flexed = styled.div`
  display: flex;
  justify-content: center;
  height: 30px;
`;
const Loader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;
const DisplayNo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  color: ${({ theme }) => theme.text_primary};
`;
const OtherResults = styled.div`
  display: flex;
  flex-direction: column;
  height: 700px;
  overflow-y: scroll;
  overflow-x: hidden;
  gap: 6px;
  padding: 4px 4px;
  @media (max-width: 768px) {
    height: 100%;
    padding: 4px 0px;
  }
`;
const SearchedCards = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  padding: 14px;
  @media (max-width: 768px) {
    flex-direction: column;
    justify-content: center;
    padding: 6px;
  }
`;
const Search = () => {
  const [searched, setSearched] = useState("");
  const [searchedPodcasts, setSearchedPodcasts] = useState([]);
  const [Loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleChange = async (e) => {
    try {
      setSearched(e.target.value);
      setLoading(true);
      setSearchedPodcasts([]);
      const res = await axios.get(
        `http://localhost:3000/api/podcast/search?q=${e.target.value}`
      );
      // console.log(res.data);
      setLoading(false);
      setSearchedPodcasts(res.data);
    } catch (error) {
      setLoading(false);
      dispatch(
        openSnackbar({
          message: error.message,
          severity: "error",
        })
      );
    }
  };

  return (
    <>
      <SearchContainer>
        <Flexed>
          <SearchBox>
            <FcSearch />
            <input
              type="text"
              placeholder="Search Artist/Podcasts"
              style={{
                border: "none",
                outline: "none",
                borderRadius: "20px",
                width: "100%",
                background: "inherit",
                color: "inherit",
              }}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </SearchBox>
        </Flexed>
        {searched === "" ? (
          <>
            {" "}
            <Categories>
              <Topic>Browse All</Topic>
              <Cards>
                {Category.map((item, key) => (
                  <Link
                    to={`/showpodcasts/${item.name.toLowerCase()}`}
                    key={key}
                    style={{ textDecoration: "none" }}
                  >
                    <SearchCard category={item} key={key} />
                  </Link>
                ))}
              </Cards>
            </Categories>
          </>
        ) : (
          <>
            {Loading ? (
              <>
                <Loader>
                  <CircularProgress />
                </Loader>
              </>
            ) : (
              <>
                <SearchedCards>
                  {searchedPodcasts.length === 0 ? (
                    <>
                      <DisplayNo>No Podcasts Found</DisplayNo>
                    </>
                  ) : (
                    <>
                      <TopResult podcast={searchedPodcasts[0]} />
                      <OtherResults>
                        {searchedPodcasts.map((podcast) => (
                          <MoreResult podcast={podcast} key={podcast} />
                        ))}
                      </OtherResults>
                    </>
                  )}
                </SearchedCards>
              </>
            )}
          </>
        )}
      </SearchContainer>
      ;
    </>
  );
};

export default Search;
