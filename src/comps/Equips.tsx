import '../style/Equips.scss'

import { useContext, useState } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import styled from 'styled-components'

import { useAppDispatch, useAppSelector } from '../feats/hooks'
import {
  selectItem, selectUpgradeValue
} from '../feats/selector/equipSelectors'
import { SetUpgradeValue } from '../feats/slices/itemSlice'
import { equipParts, isEquip } from '../items'
import { PortraitMode } from '../responsiveContext'
import { ClosedCondyceSet } from './Choices'
import { EquipBatch } from './EquipBatch'
import { ArmorMaterialSelect, CardSlot, EmblemArray } from './Itemy'
import { MagicProps } from './MagicProps'
import { EquipModalFragment } from './modals/EquipModal'
import { ModalContext } from './modals/modalContext'
import { SimpleBaseAttrView } from './widgets/AttrsView'
import { NumberInput } from './widgets/Forms'
import { ItemIcon } from './widgets/Icons'
import { ItemName } from './widgets/ItemNameView'

interface PartProps {
  part: EquipPart | "칭호" | "오라" | "무기아바타"
}

function Upgrade({ part }: PartProps) {
  if (!isEquip(part)) return null
  const dispatch = useAppDispatch()
  const upgradeBonus = useAppSelector(selectUpgradeValue[part])
  return (
    <div className="EquipUpgradeValue">
      +<NumberInput value={upgradeBonus} onChange={v => dispatch(SetUpgradeValue([part, v]))} />
    </div>
  )
}

function WideAddons({ part }: PartProps) {
  return(
    <div className="EquipAddons">
      <CardSlot part={part} />
      <EmblemArray part={part} />
      <Upgrade part={part} />
    </div>
  )
}


const MagicPropsLayout = styled.div`

  grid-area: mgp;
  align-self: stretch;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: stretch;

  > * {
    flex: 1;
  }
`

function SlotHeading({ part, onItemNameClicked }: PartProps & { onItemNameClicked: React.MouseEventHandler<HTMLDivElement> }) {
  const item = useAppSelector(selectItem[part])
  return (
    <div className="SlotHeading">
      <ItemName item={item} alt={`${part} 없음`} className="EquipName" onClick={onItemNameClicked} />
      <ArmorMaterialSelect part={part} />
    </div>
  )
}

function PartWide({ part }: PartProps) {
  const { openModal } = useContext(ModalContext)
  const item = useAppSelector(selectItem[part])
  const [detail, setDetail] = useState(false)
  return (
    <div className="EquipSlot Bordered Hovering">
      <div className="EquipPartLayout">
        <ItemIcon item={item}
          onClick={() => openModal(<EquipModalFragment part={part} />)}
        />
        <SlotHeading part={part} onItemNameClicked={() => setDetail(!detail)} />
        {item? <WideAddons part={part} /> : null}
        <MagicPropsLayout>
          <MagicProps item={item} part={part} />
        </MagicPropsLayout>
      </div>
      {
        (detail && item)?
        <SimpleBaseAttrView attrs={item?.attrs} /> : null
      }
    </div>
  )
}




function PartCompact({ part }: PartProps) {
  const { openModal } = useContext(ModalContext)
  const item = useAppSelector(selectItem[part])
  return (
    <div className="EquipSlot">
      <div className="EquipPartLayout">
        <ItemIcon item={item}
          onClick={() => openModal(<EquipModalFragment part={part} />)}
        />
      </div>
    </div>
  )
}

export function CondsAttrsView() {
  const items = ([...equipParts, "칭호", "오라", "무기아바타"] as const).map(part => useAppSelector(selectItem[part]))
  return <ClosedCondyceSet items={items} />
}

const wideOrder = [
  "머리어깨", "무기",
  "상의",   "팔찌",
  "하의",   "목걸이",
  "벨트",   "반지",
  "신발",   "보조장비",
] as const

const compactOrder = [
  "무기", "팔찌", "목걸이", "반지", "보조장비",
  "머리어깨", "상의", "하의", "벨트", "신발",
] as const

const EquipsArrayLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(5, auto);
  align-items: start;
  gap: 4px;

  @media screen and (max-width: 999px) {
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(2, auto);
    grid-auto-flow: row;
  }
`

const ExtraEquipsLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: start;
  gap: 4px;
  margin-top: 4px;
`

export function Equips() {
  const portrait = useContext(PortraitMode)
  const Part = portrait? PartCompact : PartWide
  const order = portrait? compactOrder : wideOrder
  return (
    <div className="Equips">
      <EquipsArrayLayout className="EquipsArrayLayout">
        {order.map(part => <Part key={part} part={part} />)}
      </EquipsArrayLayout>
      <ExtraEquipsLayout>
        <Part part="칭호" />
        <Part part="오라" />
        <Part part="무기아바타" />
      </ExtraEquipsLayout>
      <CondsAttrsView />
      {!portrait? <EquipBatch /> : null}
    </div>
  )
}

