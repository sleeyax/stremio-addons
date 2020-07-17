export default class Show {
  title: string;
  episodes: number;
  /**
   * if this is true, it means the show is still in the makings
   * if false, it means the show has ended
   */
  isOngoing: boolean;
  releaseYear: number;
  thumbnail: string;
  url: string;

  constructor({title, episodes, isOngoing, releaseYear, thumbnail, url}: Omit<Show, 'getSlug'>) {
    this.title = title;
    this.episodes = episodes;
    this.isOngoing = isOngoing;
    this.releaseYear = releaseYear;
    this.thumbnail = thumbnail;
    this.url = url;
  }

  /**
   * Returns only the slug part from the url
   */
  getSlug() {
    return this.url.substr(this.url.lastIndexOf('/') + 1, this.url.length);
  }
}