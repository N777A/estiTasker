const useTimeConverter  =  ():[
  (defaultMinutes: number) => string,
  (defaultMinutes: number) => { hours: number; minutes: number },
  (defaultTime: string) => number,
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

  const convertToMinutes = (defaultTime: string) => {
    const [hoursStr, minutesStr] = defaultTime.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    return hours * 60 + minutes;
  }

  return [convertMinutesToHours, hoursAndMinutes, convertToMinutes]
}

export default useTimeConverter;
