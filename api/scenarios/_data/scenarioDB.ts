import DB from './scenario.json'

interface Scenario {
  id: number
  display_name: string
  created_at: string
  updated_at: string
  thumbnail_url: string
}
const fakeDB = {
  scenarios: [...DB.data] as Scenario[],
  refreshDB: () => (fakeDB.scenarios = [...DB.data]),
  getScenarios: () => fakeDB.scenarios,
  createScenario: (scenario: Scenario) => {
    const id = Date.now().valueOf()
    const newScenario = {
      ...scenario,
      id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    fakeDB.scenarios.push(newScenario)
    return newScenario
  },
  selectScenario: (id: number) => fakeDB.scenarios.find((scenario: Scenario) => scenario.id === id),
  updateScenario: (updatedScenario: Scenario) => {
    let updateIdx = -1
    fakeDB.scenarios.find((scenario: Scenario, idx: number) => {
      if (updatedScenario.id === scenario.id) {
        updateIdx = idx
        return true
      }
      return false
    })
    fakeDB.scenarios[updateIdx] = {
      ...updatedScenario,
      updated_at: new Date().toISOString(),
    }
    return fakeDB.scenarios[updateIdx]
  },
  batchDeleteScenario: (ids: number[]) => {
    const deleteIds = [...ids]
    fakeDB.scenarios = fakeDB.scenarios.filter(scenario => {
      const idx = deleteIds.indexOf(scenario.id)
      if (idx !== -1) {
        deleteIds.splice(idx, 1)
        return false
      }
      return true
    })
    return deleteIds.length ? `failed ids: ${deleteIds.toString()}` : null
  },
}

export const createDB = () => ({ ...fakeDB })
