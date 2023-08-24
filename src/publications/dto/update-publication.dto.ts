export class UpdatePublicationDto {
  private _mediaId: number;
  private _postId: number;
  private _date: Date;
  constructor(mediaId: number, postId: number, date: Date) {
    this._mediaId = mediaId;
    this._postId = postId;
    this._date = date;
  }

  public get mediaId(): number {
    return this._mediaId;
  }
  public get postId(): number {
    return this._postId;
  }
  public get date(): Date {
    return this._date;
  }
}
