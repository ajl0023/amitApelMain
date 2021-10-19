import * as PIXI from 'pixi.js'
import img from './3.jpg'
const app = new PIXI.Application({
    antialias: true
});
document.body.appendChild(app.view);

const graphics = new PIXI.Graphics();

// Rectangle
graphics.beginFill(0xFFFFFF);
const rec = graphics.drawRect(500, 100, 100, 100);
rec.transform.skew._y = 400
rec.endFill();

// Rectangle + line style 1


console.log(rec)
app.stage.addChild(graphics);
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform

});