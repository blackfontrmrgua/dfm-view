import { PayloadAction } from "@reduxjs/toolkit"
import styled from "styled-components"
import { useDispatch } from "react-redux"
import { useAppSelector } from "../feats/hooks"
import { RootState } from "../feats/store"
import { getOneMagicPropValue, getRealAttrKey } from "../magicProps"
import { AttrIcon } from "./widgets/Icons"
import { Num } from "./CommonUI"
import { NextMagicProps } from "../feats/slices/equipSlice"

interface MagicPropsArrayProps {
  item: Attrs
  part: MagicPropsPart
}

const MagicPropOne = styled.div`
  flex-grow: 1;
  display: flex;

  cursor: pointer;

  align-items: center;
  justify-content: center;


  &:nth-last-child(3) {
    background-color: rgba(13, 9, 5, 0.5);
  }

  .MagicPropValue {
    color: var(--attr-value-color);
    font-size: 0.7rem;
    font-weight: 800;
  }

`

export function MagicProps({ item, part }: MagicPropsArrayProps) {
  if (!item) return null
  const { level, rarity } = item
  const dispatch = useDispatch()
  const array = useAppSelector(state => state.Equips[part].magicProps)
  const atype = useAppSelector(state => state.Profile.atype)
  return (
    <>
      {array.map((name, index) => index > 0 || rarity === "Epic" ?
      <MagicPropOne key={index} className="MagicPropOne Hovering" onClick={() => dispatch(NextMagicProps([part, index]))} >
        <AttrIcon attrKey={getRealAttrKey(name, atype)} />
        <Num className="MagicPropValue" signed value={getOneMagicPropValue(name, { level, rarity, part, prime: index === 0 })} />
      </MagicPropOne> : null
      )}
    </>
  )
}