import { NowResponse } from '@now/node'

export const setHeaders = (res: NowResponse) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization')
}

export const successResponse = (res: NowResponse, data: object) => {
  res.status(200).json(data)
}

export const badRequestResponse = (res: NowResponse, data: object) => {
  res.status(400).json(data)
}
