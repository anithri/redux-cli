import ProjectSettings from 'models/project-settings';

describe('ProjectSettings', () => {
  test('it takes rcCollection, bpCollection, ui', () => {
    const settings = new ProjectSettings(
      'Ventriloquist',
      'Joker',
      'Riddler',
      'Penguin'
    );
    expect(settings.rcCollection).toEqual('Ventriloquist');
    expect(settings.rc).toEqual('Joker');
    expect(settings.bp).toEqual('Riddler');
    expect(settings.ui).toEqual('Penguin');
  });
});
