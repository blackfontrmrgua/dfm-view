import { useCallback, useContext, useState } from "react"

import "../style/Equips.scss"
import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { SimpleBaseAttrView } from "./AttrsView"
import { getItem, isArmorPart } from "../items"
import { acceptEmblem } from "../emblem"
import { selectArmorUpgradeValues, selectEquip } from "../selectors"
import { AttrIcon, EmblemIcon, ItemIcon2, ItemName, LabeledInput, NumberInput } from "./CommonUI"
import { NextMagicProps, SetArmorUpgradeValueAll, SetEquipUpgradeValue, SetMaterial } from "../feats/slices/equipSlice"
import { BranchView, ExclusiveView, GivesView, ISetOptionalAttrsView } from "./ConditionalAttrs"
import { ModalContext } from "./modalContext"
import { MagicPropsArray } from "./MagicProps"

interface EquipProps {
  part: EquipPart
}


function ArmorMaterialSelector({ part }: EquipProps) {
  const name = useAppSelector(state => state.Equips[part].name)
  if (!isArmorPart(part) || !name) return null
  const material = useAppSelector(state => state.Equips[part].material)
  const dispatch = useAppDispatch()
  return(
    <select className="ArmorMaterialSelector" value={material} onChange={ev => dispatch(SetMaterial([part, ev.target.value as ArmorMaterial]))}>
      <option value="천">천</option>
      <option value="가죽">가죽</option>
      <option value="경갑">경갑</option>
      <option value="중갑">중갑</option>
      <option value="판금">판금</option>
    </select>
  )
}


function EmblemArray({ part }: EquipProps) {
  const { openModal } = useContext(ModalContext)
  const array = useAppSelector(state => state.Equips[part].emblems)
  const accept = acceptEmblem(part)
  return(
    <div className="EmblemArray">
      {array.map((spec, index) => (
        <EmblemIcon key={index} spec={spec} accept={accept}
          onClick={() => openModal(part, "Emblem", index)}
        />
      ) )}
    </div>
  )
}

function EquipCardEmblemUpgrade({ part }: EquipProps) {
  const { openModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const cardName = useAppSelector(state => state.Equips[part].card)
  const card = getItem(cardName) as Card
  const upgradeBonus = useAppSelector(state => state.Equips[part].upgrade)
  return(
    <div className="EquipCardEmblemUpgrade">
      <ItemIcon2 className="CardSocket" attrs={card} onClick={() => openModal(part, "Card", 0)} />
      <EmblemArray part={part} />
      <div className="EquipUpgradeValue">
        {part === "무기"?
        <><AttrIcon attrKey="atk_ph" /><AttrIcon attrKey="atk_mg" /></>
        :<><AttrIcon attrKey="strn" /><AttrIcon attrKey="intl" /></>
        }
        +<NumberInput value={upgradeBonus} onChange={v => dispatch(SetEquipUpgradeValue([part, v]))} />
      </div>
    </div>
  )
}

function EquipPartInnerGrid({ part }: EquipProps) {
  const { openModal } = useContext(ModalContext)
  const itemName = useAppSelector(state => state.Equips[part].name)
  const item = getItem(itemName)
  const { branch, exclusive, give_us } = item ?? {}
  const [detail, setDetail] = useState(false)
  const equipPartAttr = useAppSelector(selectEquip[part])
  const clickHandler = useCallback(() => setDetail(!detail), [detail])
  return (
    <div className="EquipSlot">
      <div className="EquipPartInnerGrid">
        <ItemIcon2 attrs={item} onClick={() => openModal(part, "Equip", 0)} />
        <div className="SlotHeading">
          <ItemName item={item} alt={`${part} 없음`} className="EquipName" onClick={clickHandler} />
          <ArmorMaterialSelector part={part} />
        </div>
        {itemName? <>
        <EquipCardEmblemUpgrade part={part}/>
        <MagicPropsArray level={item.level} part={part} rarity={item.rarity}
          arraySelector={state => state.Equips[part].magicProps}
          actionCreator={(part: EquipPart, index) => NextMagicProps([part, index])}
        />
        </> : null}
      </div>
      {
        itemName? 
        <div className="ConditionalAttrs">
          {branch? <BranchView name={itemName} branches={branch} /> : null}
          {exclusive? <ExclusiveView name={itemName} exclusives={exclusive} /> : null}
          {give_us? <GivesView name={itemName} attrs={give_us} /> : null }
        </div>: null
      }
      {
        (detail && itemName)?
        <SimpleBaseAttrView attrs={equipPartAttr} /> : null
      }
    </div>

  )
}


export function Equips() {
  const dispatch = useAppDispatch()
  const [armorUpgradeSynced, armorUpgradeValue] = useAppSelector(selectArmorUpgradeValues)
  return (
    <div className="Equips">
      <header>
        <h3>장비</h3>
        <div>※ 여기서 입력한 장비 데이터는 항상 칼박 100%로 계산하기 때문에 여기서 설정한 스탯이 더 뻥튀기되어있을 수 있습니다.</div>
      </header>
      <div className="EquipGridBox">
        <EquipPartInnerGrid part="무기"/>
        <EquipPartInnerGrid part="상의"/>
        <EquipPartInnerGrid part="하의"/>
        <EquipPartInnerGrid part="머리어깨"/>
        <EquipPartInnerGrid part="벨트"/>
        <EquipPartInnerGrid part="신발"/>
        <EquipPartInnerGrid part="팔찌"/>
        <EquipPartInnerGrid part="목걸이"/>
        <EquipPartInnerGrid part="반지"/>
        <EquipPartInnerGrid part="보조장비"/>
      </div>
      <div className="EquipBatch">
      <LabeledInput label={"방어구 강화보너스 모두 바꾸기"} value={armorUpgradeValue} onChange={v => {
        dispatch(SetArmorUpgradeValueAll(v))
      }} />  
      </div>
      <ISetOptionalAttrsView />
    </div>
  )
}

