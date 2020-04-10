import { TiledMapManager } from '../manager';
import { BaseToken } from '../../layer/token/BaseToken';

const defaultOpts = {
  size: {
    width: 20,
    height: 15,
  },
  gridSize: {
    width: 40,
    height: 40,
  },
};

describe('TiledMapManager', () => {
  test('constructor', () => {
    const el = document.createElement('canvas');
    const manager = new TiledMapManager(el, defaultOpts);

    expect(manager).toBeTruthy();
  });

  describe('manager method', () => {
    let manager: TiledMapManager;
    beforeEach(() => {
      const el = document.createElement('canvas');
      manager = new TiledMapManager(el, defaultOpts);
    });

    afterEach(() => {
      manager = null;
    });

    test('addToken', async () => {
      const token = new BaseToken();
      const mockDrawFn = jest.fn();
      token.draw = mockDrawFn;
      await manager.addToken('default', token);

      expect(manager.getDefaultLayer().hasToken(token.id)).toBe(true);
      expect(mockDrawFn).toBeCalled();
    });
  });
});
