// $fa = 1;
// $fs = 0.4;

module wheel() {
  diameter=20;
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
wheel();