// $fa = 1;
// $fs = 0.4;

module wheel(radius=10) {
  diameter=radius * 2;
  wheel_width=10;

  cylinder_radius=2;
  cylinder_height=diameter;

  difference() {
    resize([diameter, diameter, diameter])
      sphere(r=wheel_width);

    translate([wheel_width / 2,0,0])
      resize([diameter / 2, diameter, diameter])
        sphere(r=10);
    translate([-wheel_width / 2,0,0])
      resize([diameter / 2, diameter, diameter])
        sphere(r=10);

    translate([0, 0, diameter / 4])
      rotate([0, 90, 0]) 
        cylinder(r=cylinder_radius, h=cylinder_height, center=true);

    translate([0, 0, -diameter / 4])
      rotate([0, 90, 0]) 
        cylinder(r=cylinder_radius, h=cylinder_height, center=true);

    translate([0, diameter / 4, 0])
      rotate([0, 90, 0]) 
        cylinder(r=cylinder_radius, h=cylinder_height, center=true);

    translate([0, -diameter / 4, 0])
      rotate([0, 90, 0]) 
        cylinder(r=cylinder_radius, h=cylinder_height, center=true);
    
  }
}

base_height=10;
top_height=10;
wheel_radius=8;
track=30;

// Body
rotate([0, 0, 0]) {
  // Body Base
  resize([60, 20, base_height])
    sphere(r=10);

  // Body Top
  translate([0, 0, base_height / 2 - 0.001])
    resize([30, 20, base_height])
      sphere(r=10);
    // cube([30, 20, top_height], center=true);
}



// Front Left Wheel
translate([-20, -track / 2, 0])
  rotate([0, 0, 90])
    wheel();

// Front Right Wheel
translate([-20, track / 2, 0])
  rotate([0, 0, 90])
    wheel();

// Front Axel
translate([-20, 0, 0])
  rotate([90, 0, 0])
    cylinder(r=2, h=track, center=true);

// Back Left Wheel
translate([20, -track / 2, 0])
  rotate([0, 0, 90])
    wheel();

// Back Right Wheel
translate([20, track / 2, 0])
  rotate([0, 0, 90])
    wheel();

// Back Axel
translate([20, 0, 0])
  rotate([90, 0, 0])
    cylinder(r=2, h=track, center=true);