import { useContext, useCallback, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../feats/hooks"
import { acceptEmblem } from "../../emblem"
import { NumberInput } from "../widgets/Forms"
import { EmblemIcon } from "../widgets/Icons"
import { ModalContext } from "../../modalContext"
import { selectEmblemSpecs } from "../../feats/selector/equipSelectors"
import { SetEmblem } from "../../feats/slices/itemSlice"


export function __emblem_part_ (part: WholePart): EmblemType[] {
  switch (part) {
    case "무기": return ["Red", "Yellow", "Green", "Blue"]
    case "상의": case "하의": return ["Red"]
    case "머리어깨": case "벨트": return ["Yellow"]
    case "신발": case "팔찌": return ["Blue"]
    case "목걸이": case "반지": return ["Green"]
    case "보조장비": case "칭호": return ["Stren", "Intel", "Fire", "Ice", "Light", "Dark"]
  }
}

function EmblemSelect({ type, level }: { type: EmblemType, level: number }) {
  const { setOpen, message } = useContext(ModalContext)
  const { part, index } = message as ModalRequestForItem
  const accept = acceptEmblem(part as EquipPart)
  const dispatch = useAppDispatch()
  const onClick = useCallback(() => {
    if (part === "칭호") dispatch(SetEmblem(["칭호", 0, type , level as EmblemLevel]))
    else dispatch(SetEmblem([part as EquipPart, index as number, type, level]))
    setOpen(false)
  }, [part, index, type, level])
  return (
    <div className="ModalEmblemSelect" onClick={onClick}>
      <EmblemIcon spec={[type, null]} accept={accept} />
    </div>
  )
}

export function EmblemModalFragment() {
  const { message } = useContext(ModalContext)
  const { part, index } = message as ModalRequestForItem
  const emblems = useAppSelector(selectEmblemSpecs[part as CardablePart])
  const currentSpec = emblems[index]
  const [newLevel, setNewLevel] = useState(currentSpec[1])
  const availableEmblemTypes = __emblem_part_(part as EquipPart)
  return(<>
    <div style={{ marginBlockStart: "0.5rem", fontWeight: 700}}>새로 장착할 엠블렘 레벨을 입력한 후, 아래 아이콘을 누르세요</div>
    <div style={{ marginBlockEnd: "0.5rem", fontSize: "smaller" }}>{(index as number) + 1}번째 엠블렘 소켓에 장착됩니다</div>
    <div>
      엠블렘 레벨
      <NumberInput className="EmblemLevelInput" min={5} max={10} step={1} value={newLevel} onChange={v => setNewLevel(v as EmblemLevel)} />
    </div>
    <div className="EmblemSelectArray">
      {availableEmblemTypes.map((type) => (
        <EmblemSelect key={type} type={type} level={newLevel} />
      ))}
    </div>
  </>)
}