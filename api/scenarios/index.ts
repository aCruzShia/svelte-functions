import { NowRequest, NowResponse } from '@now/node'
import { setHeaders, successResponse, badRequestResponse } from './_utils/response'
import { isValidScenario } from './_utils/validator'
import { createDB } from './_data/scenarioDB'

const fakeDB = createDB()

export default (req: NowRequest, res: NowResponse) => {
  const { method, query } = req
  setHeaders(res)

  // create scenarios
  if (method === 'POST') {
    const scenarioValidateError = isValidScenario({
      data: req.body,
      isCreation: true,
    })
    if (scenarioValidateError) {
      badRequestResponse(res, { message: scenarioValidateError })
      return
    }
    successResponse(res, fakeDB.createScenario(req.body))
    return
  }

  // get scenarios
  if (method === 'GET') {
    const scenariosData = fakeDB.getScenarios()
    // auto refresh data pool
    const isRefresh = !scenariosData.length
    if (isRefresh) fakeDB.refreshDB()

    successResponse(res, {
      scenarios: fakeDB.getScenarios(),
      ...(isRefresh ? { message: 'refresh scenarios' } : {}),
    })
    return
  }

  // update scenario
  if (method === 'PUT') {
    const requestPayload = req.body
    requestPayload.id = Number(requestPayload.id)
    const scenarioValidateError = isValidScenario({
      data: requestPayload,
    })

    const updateTarget = fakeDB.selectScenario(requestPayload.id)
    if (scenarioValidateError || !updateTarget) {
      badRequestResponse(res, { message: updateTarget ? scenarioValidateError : 'scenario not found' })
      return
    }
    successResponse(res, fakeDB.updateScenario(requestPayload))
    return
  }

  // delete scenarios
  if (method === 'DELETE') {
    if (!query || !query.ids) {
      badRequestResponse(res, { message: 'missing ids parameter' })
      return
    }
    const deleteIds = (query.ids as string).split(',').map(id => Number(id))
    const deleteError = fakeDB.batchDeleteScenario(deleteIds)

    successResponse(res, {
      ...(deleteError ? { message: deleteError } : {}),
    })
    return
  }

  // response for preflight requests
  successResponse(res, {})
}
