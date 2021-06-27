$fa = 1;
$fs = 0.4;
ff=0.01;

extender_length=20;
angle=10;
faucet_inner_diameter=24.3;
shower_outer_diameter=22.5;
hose_diameter=11.4;

thickness=2.8;

shower_outer_radius=shower_outer_diameter / 2;
shower_inner_radius=shower_outer_radius - thickness;

faucet_inner_radius=faucet_inner_diameter / 2;
faucet_outer_radius=faucet_inner_radius + thickness;

hose_radius=hose_diameter / 2;
socket_length=35;

module tapered_cylinder(r1, r2, h, center=false) {
  center_offset = center ? (-h / 2) : 0;

  translate([0, 0, center_offset])
    rotate_extrude(angle=360)
      polygon(
        points=[[0, 0],
                [r1,0],
                [r2,h],
                [0,h]]
      );
}

// rN: inner radius
// lN: length
module elbow_cylinder(r1, l1, r2, l2, angle) {
  angle_offset = sin(angle) * r2;

  tapered_cylinder(r1=r1, r2=r2, h=l1);

  shift = l2 / 2;

  translate([0, 0, l1])
    translate([0, 0, -angle_offset])
        rotate([0, angle, 0])
            cylinder(r=r2, h=l2);
    
}

module tube(r1, r2, l, center=false) {
  difference(){
    cylinder(r=r1, h=l, center=center);
    cylinder(r=r2, h=l+ff, center=center);
  }
}

module outer() {
  elbow_cylinder(faucet_outer_radius, socket_length, shower_outer_radius, socket_length, angle);
}

module cutout() {
  radius_diff=faucet_inner_radius - shower_inner_radius;
  length = socket_length + 1;
  angle_offset = sin(angle) * (faucet_inner_radius / 2);
  second_length=length;

  elbow_cylinder(faucet_inner_radius, length, shower_inner_radius, socket_length, angle + ff);

  shift = length / 2;

  translate([-faucet_inner_radius, 0, 0]) {
    translate([-faucet_inner_radius / 2, -hose_radius / 2, 0])
      cube(size=[faucet_inner_radius, hose_radius, length]);

    translate([0, 0, length])
      translate([0, 0, -angle_offset])
        rotate([0, angle, 0])
          translate([-faucet_inner_radius / 2, -hose_radius / 2, 0])
            cube(size=[faucet_inner_radius, hose_radius, length + (2 * ff)]);
  }

  // optional
  // translate([0, 0, length])
  //   translate([0, 0, -(sin(angle) * (shower_outer_radius + 2))])
  //     rotate([0, angle, 0])
  //       tube(shower_outer_radius + thickness, shower_outer_radius, length + (2 * ff));
}

rotate([0, -90 - angle, 0])
  difference(){
    outer();
    translate([0, 0, -ff])
      cutout();
  }
