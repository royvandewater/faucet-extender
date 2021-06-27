$fa = 1;
$fs = 0.4;
wheel_width = 3;
wheel_radius = 12;
tyre_diameter = 6;


rotate([0, 90, 0])
  rotate_extrude(angle=360) {

    translate([0, -wheel_width / 2])
      square(size=[wheel_radius * 0.75, wheel_width]);

    translate([wheel_radius - tyre_diameter/2, 0]) {
        circle(d=tyre_diameter);

    }
  }