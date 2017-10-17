import ProjectSettings from 'models/project-settings';

describe('ProjectSettings', () => {
  test('it takes collection, bpCollection, ui', () => {
    const settings = new ProjectSettings(
      'Ventriloquist',
      'Joker',
      'Riddler',
      'Penguin'
    );
    expect(settings.collection).toEqual('Ventriloquist');
    expect(settings.rc).toEqual('Joker');
    expect(settings.bp).toEqual('Riddler');
    expect(settings.ui).toEqual('Penguin');
  });
});
