/* eslint-disable react/prop-types */
import styled from "styled-components";
import { MdMenu } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { openSignin } from "../redux/setSignInSlice";
import { Link } from "react-router-dom";
import { Avatar } from "@mui/material";
import {
  deepOrange,
  deepPurple,
  teal,
  indigo,
  pink,
  red,
  blue,
  green,
  yellow,
  amber,
  lime,
  brown,
  orange,
  cyan,
  lightGreen,
  purple,
  lightBlue,
} from "@mui/material/colors";
const NavbarDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  color: ${({ theme }) => theme.text_primary};
  background-color: ${({ theme }) => theme.bgLight};
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5.7px);
  -webkit-backdrop-filter: blur(5.7px);
  @media (max-width: 768px) {
    padding: 16px;
  }
`;
const ButtonDiv = styled.div`
  border: 2px solid ${({ theme }) => theme.primary};
  font-size: 14px;
  display: flex;
  text-decoration: none;
  max-width: 70px;
  align-items: center;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
  border-radius: 8px;
  padding: 8px 10px;
  &:hover {
    color: ${({ theme }) => theme.text_secondary};
    background-color: ${({ theme }) => theme.primary};
  }
`;

const MenuIcon = styled.div`
  font-size: 25px;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};
`;
const HeadingName = styled.div`
  font-size: 1.5em;
  font-weight: bold;
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const getRandomColor = () => {
  const colors = [
    deepOrange[500],
    deepPurple[500],
    teal[500],
    indigo[500],
    pink[500],
    red[500],
    blue[500],
    green[500],
    yellow[500],
    amber[500],
    lime[500],
    brown[500],
    orange[500],
    cyan[500],
    lightGreen[500],
    purple[500],
    deepOrange[500],
    lightBlue[500],
    lime[500],
    amber[500],
    lightBlue[500],
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const Navbar = ({ setMenuOpen, menuOpen }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  return (
    <NavbarDiv>
      <MenuIcon onClick={() => setMenuOpen(!menuOpen)}>
        <MdMenu />
      </MenuIcon>
      {currentUser ? (
        <>
          <HeadingName>Welcome, {currentUser.name}</HeadingName>
        </>
      ) : (
        <>&nbsp;</>
      )}
      {currentUser ? (
        <>
          <Link to={"/profile"} style={{ textDecoration: "none" }}>
            <Avatar src={currentUser.img} sx={{ bgcolor: getRandomColor() }}>
              {currentUser?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </Link>
        </>
      ) : (
        <>
          <ButtonDiv
            onClick={() => {
              dispatch(openSignin());
            }}
          >
            <IoMdPerson />
            Login
          </ButtonDiv>
        </>
      )}
    </NavbarDiv>
  );
};

export default Navbar;
