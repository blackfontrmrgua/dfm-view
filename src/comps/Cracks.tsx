import { useAppSelector } from '../feats/hooks'
import { CrackIcon } from "./widgets/Icons"
import { MagicProps } from './MagicProps'
import React, { useContext } from 'react'
import { ModalContext } from '../modalContext'
import { selectCrackISet, selectSpells, selectCracks, selectBlessing } from "../feats/selector/cracksSelectors"
import { selectItem } from "../feats/selector/equipSelectors"
import { SimpleBaseAttrView } from './widgets/AttrsView'
import styled from 'styled-components'



const MagicPropsLayout = styled.div`
  flex-grow: 1;
  align-self: stretch;
  height: 50px;

  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
`

const AttrsLayout = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export function Cracks() {
  const { openModal } = useContext(ModalContext)
  const rune = useAppSelector(selectItem["봉인석"])
  const spells = useAppSelector(selectSpells)
  const blessing = useAppSelector(selectBlessing)
  const isets = useAppSelector(selectCrackISet)

  return (
    <div className="Cracks">
      <h3>성안의 봉인</h3>
      <div className="CrackWrapper">
        <div className="CrackUnderlay">
          <img src="/img/crack.png" alt="" />
          <img src="/img/CrackRune.png" alt="" />
        </div>
        <div className="CrackSpellSockets">
          <img src="/img/CrackSpell.png" alt="" />
          <img src="/img/CrackSpell.png" alt="" />
          <img src="/img/CrackSpell.png" alt="" />
          <img src="/img/CrackSpell.png" alt="" />
          <img src="/img/CrackSpell.png" alt="" />
        </div>
        <div className="Crack">
          {spells.map((spell, i) => (
            <CrackIcon key={i} item={spell}
            onClick={() => openModal({ name: "item", part:"정수", target:"MainItem", index:i })} />
          ))}
          <CrackIcon item={rune}
          onClick={() => openModal({ name: "item", part:"봉인석", target:"MainItem" })} />
        </div>
      </div>
      {rune?
      <MagicPropsLayout>
      <MagicProps item={rune} part={"봉인석"} />
      </MagicPropsLayout>: null}
      {blessing?
        <div>
          <h4>{blessing[0]}</h4>
          <AttrsLayout>
            <SimpleBaseAttrView attrs={blessing[1]}/>
          </AttrsLayout>
        </div>: null}
      {isets.map((iii) => (
          <React.Fragment key={iii.name}>
          <h4>{iii.name}</h4>
          <AttrsLayout>
            <SimpleBaseAttrView attrs={iii.attrs}/>
          </AttrsLayout>
          </React.Fragment>
      ))}
      {rune?
        <div>
          <h3>성안의 봉인 효과</h3>
          <AttrsLayout>
          <SimpleBaseAttrView attrs={useAppSelector(selectCracks)}/>
          </AttrsLayout>
        </div>: null}
    </div>
  )
}
