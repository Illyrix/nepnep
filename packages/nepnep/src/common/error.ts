export abstract class NepError extends Error implements Error {
  public code = -1
  public name = ''
  public message = ''
  public abstract toString(): string
}
