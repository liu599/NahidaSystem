import CustomAxios from "@/service";
export const customAxios = new CustomAxios({
  baseURL: '/',
  timeout: 20000,
  // withCredentials: true // 请求是携带cookie
})
export const customRequest = customAxios.instance

export async function getTaggingSetting(
    filter: object = {},
    pageNumber: number,
    pageSize: number,
){
  return await customRequest.post('/napi-prod/llm/source_search', {
    sourceType: 'tagging',
    filter,
    pager: {
      pageNumber,
      pageSize
    }
  })
}

export async function getCasesBySuite(
    suiteId: number,
    pageNumber: number,
    pageSize: number,
){
  return await customRequest.post('/napi-prod/llm/source_search', {
    sourceType: 'caseBySuiteId',
    filter: {
      suiteId,
    },
    pager: {
      pageNumber,
      pageSize
    }
  })
}

export async function getSuite(
    suiteId: number
){
  return await customRequest.post('/napi-prod/llm/source_search', {
    sourceType: 'suite',
    filter: {
      suiteId,
    },
    pager: {
      pageNumber: 1,
      pageSize: 1
    }
  })
}

export async function getTag(
    filter: object = {},
    pageNumber: number,
    pageSize: number,
) {
  return await customRequest.post('/napi-prod/llm/source_search', {
    sourceType: 'tag',
    filter,
    pager: {
      pageNumber,
      pageSize
    }
  })
}



