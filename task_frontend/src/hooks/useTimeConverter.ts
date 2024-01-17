const useTimeConverter  =  ():[
  (defaultMinutes: number) => string,
  (defaultMinutes: number) => { hours: number; minutes: number }
] => {

  const convertMinutesToHours = (defaultMinutes: number) => {
    const hours = Math.floor(defaultMinutes / 60)
    const minutes = defaultMinutes % 60

    let formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}`

    return formattedTime
  }

  const hoursAndMinutes = (defaultMinutes: number) => {
    const hours = Math.floor(defaultMinutes / 60)
    const minutes = defaultMinutes % 60
    return { hours, minutes }
  }

  return [convertMinutesToHours, hoursAndMinutes]
}

export default useTimeConverter;
