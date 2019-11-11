import React from 'react';
import P5Wrapper from 'react-p5-wrapper';

const mapSetting = function sketch(p) {
  let backImage;
  let width = `${process.env.REACT_APP_API_MAP_WIDTH}`;
  let height = `${process.env.REACT_APP_API_MAP_HEIGHT}`;
  let metas = [];
  let maps = [];
  let metas_hozon = [];
  let doubleClickMouse;
  let y = p.mouseY;

  p.setup = function() {
    p.createCanvas(width, height);
    backImage = p.loadImage(`${process.env.REACT_APP_API_MAP}`);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    if (props.metas && !metas.length) {
      metas = props.metas;
    }
    if (props.maps && !maps.length) {
      maps = props.maps;
    }
    if (props.doubleClickMouse) {
      doubleClickMouse = props.doubleClickMouse;
    }
  };

  p.draw = function() {
    p.clear();
    if (backImage) p.image(backImage, 0, 0, width, height);
    if (maps.length > 0) {
      maps.forEach(map => {
        for (let i = 0; map.size.length > i; i++) {
          p.fill('rgba(255,150,0,0.5)');
          p.quad(
            map.size[i].min.x,
            map.size[i].min.y,
            map.size[i].max.x,
            map.size[i].min.y,
            map.size[i].max.x,
            map.size[i].max.y,
            map.size[i].min.x,
            map.size[i].max.y
          );
        }
      });
    }

    if (metas.length > 0) {
      metas.forEach(meta => {
        for (let i = 0; meta.size.length > i; i++) {
          p.fill(0, 30);
          p.quad(
            meta.size[i].min.x,
            meta.size[i].min.y,
            meta.size[i].max.x,
            meta.size[i].min.y,
            meta.size[i].max.x,
            meta.size[i].max.y,
            meta.size[i].min.x,
            meta.size[i].max.y
          );
        }

        if (meta.active) {
          for (let i = 0; meta.size.length > i; i++) {
            p.fill(0, 80);
            p.quad(
              meta.size[i].min.x,
              meta.size[i].min.y,
              meta.size[i].max.x,
              meta.size[i].min.y,
              meta.size[i].max.x,
              meta.size[i].max.y,
              meta.size[i].min.x,
              meta.size[i].max.y
            );
          }
        }
      });
    }
    if (metas_hozon.length > 0) {
      for (let i = 0; metas_hozon[0].size.length > i; i++) {
        p.fill(0, 50);
        p.quad(
          metas_hozon[0].size[i].min.x,
          metas_hozon[0].size[i].min.y,
          metas_hozon[0].size[i].max.x,
          metas_hozon[0].size[i].min.y,
          metas_hozon[0].size[i].max.x,
          metas_hozon[0].size[i].max.y,
          metas_hozon[0].size[i].min.x,
          metas_hozon[0].size[i].max.y
        );
      }
    }
  };

  p.mousePressed = function() {
    let meta = metas.find(meta => meta.name === 'new');
    if (y < height) {
      if (!meta) {
        metas.push({
          name: 'new',
          size: [{ min: { x: p.mouseX, y: p.mouseY }, max: { x: p.mouseX, y: p.mouseY } }],
          active: false
        });
      } else {
        metas.pop();
        metas.push({
          name: 'new',
          size: [{ min: { x: p.mouseX, y: p.mouseY }, max: { x: p.mouseX, y: p.mouseY } }],
          active: false
        });
      }
      return false;
    }
  };

  p.mouseReleased = function() {
    let meta = metas.find(meta => meta.name === 'new');

    if (y < height) {
      if (metas_hozon.length === 0) {
        metas_hozon.push({
          name: 'new',
          size: [
            {
              min: { x: meta.size[0].min.x, y: meta.size[0].min.y },
              max: { x: p.mouseX, y: p.mouseY }
            }
          ],
          active: false
        });
      } else {
        metas_hozon[0].size.push(meta.size[0]);
        for (let i = 0; metas_hozon[0].size.length > i; i++) {
          meta.size[i] = metas_hozon[0].size[i];
        }
      }
      return false;
    }
  };

  p.doubleClicked = function() {
    if (metas.length > 0) {
      metas.forEach(meta => {
        for (let i = 0; meta.size.length > i; i++) {
          if (
            meta.size[i].max.x - p.mouseX > 0 &&
            p.mouseX - meta.size[i].min.x > 0 &&
            meta.size[i].max.y - p.mouseY > 0 &&
            p.mouseY - meta.size[i].min.y > 0
          ) {
            meta.active = true;
            doubleClickMouse(meta);
            break;
          } else {
            meta.active = false;
          }
        }
      });
      return false;
    }
  };

  p.mouseDragged = function() {
    if (y < height) {
      let meta = metas.find(meta => meta.name === 'new');
      meta.size[0].max = { x: p.mouseX, y: p.mouseY };
    }
  };
};

export default function Map(props) {
  return (
    <div className="map">
      <P5Wrapper
        sketch={mapSetting}
        metas={props.metas}
        maps={props.maps}
        doubleClickMouse={props.doubleClickMouse}
      />
    </div>
  );
}
