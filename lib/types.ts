export interface TesterMeasurement {
  pH?: string
  Cl?: string
  alkalinity?: string
  temp?: string
}

export interface AsecoMeasurement {
  salinity?: string
  algicide?: string
  redox?: string
  pH?: string
}

export interface MaintenanceRecord {
  filterMech: boolean
  filterBackwash: boolean
  vacuum: boolean
  pumpBasket: boolean
}

export interface ChemistryAdded {
  salt?: string
  phMinus?: string
  algicide?: string
  flocculant?: string
}

export interface LogEntry {
  id: string
  date: string
  time: string
  maintenance: MaintenanceRecord
  chemistry: ChemistryAdded
  tester: TesterMeasurement
  aseco: AsecoMeasurement
  notes?: string
  photos?: string[]
  createdAt: string
  // derived status
  status?: "ok" | "warning" | "danger"
}

export interface PoolData {
  id: string
  name: string
  volume: number
  model?: string
  filtration?: string
  seasonStart?: string
  seasonEnd?: string
  // system toggles
  pumpOn?: boolean
  counterCurrentOn?: boolean
  jetsOn?: boolean
  dosingSystemOn?: boolean
}
