const useTimeConverter  =  () => {

  const convertMinutesToHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let formattedTime = `${hours}:${remainingMinutes.toString().padStart(2, '0')}`;

    return formattedTime;
  }

  return [convertMinutesToHours];
}

export default useTimeConverter;
