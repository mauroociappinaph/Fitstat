
export const formatDateDisplay = (dateStr: string): string => {
  return dateStr.split('-').reverse().join('/');
};

export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('es-AR').format(num);
};

export const getDayName = (date: Date): string => {
  const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  return days[date.getDay()];
};
