const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function parseMonth(date: string) {
  const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(date)
  if (!match) throw new Error(`Invalid employment date: ${date}. Expected YYYY-MM.`)
  return { year: Number(match[1]), month: Number(match[2]) - 1 }
}

export function formatExperienceDate(date: string | null) {
  if (date === null) return 'Present'
  const { year, month } = parseMonth(date)
  return `${months[month]} ${year}`
}

/** Count listed calendar months, matching LinkedIn's inclusive tenure display. */
export function calculateTenureLabel(startDate: string, endDate: string | null, now = new Date()) {
  const start = parseMonth(startDate)
  const end = endDate === null
    ? { year: now.getFullYear(), month: now.getMonth() }
    : parseMonth(endDate)
  const totalMonths = (end.year - start.year) * 12 + end.month - start.month + 1
  if (totalMonths < 1) throw new Error('Employment end date precedes start date.')
  const years = Math.floor(totalMonths / 12)
  const remainingMonths = totalMonths % 12
  return [
    years ? `${years} year${years === 1 ? '' : 's'}` : '',
    remainingMonths ? `${remainingMonths} month${remainingMonths === 1 ? '' : 's'}` : '',
  ].filter(Boolean).join(' ')
}
