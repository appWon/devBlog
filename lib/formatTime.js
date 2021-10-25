export const formatDate = date => {
  const d = new Date(`${date}`)

  let year = d.getFullYear()
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()

  let hour = '' + d.getHours()
  let min = '' + d.getMinutes()
  let sec = '' + d.getSeconds()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day
  if (hour.length < 2) hour = '0' + hour
  if (min.length < 2) min = '0' + min

  return `${year}-${month}-${day}  ${hour}:${min}:${sec}`
}
