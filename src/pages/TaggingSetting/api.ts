import CustomAxios from "@/service";
export const customAxios = new CustomAxios({
  baseURL: '/',
  timeout: 20000,
  // withCredentials: true // 请求是携带cookie
})
export const customRequest = customAxios.instance

export async function getTaggingSetting(data: any){
  return await customRequest.post('/napi-prod/llm/source_search', {
    ...data,
  })
}