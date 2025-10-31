/**
 * Utilidades para formateo de fechas
 */

export const formatDate = (
  date: string | Date,
  locale: string = 'es-ES',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

