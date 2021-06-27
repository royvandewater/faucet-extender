$fa = 1;
$fs = 0.4;
ff=0.01;
// 23.7mm inner
// 22.1mm outer
// 2.7mm thickness
// 11.13mm

extender_length=20;
angle=10;
faucet_inner_diameter=23.6;
faucet_outer_diameter=22;
hose_diameter=20;

thickness=2.8;

faucet_outer_radius=faucet_outer_diameter / 2;
faucet_inner_radius=faucet_inner_diameter / 2;
hose_radius=hose_diameter / 2;
socket_length=10;

module tapered_cylinder(radius1, radius2, length, socket_length=0) {
  p0 = [0, 0];
  p1 = [radius1, 0];
  p2 = [radius1, socket_length];
  p3 = [radius2, socket_length + extender_length];
  p4 = [radius2, socket_length + extender_length + socket_length];
  p5 = [0, socket_length + extender_length + socket_length];

  rotate_extrude(angle=360)
    polygon([p0, p1, p2, p3, p4, p5]);
}

// rotate([-90, 0, 0]) {
 difference(){
    min_socket = sin(angle) * (faucet_outer_radius + thickness);
    angle_offset = extender_length + (2 * socket_length) - min_socket;
    
    tapered_cylinder(faucet_inner_radius + thickness, faucet_outer_radius + thickness, extender_length, socket_length + min_socket);
    translate([0, 0, -ff])
      tapered_cylinder(faucet_inner_radius, faucet_outer_radius, extender_length + ff, socket_length + min_socket + ff);

    translate([-faucet_outer_radius * 2, -faucet_outer_radius * 2, angle_offset])
      translate([0, 0, extender_length / 2])
        rotate([angle, 0, 0])
          translate([0, 0, -extender_length / 2])
            cube(size=[faucet_outer_diameter * 2, faucet_outer_diameter * 2, extender_length]);
  }
// }