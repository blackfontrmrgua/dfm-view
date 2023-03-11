
declare interface ItemsState {
  무기: string
  상의: string
  하의: string
  머리어깨: string
  벨트: string
  신발: string
  팔찌: string
  목걸이: string
  반지: string
  보조장비: string
  칭호: string
  오라: string
  무기아바타: string
  봉인석: string
  정수: string[]
}

declare interface CardState {
  무기: string
  상의: string
  하의: string
  머리어깨: string
  벨트: string
  신발: string
  팔찌: string
  목걸이: string
  반지: string
  보조장비: string
  칭호: string
}

declare interface EmblemState {
  무기: EmblemSpec[]
  상의: EmblemSpec[]
  하의: EmblemSpec[]
  머리어깨: EmblemSpec[]
  벨트: EmblemSpec[]
  신발: EmblemSpec[]
  팔찌: EmblemSpec[]
  목걸이: EmblemSpec[]
  반지: EmblemSpec[]
  보조장비: EmblemSpec[]
  칭호: EmblemSpec[]
}

declare interface MagicPropsState {
  무기: MagicPropsCareAbout[]
  상의: MagicPropsCareAbout[]
  하의: MagicPropsCareAbout[]
  머리어깨: MagicPropsCareAbout[]
  벨트: MagicPropsCareAbout[]
  신발: MagicPropsCareAbout[]
  팔찌: MagicPropsCareAbout[]
  목걸이: MagicPropsCareAbout[]
  반지: MagicPropsCareAbout[]
  보조장비: MagicPropsCareAbout[]
  봉인석: MagicPropsCareAbout[]
}

declare interface UpgradeOrKaledoState {
  무기: number
  상의: number
  하의: number
  머리어깨: number
  벨트: number
  신발: number
  팔찌: number
  목걸이: number
  반지: number
  보조장비: number
}



declare interface MaterialState {
  상의: ArmorMaterial
  하의: ArmorMaterial
  머리어깨: ArmorMaterial
  벨트: ArmorMaterial
  신발: ArmorMaterial
}

declare type WearAvatarRarity = "Common" | "Uncommon" | "Rare"
declare type WearAvatarState = { [k in WearAvatarPart]: WearAvatarRarity }



declare type AvatarState = {
  [k in WearAvatarPart]: "Uncommon" | "Rare"
}


declare interface TonicState {
  el_all: number
  hpmax: number
  mpmax: number
  strn_intl: number
  vit_psi: number
  def_ph: number
  def_mg: number
  Crit: number
  Accu: number
}

declare interface CracksState {

  /** 장착 중인 정수 이름 */
  Spells: string[]
}


declare interface GuildState {
  StatLv: number
  AtkLv: number
  CritLv: number
  ElLv: number
  SpeedAtkLv: number
  SpeedCastLv: number
  SpeedMoveLv: number
  AccuLv: number
  PublicStatLv: number
}


declare interface CreatureState {

  /** 크리쳐가 주는 모든스탯 보너스 */
  stat: number
  
  /** 크리쳐 스킬 보너스 */
  skill: {
    stat: number
    el_all: number
    dmg_add: number
  }

  /** 아티팩트 */
  Artifacts: {

    /** 빨간색 아티팩트에서 얻는 스탯증가 수치 */
    stat: number

    /** 파란색 아티팩트에서 얻는 물리/마법공격력 증가 수치 */
    atk: number

    /** 초록색 아티팩트에서 얻는 모든속성 강화 수치 */
    el_all: number

    speed_atk: number
    speed_cast: number

  }

}

declare interface ConditionalSelectors {
  branches: Record<string, boolean>
  gives: Record<string, boolean>
  exclusives: Record<string, string>
}

declare type NumberCalibrate = Omit<CalibrateState, "eltype" | "sk_inc">

declare interface CalibrateState {
  strn: number,
  intl: number,
  str_inc: number,
  int_inc: number,

  atk_ph: number,
  atk_mg: number,
  atk_ph_inc: number,
  atk_mg_inc: number,

  crit_ph: number,
  crit_mg: number,
  crit_ph_pct: number,
  crit_mg_pct: number,

  dmg_inc: number,
  cdmg_inc: number,
  dmg_add: number,

  eltype: Eltype[]
  
  el_fire: number,
  el_ice: number,
  el_lght: number,
  el_dark: number,

  eldmg_fire: number,
  eldmg_ice: number,
  eldmg_lght: number,
  eldmg_dark: number,
  
  sk_inc: number[],
  sk_inc_sum: number

  target_def: number,
  target_res: number
}


declare interface DFCharState {
  Item?: ItemsState
  Card?: CardState
  Emblem?: EmblemState
  MagicProps?: MagicPropsState
  Upgrade?: UpgradeOrKaledoState
  Kaledo?: UpgradeOrKaledoState
  Material?: MaterialState
  Avatar?: WearAvatarState
  Tonic?: TonicState
  Guild?: GuildState
  Creature?: CreatureState
}

