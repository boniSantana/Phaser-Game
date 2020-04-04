import 'phaser';
import config from './Config/config';
import GameScene1 from './Scenes/GameScene1';
import GameScene2 from './Scenes/GameScene2';
import BootScene from './Scenes/BootScene';
import PreloaderScene from './Scenes/PreloaderScene';
import TitleScene from './Scenes/TitleScene';
import OptionsScene from './Scenes/OptionsScene';
import CreditsScene from './Scenes/CreditsScene';
import Model from './Model';

class Game extends Phaser.Game {
  constructor () {
    super(config);
    const model = new Model();
    this.globals = { model, bgMusic: null };
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('Options', OptionsScene);
    this.scene.add('Credits', CreditsScene);

    this.scene.add('Episodio1', GameScene1);
    this.scene.add('Episodio2', GameScene2);
    this.scene.start('Boot');
  }
}

window.game = new Game(config);
