export function getListChunk<T>(array:Array<T>, chunk = 15): Array<T>{
  const result = [];
  for (let i = 0, j = array.length; i < j; i += chunk) {
    result.push(array.slice(i, i + chunk));
  }
  return result;
}
