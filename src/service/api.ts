import CustomAxios from "@/service/index.tsx";
export const customAxios = new CustomAxios({
  baseURL: '/',
  timeout: 20000,
  // withCredentials: true // 请求是携带cookie
})
export const customRequest = customAxios.instance

export async function getTaggingSetting(
  filter: object = {},
  pageNumber: number | undefined,
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

export async function createTaggingSetting(
  data: any,
){
  return await customRequest.post('/napi-prod/llm/tagging_task', {
    ...data,
  })
}

export async function getCasesBySuite(
    suiteId: number | string,
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
    suiteId: number | string
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

export async function getCase(
  filter: object = {},
  pageNumber: number,
  pageSize: number,
) {
  return await customRequest.post('/napi-prod/llm/source_search', {
    sourceType: 'case',
    filter,
    pager: {
      pageNumber,
      pageSize
    }
  })
}


export async function updateCase(
  tagIds: unknown[],
  id: number | string,
) {
    return await customRequest.put('/napi-prod/llm/case', {
      method: 'tags',
      tagIds: tagIds,
      id: parseInt(<string>id, 10),
    })
}


