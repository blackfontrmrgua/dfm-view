import { useAppSelector, useAppDispatch } from "../feats/hooks"
import { selectItem, selectCustomMaterial, selectEmblemSpecs, selectCard, selectUpgradeValue } from "../feats/selector/equipSelectors"
import { EmblemIcon, ItemIcon } from "./widgets/Icons"
import { DecreaseEmblemLevel, SetMaterial, SetUpgradeValue } from "../feats/slices/itemSlice"
import { getMaxEmblemCount, isArmor, isCardable, isEquip } from "../items"
import { acceptEmblem } from "../emblem"
import { useCallback, useContext } from "react"
import { EmblemModal } from "./modals/EmblemModal"
import { ModalContext } from "./modals/modalContext"
import { CardModalFragment } from "./modals/CardModal"
import { SetArtifactValue, SetCreatureStat } from "../feats/slices/slice"
import { NumberInput } from "./widgets/Forms"

interface EquipProps {
  part: EquipPart
}


interface UpgradeFlexProps {
  value: number
  setValue?: (v: number) => unknown
}
export function UpgradeFlex({ value, setValue }: UpgradeFlexProps) {
  if (!setValue) return null
  return (
    <div className="EquipUpgradeValue">
      +<NumberInput value={value} onChange={setValue} />
    </div>
  )
}

function UpgradeEquip({ part }: EquipProps) {
  const dispatch = useAppDispatch()
  const value = useAppSelector(selectUpgradeValue[part])
  return <UpgradeFlex value={value} setValue={v => dispatch(SetUpgradeValue([part, v]))} />
}

function UpgradeCreature() {
  const dispatch = useAppDispatch()
  const value = useAppSelector(state => state.My.CreatureValue.Creature)
  return <UpgradeFlex value={value} setValue={v => dispatch(SetCreatureStat(v))} />
}

export function Upgrade({ part }: PartProps) {
  if (isEquip(part)) {
    return <UpgradeEquip part={part} />
  } else if (part === "크리쳐") {
    return <UpgradeCreature />
  } else return null
}

export function ArtiUpgrade({ color }: { color: "Red" | "Green" | "Blue" }) {
  const dispatch = useAppDispatch()
  const value = useAppSelector(state => state.My.CreatureValue[color])
  const setValue = useCallback((v: number) => {
    dispatch(SetArtifactValue([color, v]))
  }, [color])
  return <UpgradeFlex value={value} setValue={setValue}/>
}


interface PartProps {
  part: WholePart
}

export function ArmorMaterialSelect({ part }: PartProps) {
  if (!isArmor(part)) return null
  const dispatch = useAppDispatch()
  const item = useAppSelector(selectItem[part])
  const material = useAppSelector(selectCustomMaterial[part])

  const materialFixed = item?.material
  if (!item || materialFixed) return null
  return (
    <select className="ArmorMaterialSelector" value={material}
      onChange={ev => dispatch(SetMaterial([part, ev.target.value as ArmorMaterial]))}>
      <option value="천">천</option>
      <option value="가죽">가죽</option>
      <option value="경갑">경갑</option>
      <option value="중갑">중갑</option>
      <option value="판금">판금</option>
    </select>
  )
}

export function CardSlot({ part }: PartProps) {
  if (!isCardable(part)) return null
  const { openModal } = useContext(ModalContext)
  const card = useAppSelector(selectCard[part])
  return (
    <ItemIcon className="Card" item={card}
        onClick={() => openModal(<CardModalFragment part={part} />)}
      />
  )
}


export function EmblemArray({ part }: PartProps) {
  if (!isCardable(part)) return null
  const { openModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const item = useAppSelector(selectItem[part])
  const emblems = useAppSelector(selectEmblemSpecs[part])
  const onItemClick = useCallback((index: number) => {
    if (part === "무기" || part === "보조장비" || part === "칭호")
      openModal(<EmblemModal part={part} index={index} />)
    else
      dispatch(DecreaseEmblemLevel([part, index]))
  }, [part])

  const accept = acceptEmblem(part)
  const maxEmblem = getMaxEmblemCount(item)
  return (
    <>
    {emblems.slice(0, maxEmblem).map((spec, index) => (
      <EmblemIcon key={index} spec={spec} accept={accept} onClick={() => onItemClick(index)} />
    ))}
    </>
  )
}
