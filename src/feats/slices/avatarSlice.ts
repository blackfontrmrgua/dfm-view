import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { avatarParts } from "../../avatar"

import _initState from "./initStateN.json"
const avatarInit = _initState.Avatar as AvatarState

export const avatarSlice = createSlice({
  name: "Avatar",
  initialState: avatarInit,
  reducers: {
    SetAvatarRarity: (s, { payload: [part, rarity] }: PayloadAction<[WearAvatarPart, "Uncommon" | "Rare"]>) => {
      s[part] = rarity
    },
    SetAvatarTypeAll: (s, { payload }: PayloadAction<"Uncommon" | "Rare">) => {
      avatarParts.forEach(part => s[part] = payload)
    }
  }
})

export const {
  SetAvatarRarity,
  SetAvatarTypeAll,
} = avatarSlice.actions






