import React from 'react';
import P5Wrapper from 'react-p5-wrapper';
import mapImage from '../../../assets/lab3f.png';

const mapSetting = function sketch(p) {
  let backImage;
  let radius = 15;
  let width = 1020;
  let height = 645;
  let detectors = [];
  let maps = [];
  let onChange;

  const returnMapID = mapId => {
    let Id = maps.find(map => map.mapID === mapId);
    if (Id) {
      return mapId;
    } else {
      let MapID = maps.find(map => map.name === mapId);
      return MapID.mapID;
    }
  };

  p.setup = function() {
    p.createCanvas(width, height);
    backImage = p.loadImage(mapImage);
  };

  p.myCustomRedrawAccordingToNewPropsHandler = function(props) {
    if (props.detectors && !detectors.length) {
      detectors = props.detectors;
      for (let detector of detectors) {
        detector.color = '#ff8c00';
        detector.active = false;
      }
    }
    if (props.maps && !maps.length) {
      maps = props.maps;
    }
    if (props.onChange) {
      onChange = props.onChange;
    }
  };

  p.draw = function() {
    p.clear();
    if (backImage) p.image(backImage, 0, 0, width, height);
    if (detectors.length > 0) {
      for (let detector of detectors) {
        p.fill(detector.color);
        p.ellipse(detector.detectorGrid.x, detector.detectorGrid.y, radius, radius);
        if (detector.active) {
          p.textSize(10);
          let dMap = maps.find(map => map.mapID === detector.detectorMap);
          if (dMap) {
            p.text(
              `detectorNumber: ${detector.detectorNumber} \n x: ${detector.detectorGrid.x} y: ${detector.detectorGrid.y} \n detectorMap: ${dMap.name}`,
              detector.detectorGrid.x + radius + 5,
              detector.detectorGrid.y
            );
            p.fill('#000000');
          } else {
            p.text(
              `detectorNumber: ${detector.detectorNumber} \n x: ${detector.detectorGrid.x} y: ${detector.detectorGrid.y} \n detectorMap: ${detector.detectorMap}`,
              detector.detectorGrid.x + radius + 5,
              detector.detectorGrid.y
            );
            p.fill('#000000');
          }
        }
      }
    }
  };

  p.mouseClicked = function() {
    if (detectors.length > 0 && p.mouseX < width && p.mouseY < height) {
      for (let detector of detectors) {
        const distance = p.dist(
          p.mouseX,
          p.mouseY,
          detector.detectorGrid.x,
          detector.detectorGrid.y
        );
        if (distance < radius) {
          detector.active = true;
          detector.color = '#f00';
        } else {
          detector.active = false;
          detector.color = '#ff8c00';
        }
      }
      onChange(detectors);
    }
    return false;
  };

  p.doubleClicked = function() {
    let c = false;
    if (maps.length) {
      for (let map of maps) {
        for (let i in map.size) {
          if (
            map.size[i].max.x - p.mouseX > 0 &&
            p.mouseX - map.size[i].min.x > 0 &&
            map.size[i].max.y - p.mouseY > 0 &&
            p.mouseY - map.size[i].min.y > 0
          ) {
            detectors.push({
              detectorNumber: 'new',
              detectorGrid: { x: p.mouseX, y: p.mouseY },
              detectorMap: map.mapID,
              color: '#ff8c00',
              active: false
            });
            c = true;
            onChange(detectors);
            break;
          }
        }
      }
      if (!c) {
        alert('先にマップを登録してください');
      }

      return false;
    }
  };

  p.mouseDragged = function() {
    let mapID;
    if (detectors.length > 0 && p.mouseX < width && p.mouseY < height) {
      for (let detector of detectors) {
        if (detector.active) {
          detector.detectorGrid.x = p.mouseX;
          detector.detectorGrid.y = p.mouseY;

          for (let map of maps) {
            for (let i in map.size) {
              if (
                map.size[i].max.x - p.mouseX > 0 &&
                p.mouseX - map.size[i].min.x > 0 &&
                map.size[i].max.y - p.mouseY > 0 &&
                p.mouseY - map.size[i].min.y > 0
              ) {
                mapID = map.mapID;
              }
            }
          }
          if (mapID !== returnMapID(detector.detectorMap)) {
            alert('登録したときのマップからディテクターがはみ出さないようにしてください');
            detector.active = false;
          }
          onChange(detectors);
          break;
        }
      }
    }
    return false;
  };
};
export default function Map(props) {
  return (
    <div className="map">
      <P5Wrapper
        sketch={mapSetting}
        detectors={props.detectors}
        maps={props.maps}
        onChange={props.onChange}
      />
    </div>
  );
}
