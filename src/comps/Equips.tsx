import "../style/Equips.scss"
import styled from "styled-components"

import { useCallback, useContext, useState } from "react"

import { useAppDispatch, useAppSelector } from "../feats/hooks"
import { SimpleBaseAttrView } from "./widgets/AttrsView"
import { selectCard, selectEmblemSpecs, selectItem, selectUpgrade } from "../feats/selector/equipSelectors"
import { ItemName } from "./widgets/ItemNameView"
import { NumberInput } from "./widgets/Forms"
import { ItemIcon } from "./widgets/Icons"
import { CondsAttrsView } from "./Choices"
import { ModalContext } from "../modalContext"
import { MagicProps } from "./MagicProps"
import { PortraitMode } from "../responsiveContext"
import { EquipBatch } from "./EquipBatch"
import { acceptEmblem } from "../emblem"
import { ArmorMaterialSelect, EmblemArray } from "./Itemy"
import { DecreaseEmblemLevel, SetUpgradeValue } from "../feats/slices/itemSlice"
import { isArmor, magicPropsParts } from "../items"
import { ErrorBoundary, useErrorHandler } from "react-error-boundary"
import { EmblemModalViolent } from "./modals/EmblemModal"
import { CardModalFragment } from "./modals/CardModal"
import { EquipModalFragment } from "./modals/EquipModal"


interface PartProps {
  part: EquipPart
}


function WideAddons({ part }: PartProps) {
  const { openModal } = useContext(ModalContext)
  const dispatch = useAppDispatch()
  const card = useAppSelector(selectCard[part])
  const upgradeBonus = useAppSelector(selectUpgrade[part])
  const emblems = useAppSelector(selectEmblemSpecs[part])
  const emblemAccept = acceptEmblem(part)
  const onItemClick = useCallback((index: number) => {
    if (part === "무기" || part === "보조장비")
      openModal(<EmblemModalViolent part={part} index={index} />)
    else
      dispatch(DecreaseEmblemLevel([part, index]))
  }, [part])
  return(
    <div className="EquipAddons">
      <ItemIcon className="Card" item={card}
        onClick={() => openModal(<CardModalFragment part={part} />)}
      />
      <EmblemArray emblems={emblems} accept={emblemAccept}
        onItemClick={onItemClick}
      />
      <div className="EquipUpgradeValue">
        +<NumberInput value={upgradeBonus} onChange={v => dispatch(SetUpgradeValue([part, v]))} />
      </div>
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
          onClick={() => openModal(<CardModalFragment part={part} />)}
        />
      </div>
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
      {isArmor(part)? <ArmorMaterialSelect part={part} /> : null}
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
        {magicPropsParts.includes(part) && item? 
        <MagicPropsLayout>
          <MagicProps item={item} part={part} />
        </MagicPropsLayout> : null}
      </div>
      {
        (detail && item)?
        <SimpleBaseAttrView attrs={item?.attrs} /> : null
      }
    </div>
  )
}

export function Equips() {
  const portrait = useContext(PortraitMode)
  const Part = portrait? PartCompact : PartWide
  return (
    <div className="Equips">
      <header>
        <h3>장비</h3>
        <div>※ 칼박 100%로 계산합니다.</div>
      </header>
      <div className="EquipsArrayLayout">
        <Part part="상의"/>
        <Part part="하의"/>
        <Part part="머리어깨"/>
        <Part part="벨트"/>
        <Part part="신발"/>
        <Part part="무기"/>
        <Part part="팔찌"/>
        <Part part="목걸이"/>
        <Part part="반지"/>
        <Part part="보조장비"/>
      </div>
      <CondsAttrsView />
      {!portrait? <EquipBatch /> : null}
    </div>
  )
}

