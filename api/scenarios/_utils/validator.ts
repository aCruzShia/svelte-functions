interface ValidProps {
  data: any
  isCreation?: boolean
}
export const isValidScenario = ({ data, isCreation = false }: ValidProps) => {
  let errors = []
  if (!data) return 'invalid request body'
  if (!isCreation && (!data.id || isNaN(data.id))) {
    errors.push('missing scenario id')
  }
  if (!data['display_name'] || !data['display_name'].length) errors.push('missing scenario display name')
  if (!data['thumbnail_url']) errors.push('missing scenario thumbnail url')

  return errors.length ? errors.join(',') : null
}
