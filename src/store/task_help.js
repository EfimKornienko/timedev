
export default class Task {
  constructor (
    title,
    description,
    time,
    beginDate,
    completeDate,
    tags,
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
    this.tags = tags
    this.completed = completed
    this.editing = editing
    this.show = show
    this.user = user
    this.id = id
  }
}
