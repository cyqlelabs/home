import { Graphics, RenderTexture, type Application } from 'pixi.js';

const CURSOR_SIZE = 24;

export function createCursorTexture(app: Application): RenderTexture {
  const g = new Graphics();

  g.poly([0, 0, 0, CURSOR_SIZE, 6, CURSOR_SIZE - 6, CURSOR_SIZE * 0.55, CURSOR_SIZE * 0.55]);
  g.fill({ color: 0xffffff });

  const texture = RenderTexture.create({
    width: CURSOR_SIZE,
    height: CURSOR_SIZE,
    resolution: 2,
  });

  app.renderer.render({ container: g, target: texture });
  g.destroy();

  return texture;
}
