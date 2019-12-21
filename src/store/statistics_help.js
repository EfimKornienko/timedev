export default class Statistics {
  constructor (
    title,
    time,
    completeDate,
    tagUsed,
    user = null,
    id = null
  ) {
    this.title = title
    this.time = time
    this.completeDate = completeDate
    this.tagUsed = tagUsed
    this.user = user
    this.id = id
  }
}