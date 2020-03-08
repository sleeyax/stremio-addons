import 'jasmine';
import Command from '../../src/command';

describe('Command class', () => {
    it('should extract search query', () => {
        let cmd = new Command('!qs 1337x movie "Captain Marvel"');
        expect(cmd.searchQuery).toEqual('Captain Marvel');

        cmd = new Command("!qs 1337x movie 'Captain Marvel'");
        expect(cmd.searchQuery).toEqual('Captain Marvel');
    });

    it('should extract source addons', () => {
        let cmd = new Command('!qs 1337x,rarbg "Captain Marvel"');
        expect(cmd.sourceAddons.map(a => a.name)).toEqual(['1337x', 'rarbg']);

        cmd = new Command('!qs 1337x "Captain Marvel"');
        expect(cmd.sourceAddons.map(a => a.name)).toEqual(['1337x']);
    });

    it('should extract filters', () => {
        const cmd = new Command('!qs 1337x movie "Captain Marvel"');
        expect(cmd.filter).toEqual('movie');
    });

    it ('should throw error when format is invalid', () => {
        expect(() => new Command('!qs')).toThrow();
        expect(() => new Command('!qs blah')).toThrow();
        expect(() => new Command('!qs 1337x movie ')).toThrow();
        expect(() => new Command('!qs 1337x movie Captain Marvel')).toThrow();
    });
});
