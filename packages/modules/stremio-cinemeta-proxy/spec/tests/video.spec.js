describe('Video class', function() {
  const VideoId = require('../../src/video');

  it('should throw an error when the format is invalid', () => {
    const id = 'tt1234567:1';
    expect(() => new VideoId(id)).toThrow();
  });

  it('should initialize all properties', () => {
    const vid = new VideoId('tt1234567:1:2');
    expect(vid.imdbid).toBeDefined();
    expect(vid.season).toBeDefined();
    expect(vid.episode).toBeDefined();
  });

  it('should initialize property', () => {
    const vid = new VideoId('tt1234567');
    expect(vid.imdbid).toBeDefined();
    expect(vid.season).toBeUndefined();
    expect(vid.episode).toBeUndefined();
  });

  it('should get full meta info of captain marvel', async () => {
    const vid = new VideoId('tt4154664');
    const details = await vid.getFullMetaDetails();
    expect(details.slug).toEqual('movie/captain-marvel-4154664');
  });

  it('should get a human readable episode name of a series', async () => {
    const vid = new VideoId('tt0350448:4:1');
    const info = await vid.getInfo();
    console.log(info);
    expect(info.name).toEqual('Real Time with Bill Maher');
    expect(info.episode.number).toEqual(vid.episode);
    expect(info.episode.season).toEqual(vid.season);
    expect(info.episode.name).toEqual('February 17, 2006');
  });
});
