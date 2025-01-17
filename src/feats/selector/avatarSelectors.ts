import { createSelector } from "@reduxjs/toolkit"
import { combine } from "../../attrs"
import { RootState } from "../store"
import { avatarParts, rareSet, UncommonSet, getAvatarAttr } from "../../avatar"
import { selectItem, selectCard, selectEmblems } from "./equipSelectors"

/** 지금 착용중인 레어 아바타의 수를 선택한다. */
export function selectRareAvatarCount(state: RootState) {
  return avatarParts
    .map(part => state.My.Avatar[part])
    .reduce((n, rarity) => rarity === "Rare" ? n + 1 : n, 0)
}

/** 지금 착용중인 언커먼 아바타의 수를 선택한다. */
export function selectUncommonAvatarCount(state: RootState) {
  return avatarParts
    .map(part => state.My.Avatar[part])
    .reduce((n, rarity) => rarity === "Uncommon" ? n + 1 : n, 0)
}

const asetMaker = (catalog: Record<number, BaseAttrs>, name: string) => 
(count: number): (AttrSource | undefined) => {
  if (count > 0) {
    const r = Object.keys(catalog).filter(i => (Number(i) <= count)).map(i => catalog[Number(i)])
    if (r.length > 0) 
    return {
      name : `${name} [${count}]`,
      attrs: combine(...r)
    }
  }
  return undefined
}

/** 지금 착용중인 아바타 8부위 효과를 선택한다. */
export function selectWearAvatarsCombined(state: RootState): AttrSource {
  return {
    name: "아바타",
    attrs: combine(...avatarParts.map(p => getAvatarAttr(p, state.My.Avatar[p])))
  } as AttrSource
}


/** 지금 착용중인 레어아바타 세트효과를 선택한다. */
export const selectRareAvatarSetActive = createSelector(
  selectRareAvatarCount,
  asetMaker(rareSet, "레어아바타 세트효과")
)

/** 지금 착용중인 상급아바타 세트효과를 선택한다. */
export const selectUncommonAvatarSetActive = createSelector(
  selectUncommonAvatarCount,
  asetMaker(UncommonSet, "상급아바타 세트효과")
)

/** 지금 착용중인 아바타로부터 아바타 세트 효과를 선택한다. */
// export const selectAvatarSet = createSelector(
//   selectUncommonAvatarCount,
//   selectRareAvatarCount,
//   (uncommonCount, rareCount) => {
//     const name = ["아바타 세트 효과"]
//     if (rareCount > 0) name.push(`레어[${rareCount}]`)
//     if (uncommonCount > 0) name.push(`언커먼[${uncommonCount}]`)
//     const r = Object.keys(rareSet).filter(i => (Number(i) <= rareCount)).map(i => rareSet[Number(i)])
//     const u = Object.keys(UncommonSet).filter(i => (Number(i) <= uncommonCount)).map(i => UncommonSet[Number(i)])
//     return {
//       name: name.join(" "),
//       attrs: combine(...r, ...u)
//     } as AttrSource
//   }
// )

/** 칭호를 장착 중일 때, 그 칭호 + 칭호에 박은 보주 + 엠블렘을 선택한다. */
export const selectDFTitleTown = createSelector(
  selectItem["칭호"],
  selectCard["칭호"],
  selectEmblems["칭호"],
  (dftitle, card, emblem): AttrSource[] => {
    if (!dftitle) return []
    return [dftitle, card, ...emblem]
  }
)


/** 칭호+오라+무기아바타+다른 아바타 효과+아바타 세트효과를 모두 선택한다. */
export const selectAvatars = createSelector(
  selectDFTitleTown,
  selectWearAvatarsCombined,
  selectRareAvatarSetActive,
  selectUncommonAvatarSetActive,
  selectItem["무기아바타"],
  selectItem["오라"],
  (dftitle, wears, asetRare, asetUnco, weaponAvatar, aura) => 
  [
    ...dftitle,
    aura,
    weaponAvatar,
    wears,
    asetRare,
    asetUnco
  ]
)
