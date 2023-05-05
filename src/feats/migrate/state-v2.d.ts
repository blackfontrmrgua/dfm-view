declare namespace State_v2 {
  interface _SkillOneAttackSpec {
    name: string
    value: number
    fixed: number
    isSkill?: boolean
    maxHit?: number
  }
  interface _RootState {
    currentID: string
    My: {
      Self: SelfState
      Item: ItemsState
      Card: CardState
      Emblem: EmblemState
      MagicProps: MagicPropsState
      Upgrade: UpgradeOrKaledoState
      Material: MaterialState
      Avatar: AvatarRarityState
      Guild: GuildState
      CreatureProp: CreaturePropState
      Choice: Choices
      Calibrate: CalibrateState
    }
    Tonic: TonicState
    EnemyTarget: EnemyTargetState
    SavedChars: SavedCharCollection
    EquipPresets: EquipPresetCollection
    CustomSklill: {
      cases: _SkillOneAttackSpec[]
    }
    CustomSkillPresets: CustomSkillPresetCollection
  }
}

declare namespace State_v2 {
  interface SkillOneAttackSpec {
    name: string
    value: number
    fixed: number
    isSkill?: boolean
    maxHit?: number
  }
  interface _RootState {
    My: {
      Self: SelfState
      Item: ItemsState
      Card: CardState
      Emblem: EmblemState
      MagicProps: MagicPropsState
      Upgrade: UpgradeOrKaledoState
      Material: MaterialState
      Avatar: AvatarRarityState
      Guild: GuildState
      CreatureProp: CreaturePropState
      Choice: Choices
      Calibrate: CalibrateState
    }
    Tonic: TonicState
    EnemyTarget: EnemyTargetState
    SavedChars: SavedCharCollection
    EquipPresets: EquipPresetCollection
    CustomSkill: SkillOneAttackSpec[]
    CustomSkillPresets: CustomSkillPresetCollection
  }

}
