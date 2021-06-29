const { cuboid, cylinder, polygon } = require('@jscad/modeling').primitives
const { translate, translateX, translateZ, rotateY } = require('@jscad/modeling').transforms
const { subtract, union } = require('@jscad/modeling').booleans
const { extrudeRotate } = require('@jscad/modeling').extrusions
const { colorize } = require('@jscad/modeling').colors

const ff = 0.01;
// const segments = 32;

// const angleDegrees = 10;
// const angle = angleDegrees * Math.PI / 180;
// const faucetInnerDiameter = 24.3;
// const showerOuterDiameter = 22.5;
// const hoseDiameter = 11.4;

// const thickness = 2.8;

// const showerOuterRadius = showerOuterDiameter / 2;
// const showerInnerRadius = showerOuterRadius - thickness;

// const faucetInnerRadius = faucetInnerDiameter / 2;
// const faucetOuterRadius = faucetInnerRadius + thickness;

// const hoseRadius = hoseDiameter / 2;
// const socketLength = 35;

const taperedCylinder = (r1, r2, h, segments) => {
  return extrudeRotate({ segments },
    polygon({
      points: [
        [0, 0],
        [r1, 0],
        [r2, h],
        [0, h]
      ]
    })
  )
}

const elbowCylinder = (r1, l1, r2, l2, angle, segments) => {
  const angleOffset = Math.sin(angle) * r2;

  const c1 = taperedCylinder(r1, r2, l1, segments);

  const c2 =
    translateZ(l1,
      translateZ(-angleOffset,
        rotateY(angle,
          cylinder({ radius: r2, height: l2, center: [0, 0, l2 / 2], segments }))))

  return union(c1, c2)
}

const cutout = ({ angle, faucetInnerRadius, hoseRadius, showerInnerRadius, socketLength, segments }) => {
  const length = socketLength + 1;
  const angleOffset = Math.sin(angle) * (faucetInnerRadius / 2);

  const inner = translateZ(-ff,
    elbowCylinder(faucetInnerRadius, length, showerInnerRadius, socketLength, angle, segments)
  );

  const hoseCut = translateX(-faucetInnerRadius, [
    translateZ(-ff, cuboid({ size: [faucetInnerRadius, hoseRadius, length], center: [0, 0, length / 2] })),

    translateZ(length - angleOffset,
      rotateY(angle,
        cuboid({ size: [faucetInnerRadius, hoseRadius, length + (2 * ff)], center: [0, 0, length / 2] })))

  ])

  return union(
    inner,
    hoseCut,
  )
}

const outer = ({ faucetOuterRadius, socketLength, showerOuterRadius, angle, segments }) => {
  return elbowCylinder(faucetOuterRadius, socketLength, showerOuterRadius, socketLength, angle, segments);
}

const debugColor = (shape) => colorize([1, 1, 1, 0.5], shape)

const getParameterDefinitions = () => {
  return [
    { name: 'segments', caption: 'how smooth the model looks', type: 'float', initial: 32 },
    { name: 'angleDegrees', caption: 'angle to tilt the showerhead up by (in degrees)', type: 'float', initial: 10 },
    { name: 'faucetInnerDiameter', caption: 'inner diameter of the socket on the faucet side that the showerhead fits into', type: 'float', initial: 24.3 },
    { name: 'showerOuterDiameter', caption: 'outer diameter of the part of the showerhead that fits into the faucet', type: 'float', initial: 22.5 },
    { name: 'hoseDiameter', caption: 'outer diameter of the hose that connects the faucet to the showerhead', type: 'float', initial: 11.4 },
    { name: 'thickness', caption: 'how thick the walls of the faucet are', type: 'float', initial: 2.8 },
    { name: 'socketLength', caption: 'how long the sockets are', type: 'float', initial: 35 },
  ];
}

const main = ({ segments, angleDegrees, faucetInnerDiameter, showerOuterDiameter, hoseDiameter, thickness, socketLength }) => {
  const angle = angleDegrees * Math.PI / 180;

  const showerOuterRadius = showerOuterDiameter / 2;
  const showerInnerRadius = showerOuterRadius - thickness;

  const faucetInnerRadius = faucetInnerDiameter / 2;
  const faucetOuterRadius = faucetInnerRadius + thickness;
  const hoseRadius = hoseDiameter / 2;

  return subtract([
    outer({ faucetOuterRadius, socketLength, showerOuterRadius, socketLength, angle, segments }),
    cutout({ angle, faucetInnerRadius, hoseRadius, showerInnerRadius, socketLength, segments }),
  ])
}

module.exports = { getParameterDefinitions, main }