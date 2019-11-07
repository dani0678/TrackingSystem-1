import React, { useState, useEffect } from 'react';
import P5Wrapper from 'react-p5-wrapper';
import mapImage from '../../../assets/lab3f.png';

const mapSetting = function sketch(p) {
  let backImage;
  let width = 1020;
  let height = 645;
  let metas = [];
  let rooms = [];
  let rooms_hozon = [];
  let doubleClickMouse;
  let y = p.mouseY;

  p.setup = function() {
    const canvas = p.createCanvas(width, height);
    canvas.mousePressed(p.mousePress);
    canvas.mouseReleased(p.mouseRelease);
    backImage = p.loadImage(mapImage);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    if (props.metas && !metas.length) {
      metas = props.metas;
    }
    if (props.rooms && !rooms.length) {
      rooms = props.rooms;
    }
    if (props.doubleClickMouse) {
      doubleClickMouse = props.doubleClickMouse;
    }
  };

  p.draw = function() {
    p.clear();
    if (backImage) p.image(backImage, 0, 0, width, height);
    if (metas.length > 0) {
      for (let meta of metas) {
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
      }
    }
    if (rooms.length > 0) {
      for (let room of rooms) {
        for (let i = 0; room.size.length > i; i++) {
          p.fill('rgba(255,150,0,0.5)');
          p.quad(
            room.size[i].min.x,
            room.size[i].min.y,
            room.size[i].max.x,
            room.size[i].min.y,
            room.size[i].max.x,
            room.size[i].max.y,
            room.size[i].min.x,
            room.size[i].max.y
          );
        }

        if (room.active) {
          for (let i = 0; room.size.length > i; i++) {
            p.fill('rgba(255,150,0,0.9)');
            p.quad(
              room.size[i].min.x,
              room.size[i].min.y,
              room.size[i].max.x,
              room.size[i].min.y,
              room.size[i].max.x,
              room.size[i].max.y,
              room.size[i].min.x,
              room.size[i].max.y
            );
          }
        }
      }
    }
    if (rooms_hozon.length > 0) {
      for (let i = 0; rooms_hozon[0].size.length > i; i++) {
        p.fill('rgba(255,0,0, 0.25)');
        p.quad(
          rooms_hozon[0].size[i].min.x,
          rooms_hozon[0].size[i].min.y,
          rooms_hozon[0].size[i].max.x,
          rooms_hozon[0].size[i].min.y,
          rooms_hozon[0].size[i].max.x,
          rooms_hozon[0].size[i].max.y,
          rooms_hozon[0].size[i].min.x,
          rooms_hozon[0].size[i].max.y
        );
      }
    }
  };

  p.mousePress = function() {
    let metaName;
    let existMeta = false;
    let map = rooms.find(room => room.name === 'new');
    if (y < height) {
      if (!map) {
        for (let meta of metas) {
          for (let i = 0; meta.size.length > i; i++) {
            if (
              meta.size[i].max.x - p.mouseX > 0 &&
              p.mouseX - meta.size[i].min.x > 0 &&
              meta.size[i].max.y - p.mouseY > 0 &&
              p.mouseY - meta.size[i].min.y > 0
            ) {
              metaName = meta.name;
              break;
            }
          }
          if (metaName) {
            rooms.push({
              name: 'new',
              size: [{ min: { x: p.mouseX, y: p.mouseY }, max: { x: p.mouseX, y: p.mouseY } }],
              active: false,
              mName: metaName
            });
            existMeta = true;
            break;
          }
        }
        if (!existMeta) {
          alert('先にメタを登録してください');
        }
      } else {
        rooms.pop();
        metaName = null;
        existMeta = false;
        for (let meta of metas) {
          for (let i = 0; meta.size.length > i; i++) {
            if (
              meta.size[i].max.x - p.mouseX > 0 &&
              p.mouseX - meta.size[i].min.x > 0 &&
              meta.size[i].max.y - p.mouseY > 0 &&
              p.mouseY - meta.size[i].min.y > 0
            ) {
              metaName = meta.name;
              break;
            }
          }
          if (metaName) {
            rooms.push({
              name: 'new',
              size: [{ min: { x: p.mouseX, y: p.mouseY }, max: { x: p.mouseX, y: p.mouseY } }],
              active: false,
              mName: metaName
            });
            existMeta = true;
            break;
          }
        }
        if (!existMeta) {
          alert('先にメタを登録してください');
        }
      }
      return false;
    }
  };

  p.mouseRelease = function() {
    let room = rooms.find(room => room.name === 'new');
    let y = p.mouseY;
    if (y < height) {
      if (rooms_hozon.length == 0) {
        rooms_hozon.push({
          name: 'new',
          size: [
            {
              min: { x: room.size[0].min.x, y: room.size[0].min.y },
              max: { x: p.mouseX, y: p.mouseY }
            }
          ],
          active: false
        });
      } else {
        rooms_hozon[0].size.push(room.size[0]);
        for (let i = 0; rooms_hozon[0].size.length > i; i++) {
          room.size[i] = rooms_hozon[0].size[i];
        }
      }
      return false;
    }
  };

  p.doubleClicked = function() {
    if (rooms.length > 0) {
      for (let room of rooms) {
        for (let i = 0; room.size.length > i; i++) {
          if (
            room.size[i].max.x - p.mouseX > 0 &&
            p.mouseX - room.size[i].min.x > 0 &&
            room.size[i].max.y - p.mouseY > 0 &&
            p.mouseY - room.size[i].min.y > 0
          ) {
            room.active = true;
            doubleClickMouse(room);
            break;
          } else {
            room.active = false;
          }
        }
      }
      return false;
    }
  };

  p.mouseDragged = function() {
    if (y < height) {
      let room = rooms.find(room => room.name === 'new');
      if (room) {
        room.size[0].max = { x: p.mouseX, y: p.mouseY };
      }
    }
  };
};

export default function Room(props) {
  return (
    <div className="map">
      <P5Wrapper
        sketch={mapSetting}
        metas={props.metas}
        rooms={props.rooms}
        doubleClickMouse={props.doubleClickMouse}
      />
    </div>
  );
}
