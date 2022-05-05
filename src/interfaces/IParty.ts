export interface IParty {
  id: string,
  partyName: string,
  ort: string,
  datum: string,
  zeit:string,
  infos: string,
  essen: IEssen[],
}

export interface IPartyApp extends IParty {
  teilnehmer: string[],
}

export interface IEssen {
  kategorie: string,
  essenName: string,
  werBringts: string,
}