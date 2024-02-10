/* eslint-disable react/prop-types */
// import { useEffect, useState } from "react";
// import styled, { ThemeProvider } from "styled-components";
// import {
//   lightTheme,
//   darkTheme,
//   MidnightHorizon,
//   OceanBreeze,
//   DesertMirage,
//   EnchantedForest,
//   RubyElegance,
//   GalacticNebula,
//   SunsetSerenity,
//   MysticAurora,
//   VintageCharm,
//   CyberFusion,
//   CelestialHarmony,
//   TwilightReverie,
// } from "./Utils/Themes";
// import Sidebar from "./Components/Sidebar";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import Navbar from "./Components/Navbar";
// import Dashboard from "./Pages/Dashboard";
// import Search from "./Pages/Search";
// import Favourites from "./Pages/Favourites";
// import Profile from "./Pages/Profile";
// import Podcast from "./Pages/Podcast";
// import DisplayPodcast from "./Pages/DisplayPodcast";
// import Signup from "./Components/Signup";
// import { useSelector } from "react-redux";
// import Signin from "./Components/SignIn";
// import ToastMessage from "./Components/ToastMessage";
// import { useDispatch } from "react-redux";
// import { closeSignin } from "./redux/setSignInSlice";
// import ThemeComponent from "./Components/ThemeComponent";
// import Upload from "./Components/Upload";
// import VideoPlayer from "./Components/videoPlayer";
// import AudioPlayer from "./Components/AudioPlayer";
// function App() {
//   const Container = styled.div`
//     display: flex;
//     flex-direction: row;
//     width: 100%;
//     height: 100vh;
//     background: ${({ theme }) => theme.bgLight};
//     overflow-y: hidden;
//     overflow-x: hidden;
//   `;
//   const Frame = styled.div`
//     display: flex;
//     flex-direction: column;
//     flex: 3;
//   `;
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [SignUpOpen, setSignUpOpen] = useState(false);
//   const [SignInOpen, setSignInOpen] = useState(false);
//   const { opensi } = useSelector((state) => state.signin);
//   const [theme, setTheme] = useState(darkTheme);
//   const [uploadOpen, setUploadOpen] = useState(false);
//   const { open, message, severity } = useSelector((state) => state.snackbar);
//   const { openplayer, type, episode, podid, currenttime, index } = useSelector(
//     (state) => state.audioplayer
//   );
//   // const [darkMode, setDarkMode] = useState(true);

//   const [selectedTheme, setSelectedTheme] = useState("dark");

//   const themes = {
//     light: lightTheme,
//     dark: darkTheme,
//     MidnightHorizon: MidnightHorizon,
//     OceanBreeze: OceanBreeze,
//     DesertMirage: DesertMirage,
//     EnchantedForest: EnchantedForest,
//     RubyElegance: RubyElegance,
//     GalacticNebula: GalacticNebula,
//     SunsetSerenity: SunsetSerenity,
//     MysticAurora: MysticAurora,
//     VintageCharm: VintageCharm,
//     CyberFusion: CyberFusion,
//     CelestialHarmony: CelestialHarmony,
//     TwilightReverie: TwilightReverie,
//   };
//   const handleThemeChange = (theme) => {
//     setSelectedTheme(theme);
//     setTheme(themes[theme]);
//   };
//   useEffect(() => {
//     const resize = () => {
//       if (window.innerWidth < 1110) {
//         setMenuOpen(false);
//       } else {
//         setMenuOpen(true);
//       }
//     };
//     resize();
//     window.addEventListener("resize", resize);
//     return () => window.removeEventListener("resize", resize);
//   }, []);
//   const dispatch = useDispatch();
//   useEffect(() => {
//     dispatch(closeSignin());
//   }, []);

//   // console.log(openplayer, type, episode, podid, currenttime, index);
//   return (
//     <ThemeProvider theme={theme}>
//       <BrowserRouter>
//         {opensi && (
//           <Signin setSignUpOpen={setSignUpOpen} setSignInOpen={setSignInOpen} />
//         )}
//         {SignUpOpen && (
//           <Signup setSignUpOpen={setSignUpOpen} setSignInOpen={setSignInOpen} />
//         )}
//         {uploadOpen && <Upload setUploadOpen={setUploadOpen} />}
//         {openplayer && type === "video" && (
//           <VideoPlayer
//             episode={episode}
//             podid={podid}
//             currenttime={currenttime}
//             index={index}
//           />
//         )}
//         {openplayer && type === "audio" && (
//           <AudioPlayer
//             episode={episode}
//             podid={podid}
//             currenttime={currenttime}
//             index={index}
//           />
//         )}
//         <Container>
//           {menuOpen && (
//             <Sidebar
//               setMenuOpen={setMenuOpen}
//               menuOpen={menuOpen}
//               setUploadOpen={setUploadOpen}
//             />
//           )}
//           <Frame>
//             <Navbar setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
//             <Routes>
//               <Route path="/" exact element={<Dashboard />} />
//               <Route path="/search" exact element={<Search />} />
//               <Route path="/favourites" exact element={<Favourites />} />
//               <Route path="/profile" exact element={<Profile />} />
//               <Route path="/podcast/:id" exact element={<Podcast />} />
//               <Route
//                 path="/showpodcasts/:type"
//                 exact
//                 element={<DisplayPodcast />}
//               />
//             </Routes>
//             <ThemeComponent
//               selectedTheme={selectedTheme}
//               handleThemeChange={handleThemeChange}
//             />
//           </Frame>
//           {open && (
//             <ToastMessage open={open} message={message} severity={severity} />
//           )}
//         </Container>
//       </BrowserRouter>
//     </ThemeProvider>
//   );
// }

// export default App;

import { ThemeProvider } from "styled-components";
import { useState, useEffect } from "react";
import {
  lightTheme,
  darkTheme,
  MidnightHorizon,
  OceanBreeze,
  DesertMirage,
  EnchantedForest,
  RubyElegance,
  GalacticNebula,
  SunsetSerenity,
  MysticAurora,
  VintageCharm,
  CyberFusion,
  CelestialHarmony,
  TwilightReverie,
} from "./Utils/Themes";
import Signup from "../src/Components/Signup.jsx";
import Signin from "../src/Components/SignIn.jsx";
import Navbar from "../src/Components/Navbar.jsx";
import Dashboard from "../src/Pages/Dashboard.jsx";
import ToastMessage from "./Components/ToastMessage.jsx";
import Search from "../src/Pages/Search.jsx";
import Favourites from "../src/Pages/Favourites.jsx";
import Profile from "../src/Pages/Profile.jsx";
import Upload from "../src/Components/Upload.jsx";
import DisplayPodcasts from "../src/Pages/DisplayPodcast.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import AudioPlayer from "./Components/AudioPlayer.jsx";
import VideoPlayer from "./Components/VideoPlayer.jsx";
import ThemeComponent from "./Components/ThemeComponent";
import { closeSignin } from "./redux/setSignInSlice.jsx";
import Podcast from "./Pages/Podcast.jsx";
import Sidebar from "../src/Components/Sidebar.jsx";

const Frame = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
`;

const Podstream = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.bgLight};
  overflow-y: hidden;
  overflow-x: hidden;
`;

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const { open, message, severity } = useSelector((state) => state.snackbar);
  const { openplayer, type, episode, podid, currenttime, index } = useSelector(
    (state) => state.audioplayer
  );
  const { opensi } = useSelector((state) => state.signin);
  const [SignUpOpen, setSignUpOpen] = useState(false);
  const [SignInOpen, setSignInOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [theme, setTheme] = useState(darkTheme);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("dark");

  const themes = {
    light: lightTheme,
    dark: darkTheme,
    MidnightHorizon: MidnightHorizon,
    OceanBreeze: OceanBreeze,
    DesertMirage: DesertMirage,
    EnchantedForest: EnchantedForest,
    RubyElegance: RubyElegance,
    GalacticNebula: GalacticNebula,
    SunsetSerenity: SunsetSerenity,
    MysticAurora: MysticAurora,
    VintageCharm: VintageCharm,
    CyberFusion: CyberFusion,
    CelestialHarmony: CelestialHarmony,
    TwilightReverie: TwilightReverie,
  };

  const { currentUser } = useSelector((state) => state.user);
  const handleThemeChange = (theme) => {
    setSelectedTheme(theme);
    setTheme(themes[theme]);
  };
  const dispatch = useDispatch();
  //set the menuOpen state to false if the screen size is less than 768px
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 1110) {
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    dispatch(closeSignin());
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        {opensi && (
          <Signin setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
        )}
        {SignUpOpen && (
          <Signup setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
        )}
        {uploadOpen && <Upload setUploadOpen={setUploadOpen} />}
        {openplayer && type === "video" && (
          <VideoPlayer
            episode={episode}
            podid={podid}
            currenttime={currenttime}
            index={index}
          />
        )}
        {openplayer && type === "audio" && (
          <AudioPlayer
            episode={episode}
            podid={podid}
            currenttime={currenttime}
            index={index}
          />
        )}
        <Podstream>
          {menuOpen && (
            <Sidebar
              setMenuOpen={setMenuOpen}
              menuOpen={menuOpen}
              setUploadOpen={setUploadOpen}
            />
          )}
          <Frame>
            <Navbar
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              setSignInOpen={setSignInOpen}
              setSignUpOpen={setSignUpOpen}
            />
            <Routes>
              <Route path="/" exact element={<Dashboard />} />
              <Route path="/search" exact element={<Search />} />
              <Route path="/favourites" exact element={<Favourites />} />
              <Route path="/profile" exact element={<Profile />} />
              <Route path="/podcast/:id" exact element={<Podcast />} />
              <Route
                path="/showpodcasts/:type"
                exact
                element={<DisplayPodcasts />}
              />
            </Routes>
            <ThemeComponent
              selectedTheme={selectedTheme}
              handleThemeChange={handleThemeChange}
            />
          </Frame>

          {open && (
            <ToastMessage open={open} message={message} severity={severity} />
          )}
        </Podstream>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
