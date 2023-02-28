import { collectSpecial, combine, elMap2, percent_inc_mul, whatElType } from "./attrs"
import { RootState } from "./feats/store"
import { getActiveISetAttrs, getArmorBase, countISetsFrom, getItem, armorParts, equipParts, getActiveBranch, isActiveGives, getActiveExclusive, getBlessing, isArmorPart } from "./items"
import { getEmblem } from "./emblem"
import { getMagicPropsAttrs } from "./magicProps"
import { createSelector } from "@reduxjs/toolkit"
import { explode } from "./utils"
import { selectWholeAvatarAttrs } from "./feats/avatarSelectors"


export function selectArmorUpgradeValues(state: RootState): [boolean, number] {
  const value = Math.max(...armorParts.map(p => state.Equips[p].upgrade))
  const synced = armorParts.every(v => state.Equips[v].upgrade === value)
  return [synced, value]
}

export function selectAccessUpgradeValues(state: RootState): [boolean, number] {
  const value = Math.max(...["팔찌", "목걸이", "반지"].map(p => state.Equips[p].upgrade))
  const synced = ["팔찌", "목걸이", "반지"].every(v => state.Equips[v].upgrade === value)
  return [synced, value]
}


function magicPropsSelector(part: EquipPart) {
  return (state: RootState) => {
    const { name, magicProps } = state.Equips[part]
    if (name == null) return {} 
    const species = getItem(name)
    const { level, rarity } = species
    const array = magicProps.map((name, index) => getMagicPropsAttrs(name, part, level, rarity, index == 0))
    if (rarity != "Epic") array.shift()
    return combine(...array)
  }
}

const selectMagicProps = {
  "무기": magicPropsSelector("무기"),
  "상의": magicPropsSelector("상의"),
  "하의": magicPropsSelector("하의"),
  "머리어깨": magicPropsSelector("머리어깨"),
  "벨트": magicPropsSelector("벨트"),
  "신발": magicPropsSelector("신발"),
  "팔찌": magicPropsSelector("팔찌"),
  "목걸이": magicPropsSelector("목걸이"),
  "반지": magicPropsSelector("반지"),
  "보조장비": magicPropsSelector("보조장비")
}

/**
 * 주어진 아이템에서 "내가 체크한" 조건부 옵션들을 배열로 얻는다.
 * @param item 아이템일 수도 있고, 세트일 수도 있다. 하지만 `combine()`으로 만든거는 안된다
 */
function activeOptionalSelector(item: Attrs, state: RootState) {
  if (item == null) return []
  const array: BaseAttrs[] = []
  array.push(...getActiveBranch(item, state.Switch.branches))

  const gives = isActiveGives(item, state.Switch.gives)
  if (gives) array.push(gives)
  
  array.push(...getActiveExclusive(item, state.Switch.exclusives))
  return array
}


function armorBaseSelector(part: EquipPart) {
  return (state: RootState) => {
    const itemName = state.Equips[part as ArmorPart]
    const item = getItem(itemName.name)
    
    const { level, rarity } = item
    return getArmorBase(level, rarity, itemName.material, part as ArmorPart)
  }
}

const itsNotArmorPart = (state: RootState): BaseAttrs => ({})


export const selectArmorBase = {
  상의: armorBaseSelector("상의"),
  하의: armorBaseSelector("하의"),
  머리어깨: armorBaseSelector("머리어깨"),
  벨트: armorBaseSelector("벨트"),
  신발: armorBaseSelector("신발"),
  무기: itsNotArmorPart,
  팔찌: itsNotArmorPart,
  목걸이: itsNotArmorPart,
  반지: itsNotArmorPart,
  보조장비: itsNotArmorPart
}


function equipSelector(part: EquipPart) {
  return (state: RootState) => {
    const equipPart = state.Equips[part]
    const item = getItem(equipPart.name)
    const upgradeAttr = explode(equipPart.upgrade, part === "무기"? "atk" : "stat")
    const armorbase = selectArmorBase[part](state)
    return combine(item, armorbase, ...activeOptionalSelector(item, state), upgradeAttr, selectMagicProps[part](state), ...equipPart.emblems.map(getEmblem), getItem(equipPart.card))
  }
}

/** 어떤 한 장비 부의의 아이템 옵션, 활성화시킨 조건부 옵션, 업그레이드 보너스, 마법봉인, 엠블렘, 카드 옵션을 얻는다. */
export const selectWholeFromPart = {
  무기: equipSelector("무기"),
  상의: equipSelector("상의"),
  하의: equipSelector("하의"),
  머리어깨: equipSelector("머리어깨"),
  벨트: equipSelector("벨트"),
  신발: equipSelector("신발"),
  팔찌: equipSelector("팔찌"),
  목걸이: equipSelector("목걸이"),
  반지: equipSelector("반지"),
  보조장비: equipSelector("보조장비")
}

/**
 * 현재 착용한 장비들로부터 활성화되는 모든 세트 옵션을 얻는다.
 * 
 * { "<세트 이름>[<옵션 활성화에 필요했던 세트 수>]" : 세트 옵션 } 형식으로 얻는다.
 */
export function selectISetAttrs(state: RootState) {
  const isets = countISetsFrom(...equipParts.map(part => state.Equips[part].name))
  return getActiveISetAttrs(isets)
}


/** 지금 활성화된 세트로부터, on/off 여부를 불문하고 모든 가능한 조건부 옵션들을 얻는다. */
export function selectISetConditionalsAll(state: RootState) {
  const isets = selectISetAttrs(state)
  return collectSpecial(...Object.values(isets))

}

/** 지금 착용한 장비로부터 오는 모든 장비 효과, 장비에 바른 카드 효과, 엠블렘 효과, 강화 효과, 마법봉인 효과, 세트 효과 및 이들 중에서 내가 체크한 조건부 효과를 싸그리 긁어모은다. */
export function selectEquips(state: RootState) {

  /** 지금 활성화된 세트옵션들 */
  const isetattrs = selectISetAttrs(state)
  const J: Attrs[] = []
  for (const k in isetattrs) {
    J.push(isetattrs[k], ...activeOptionalSelector(isetattrs[k], state))
  }

  return combine(
    ...equipParts.map(part => selectWholeFromPart[part](state)),
    // ...armorParts.map(part => selectArmorBase[part](state)),
    ...J
  )
}





/** 크리쳐 효과 + 크리쳐 스킬 효과 + 아티팩트 효과 를 얻는다. */
export function selectCreatures(state: RootState): BaseAttrs {
  const
    stat = state.Creature.stat,
    skill_stat = state.Creature.skill.stat,
    skill_el_all = state.Creature.skill.el_all,
    skill_dmg_add = state.Creature.skill.dmg_add,
    stat_arti = state.Creature.Artifacts.stat,
    atk = state.Creature.Artifacts.atk,
    el_all = state.Creature.Artifacts.el_all,
    speed_atk = state.Creature.Artifacts.speed_atk,
    speed_cast = state.Creature.Artifacts.speed_cast
  return {
    strn: stat + skill_stat + stat_arti,
    intl: stat + skill_stat + stat_arti,
    vit: stat,
    psi: stat,
    ...explode(atk, "atk"),
    ...explode(el_all + skill_el_all, "el_all"),
    dmg_add : skill_dmg_add,
    speed_atk,
    speed_cast
  }
}







/** 마력결정 스탯보너스를 모두 얻는다. */
export function selectTonics(state: RootState): BaseAttrs {
  const { Accu, crit, def, el_all, hp_mp_max, strn_intl, vit_psi } = state.Tonic

  return {
    strn: strn_intl,
    intl: strn_intl,
    vit: vit_psi,
    psi: vit_psi,
    Accu,
    crit_ph: crit,
    crit_mg: crit,
    ...explode(el_all, "el_all"),
    def_ph: def,
    def_mg: def,
    hpmax: hp_mp_max,
    mpmax: hp_mp_max
  }

}











/** 현재 장착중인 봉인석을 선택한다. */
export function selectRune(state: RootState) {
  return getItem(state.Crack.rune)
}

/** 현재 장착 중인 모든 정수를 선택한다. */
export function selectSpells(state: RootState) {
  return state.Crack.Spells.map(getItem)
}

/**
 * 현재 착용한 봉인석+정수로부터 활성화되는 모든 세트 옵션을 얻는다.
 * 
 * { "<세트 이름>[<옵션 활성화에 필요했던 세트 수>]" : 세트 옵션 } 형식으로 얻는다.
 */
export function selectCrackISetAttrs(state: RootState) {
  const isets = countISetsFrom(state.Crack.rune, ...state.Crack.Spells)
  return getActiveISetAttrs(isets)
}

/**
 * 현재 착용한 봉인석+정수로부터 활성화되는 가호를 얻는다.
 */
export const selectBlessing = createSelector(
  selectRune,
  selectSpells,
  (rune, spells) => {
    return getBlessing(rune, ...spells)
  }
)

/** 성안의 봉인에서 오는 모든 효과를 얻는다. */
export const selectCracksAll = createSelector(
  selectRune,
  selectSpells,
  selectBlessing,
  selectCrackISetAttrs,
  (rune, spells, blessing, isetattr) => {
    return combine(rune, ...spells, blessing, ...Object.values(isetattr))
  }
)





export function selectGuilds(state: RootState): BaseAttrs {
  const { stat, atk, crit, el_all, speed_atk, Accu, guildPublicStatLv } = state.Guild
  return {
    strn: stat + guildPublicStatLv * 10,
    intl: stat + guildPublicStatLv * 10,
    atk_ph: atk,
    atk_mg: atk,
    crit_ph: crit,
    crit_mg: crit,
    ...explode(el_all, "el_all"),
    speed_atk,
    Accu
  }
}


export function selectCalibrated(state: RootState) {
  const sk_inc = state.Calibrate.sk_inc.reduce(percent_inc_mul, 0)
  return { ...state.Calibrate, sk_inc }
}

export const selectMeWithoutCalibrate = createSelector(
  selectEquips, selectWholeAvatarAttrs, selectCreatures, selectTonics, selectCracksAll, selectGuilds,
  (state: RootState) => explode(state.Profile.achieveLevel * 7 - 2, "stat"),
  (e, av, c, t, cr, g, ach) => combine(e, av, c, t, cr, g, ach)
)

export const selectMe = createSelector(
  selectMeWithoutCalibrate, selectCalibrated,
  (me, cal) => combine(me, cal)
)

export const selectMyFinalEltype = createSelector(
  selectMe,
  attrs => {
    const eltype = whatElType(attrs, attrs.eltype)
    if (!eltype) return [null, 0, 0]
    const el_attrKey = elMap2[eltype]
    const eldmg_attrKey = el_attrKey.replace("el_", "eldmg_")
    const el = attrs[el_attrKey]
    const eldmg = attrs[eldmg_attrKey] ?? 0
    return [eltype, el, eldmg]
  }
)
