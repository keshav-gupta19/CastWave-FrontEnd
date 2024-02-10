import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  openplayer: false,
  type: "audio",
  episode: null,
  podid: null,
  currenttime: 0,
  index: 0,
};

const audioplayer = createSlice({
  name: "audioplayer",
  initialState,
  reducers: {
    openplayer: (state, action) => {
      state.openplayer = true;
      state.type = action.payload.type;
      state.episode = action.payload.episode;
      state.podid = action.payload.podid;
      state.currenttime = action.payload.currenttime;
      state.index = action.payload.index;
    },
    closePlayer: (state) => {
      state.openplayer = false;
    },
    setCurrentTime: (state, action) => {
      state.currenttime = action.payload.currenttime;
    },
  },
});

export const { openplayer, closePlayer, setCurrentTime } = audioplayer.actions;

export default audioplayer.reducer;
