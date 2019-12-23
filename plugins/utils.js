
export function parseCookie (array) {
  const result = {}
  const kownKeys = 'path,domain,expires,secure,httponly'
  array.forEach((item) => {
    let cookieKey = ''
    const props = {}
    item.split('; ').forEach((prop) => {
      const [key, value] = prop.split('=')

      if (key && kownKeys.includes(key.toLowerCase())) {
        props[key.toLowerCase()] = value || true
      } else {
        cookieKey = key
        props.value = value
      }
    })
    result[cookieKey] = props
  })
  return result
}
