const { measureBoundingBox } = require('@jscad/modeling').measurements
const { cuboid, cylinder, polygon } = require('@jscad/modeling').primitives
const { translateX, translateZ, rotateY } = require('@jscad/modeling').transforms
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

/**
 * Stacks obj2 on top of obj1. Returns stacked copies of the objects
 * @param {import('@jscad/modeling/src/geometries/types').Geometry} obj1 
 * @param {import('@jscad/modeling/src/geometries/types').Geometry} obj2 
 */
const stack = (obj1, obj2) => {
  const bounds1 = measureBoundingBox(obj1)
  const topOfObj1 = bounds1[1][2]

  const bounds2 = measureBoundingBox(obj2)
  const bottomOfObj2 = bounds2[0][2]

  return [obj1, translateZ(topOfObj1 - bottomOfObj2, obj2)]
}

const stackedCylinder = (r1, l1, r2, l2, segments, overlap = 0) => {
  const c1 = cylinder({ radius: r1, height: l1 - overlap, segments, center: [0, 0, 0 - overlap / 2] })
  const c2 = cylinder({ radius: r2, height: l2 + overlap, segments })

  return union(...stack(c1, c2))
}

const cutout = ({ faucetOuterRadius, faucetInnerRadius, faucetSocketLength, showerSocketLength, segments, thickness, overlap, hoseRadius }) => {

  const inner = stackedCylinder(
    faucetOuterRadius - thickness,
    ff + showerSocketLength,
    faucetInnerRadius - thickness,
    ff + faucetSocketLength,
    segments,
    overlap,
  )

  const hose = cuboid({
    size: [faucetOuterRadius, hoseRadius, 2 * (showerSocketLength + faucetSocketLength)],
    center: [faucetOuterRadius / 2, 0, 0]
  })
  // const length = socketLength + 1;

  // const inner = translateZ(-ff,
  //   stackedCylinder(faucetInnerRadius, length, showerInnerRadius, socketLength, segments)
  // );

  // const hoseCut = translateX(-faucetInnerRadius, [
  //   translateZ(-ff, cuboid({ size: [faucetInnerRadius, hoseRadius, length], center: [0, 0, length / 2] })),

  //   translateZ(length,
  //     cuboid({ size: [faucetInnerRadius, hoseRadius, length + (2 * ff)], center: [0, 0, length / 2] }))

  // ])

  return translateZ(-ff,
    union(
      inner,
      hose,
    ))
}

const outer = ({ faucetOuterRadius, faucetInnerRadius, faucetSocketLength, showerSocketLength, segments }) => {
  return stackedCylinder(faucetOuterRadius, showerSocketLength, faucetInnerRadius, faucetSocketLength, segments);
}

const debugColor = (shape) => colorize([1, 0.2, 0, 0.2], shape)

const getParameterDefinitions = () => {
  return [
    { name: 'segments', caption: 'how smooth the model looks', type: 'float', initial: 32 },
    // { name: 'angleDegrees', caption: 'angle to tilt the showerhead up by (in degrees)', type: 'float', initial: 10 },
    { name: 'faucetInnerDiameter', caption: 'inner diameter of the socket on the faucet side that the showerhead fits into', type: 'float', initial: 24.3 },
    { name: 'hoseDiameter', caption: 'outer diameter of the hose that connects the faucet to the showerhead', type: 'float', initial: 22 },
    { name: 'thickness', caption: 'how thick the walls of the faucet are', type: 'float', initial: 2.8 },
    { name: 'faucetSocketLength', caption: 'how long the faucet sockets is', type: 'float', initial: 35 },
    { name: 'showerSocketLength', caption: 'how long the shower sockets is', type: 'float', initial: 50 },
    { name: 'overlap', caption: 'amount that the smaller tube fits into the outer tube', type: 'float', initial: 3.4 },
  ];
}

const main = ({ segments, faucetInnerDiameter, thickness, faucetSocketLength, showerSocketLength, hoseDiameter, overlap }) => {
  const faucetInnerRadius = faucetInnerDiameter / 2;
  const faucetOuterRadius = faucetInnerRadius + thickness;
  const hoseRadius = hoseDiameter / 2;

  // return union([
  //   outer({ faucetInnerRadius, faucetOuterRadius, socketLength, segments }),
  //   cutout({ faucetInnerRadius, hoseRadius, showerInnerRadius, socketLength, segments }),
  // ])
  return [
    subtract([
      outer({ faucetInnerRadius, faucetOuterRadius, faucetSocketLength, showerSocketLength, segments }),
      cutout({ faucetInnerRadius, faucetOuterRadius, faucetSocketLength, showerSocketLength, segments, thickness, overlap, hoseRadius }),
    ]),
    // debugColor(cutout({ faucetInnerRadius, faucetOuterRadius, faucetSocketLength, showerSocketLength, segments, thickness, overlap, hoseRadius })),
    // debugColor(outer({ faucetInnerRadius, faucetOuterRadius, faucetSocketLength, showerSocketLength, segments })),
  ]
}

module.exports = { getParameterDefinitions, main }