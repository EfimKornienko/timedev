
export default class Task {
  constructor (
    title,
    description,
    time,
    beginDate,
    completeDate,
    sortDate,
    tagUsed,
    completed,
    editing,
    show,
    user = null,
    id = null
  ) {
    this.title = title
    this.description = description
    this.time = time
    this.beginDate = beginDate
    this.completeDate = completeDate
    this.sortDate = sortDate
    this.tagUsed = tagUsed
    this.completed = completed
    this.editing = editing
    this.show = show
    this.user = user
    this.id = id
  }
}
