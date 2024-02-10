/* eslint-disable react/prop-types */
import styled from "styled-components";
import logo from "../images/Logo.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { openSignin } from "../redux/setSignInSlice";
import { logout } from "../redux/userSlice";
import { openSnackbar } from "../redux/snackbarSlices";
import {
  CloseRounded,
  FavoriteRounded,
  HomeRounded,
  LogoutRounded,
  SearchRounded,
  UploadSharp,
} from "@mui/icons-material";
const MenuContainer = styled.div`
  flex: 0.5;
  flex-direction: column;
  height: 100vh;
  display: flex;
  box-sizing: border-box;
  align-items: flex-start;
  width: 200px;
  background-color: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.text_primary};
  @media (max-width: 1100px) {
    position: fixed;
    z-index: 1000;
    width: 100%;
    max-width: 250px;
    left: ${({ menuOpen }) => (menuOpen ? "0" : "-100%")};
    transition: 0.3s ease-in-out;
  }
`;
const Close = styled.div`
  display: none;
  @media (max-width: 1100px) {
    display: block;
  }
  cursor: pointer;
`;
const Flex = styled.div`
  justify-content: center;
  display: flex;
  align-items: center;
  padding: 0px 16px;
  width: 86%;
`;
const Logo = styled.div`
  color: ${({ theme }) => theme.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: bold;
  font-size: 20px;
  margin: 16px 0px;
`;
const Elements = styled.div`
  padding: 4px 16px;
  display: flex;
  font-size: 2em
  flex-direction: row;
  box-sizing: border-box;
  justify-content: flex-start;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: ${({ theme }) => theme.text_secondary};
  width: 100%;
  &:hover {
    background-color: ${({ theme }) => theme.text_secondary + 50};
  }
`;
const Image = styled.img`
  height: 40px;
  padding-right: 10px;
`;
const NavText = styled.div`
  padding: 12px 0px;
`;

const Break = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${({ theme }) => theme.text_secondary};
  //   margin: 0px 10px;
`;

const Sidebar = ({ setMenuOpen, menuOpen, setUploadOpen }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const menuItems = [
    {
      link: "/",
      name: "Dashboard",
      icons: <HomeRounded />,
    },
    {
      link: "/search",
      name: "Search",
      icons: <SearchRounded />,
    },
    {
      link: "/favourites",
      name: "Favourites",
      icons: <FavoriteRounded />,
    },
  ];

  const Navigate = useNavigate();
  const buttonItems = [
    {
      fun: () => {
        if (currentUser) {
          setUploadOpen(true);
        } else {
          dispatch(openSignin());
        }
      },
      name: "Upload",
      icons: <UploadSharp />,
    },
    // {
    //   fun: () => {
    //     console.log(theme === lightTheme ? "light" : "dark");
    //     setTheme(theme === lightTheme ? darkTheme : lightTheme);
    //     setDarkMode(!darkMode);
    //   },
    //   name: darkMode ? "Light Mode" : "Dark Mode",
    //   icons: darkMode ? <FcIdea /> : <FcLightAtTheEndOfTunnel />,
    // },
    {
      fun: () => {
        dispatch(logout());
        dispatch(
          openSnackbar({
            message: "Logged Out Successfully",
            severity: "success",
          })
        );
        Navigate("/");
      },
      name: "Log Out",
      icons: <LogoutRounded />,
    },
  ];
  return (
    <div>
      <MenuContainer menuOpen={menuOpen}>
        <Flex>
          <Image src={logo} />
          <Logo
            onClick={() => {
              Navigate("/");
            }}
            style={{ cursor: "pointer" }}
          >
            CASTWAVE
          </Logo>
          <Close>
            <CloseRounded onClick={() => setMenuOpen(false)} />
          </Close>
        </Flex>
        {menuItems.map((item, key) => (
          <Elements
            key={key}
            onClick={() => {
              Navigate(item.link);
            }}
          >
            {item.icons}
            <NavText>{item.name}</NavText>
          </Elements>
        ))}
        <Break />
        {buttonItems.map((item, key) => (
          <Elements key={key} onClick={item.fun}>
            {item.icons}
            <NavText>{item.name}</NavText>
          </Elements>
        ))}
      </MenuContainer>
    </div>
  );
};

export default Sidebar;
