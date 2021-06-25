$fa = 1;
$fs = 0.4;
ff=0.01;
// 23.7mm inner
// 22.1mm outer
// 2.7mm thickness
// 11.13mm

extender_length=50;
angle=20;
faucet_outer_diameter=25;
faucet_inner_diameter=faucet_outer_diameter-3.2;
hose_diameter=20;

faucet_outer_radius=faucet_outer_diameter / 2;
faucet_inner_radius=faucet_inner_diameter / 2;
hose_radius=hose_diameter / 2;

// rotate([-90, 0, 0]) {
  difference(){
    cylinder(r=faucet_outer_radius, h=extender_length, center=true);
    cylinder(r=faucet_inner_radius, h=extender_length+ff, center=true);

    translate([0, faucet_inner_radius - hose_radius / 2, 0])
      cylinder(r=hose_radius, h=extender_length+ff, center=true);

    translate([0, 0, extender_length - (sin(angle) * faucet_outer_radius)])
      translate([0, 0, -extender_length / 2])
        rotate([angle, 0, 0])
          translate([0, 0, extender_length / 2])
            cube(size=[faucet_outer_diameter * 2, faucet_outer_diameter * 2, extender_length], center=true);

  }
// }