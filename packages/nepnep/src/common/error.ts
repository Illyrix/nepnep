export abstract class NepError extends Error implements Error {
  public code = -1
  public abstract toString(): string
}
