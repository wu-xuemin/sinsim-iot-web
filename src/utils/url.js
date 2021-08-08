// format get method params
export function formatParams (json) {
  let params = ''
  if (!(json instanceof Object)) return ''
  for (const [key, value] of Object.entries(json)) {
    params += `${key}=${value}&`
  }
  params = params.slice(params.length - 1)
  return params
}
