function Elem(sym, name, mass, cat) {
 this.sym = sym;
 this.name = name;
 this.mass = mass;
 this.cat = cat;
}

var elements = [
 new Elem("H" , "Hydrogen"     ,   1.008     ,  2),
 new Elem("He", "Helium"       ,   4.002602  ,  1),
 new Elem("Li", "Lithium"      ,   6.94      , 10),
 new Elem("Be", "Beryllium"    ,   9.012182  , 11),
 new Elem("B" , "Boron"        ,  10.81      , 20),
 new Elem("C" , "Carbon"       ,  12.011     ,  2),
 new Elem("N" , "Nitrogen"     ,  14.007     ,  2),
 new Elem("O" , "Oxygen"       ,  15.999     ,  2),
 new Elem("F" , "Fluorine"     ,  18.9984032 ,  0),
 new Elem("Ne", "Neon"         ,  20.1797    ,  1), // 10
 new Elem("Na", "Sodium"       ,  22.98976928, 10),
 new Elem("Mg", "Magnesium"    ,  24.305     , 11),
 new Elem("Al", "Aluminum"     ,  26.9815386 , 15),
 new Elem("Si", "Silicon"      ,  28.085     , 20),
 new Elem("P" , "Phosphorus"   ,  30.973762  ,  2),
 new Elem("S" , "Sulfur"       ,  32.06      ,  2),
 new Elem("Cl", "Chlorine"     ,  35.45      ,  0),
 new Elem("Ar", "Argon"        ,  39.948     ,  1),
 new Elem("K" , "Potassium"    ,  39.0983    , 10),
 new Elem("Ca", "Calcium"      ,  40.078     , 11), // 20
 new Elem("Sc", "Scandium"     ,  44.955912  , 14),
 new Elem("Ti", "Titanium"     ,  47.867     , 14),
 new Elem("V" , "Vanadium"     ,  50.9415    , 14),
 new Elem("Cr", "Chromium"     ,  51.9961    , 14),
 new Elem("Mn", "Manganese"    ,  54.938045  , 14),
 new Elem("Fe", "Iron"         ,  54.845     , 14),
 new Elem("Co", "Cobalt"       ,  58.933195  , 14),
 new Elem("Ni", "Nickel"       ,  58.6934    , 14),
 new Elem("Cu", "Copper"       ,  63.546     , 14),
 new Elem("Zn", "Zinc"         ,  65.38      , 14), // 30
 new Elem("Ga", "Gallium"      ,  69.723     , 15),
 new Elem("Ge", "Germanium"    ,  72.63      , 20),
 new Elem("As", "Arsenic"      ,  74.92160   , 20),
 new Elem("Se", "Selenium"     ,  78.96      ,  2),
 new Elem("Br", "Bromine"      ,  79.904     ,  0),
 new Elem("Kr", "Krypton"      ,  83.798     ,  1),
 new Elem("Rb", "Rubidium"     ,  85.4678    , 10),
 new Elem("Sr", "Strontium"    ,  87.62      , 11),
 new Elem("Y" , "Yttrium"      ,  88.90585   , 14),
 new Elem("Zr", "Zirconium"    ,  91.224     , 14), // 40
 new Elem("Nb", "Niobium"      ,  92.90638   , 14),
 new Elem("Mo", "Molybdenum"   ,  95.96      , 14),
 new Elem("Tc", "Technetium"   ,  98         , 14),
 new Elem("Ru", "Ruthenium"    , 101.07      , 14),
 new Elem("Rh", "Rhodium"      , 102.90550   , 14),
 new Elem("Pd", "Palladium"    , 106.42      , 14),
 new Elem("Ag", "Silver"       , 107.8682    , 14),
 new Elem("Cd", "Cadmium"      , 112.411     , 14),
 new Elem("In", "Indium"       , 114.818     , 15),
 new Elem("Sn", "Tin"          , 118.710     , 15), // 50
 new Elem("Sb", "Antimony"     , 121.760     , 20),
 new Elem("Te", "Tellurium"    , 127.60      , 20),
 new Elem("I" , "Iodine"       , 126.90447   ,  0),
 new Elem("Xe", "Xenon"        , 131.293     ,  1),
 new Elem("Cs", "Caesium"      , 132.9054519 , 10),
 new Elem("Ba", "Barium"       , 137.327     , 11),
 new Elem("La", "Lanthanum"    , 138.90547   , 12),
 new Elem("Ce", "Cerium"       , 140.116     , 12), 
 new Elem("Pr", "Praseodymium" , 140.90765   , 12),
 new Elem("Nd", "Neodymium"    , 144.242     , 12), // 60
 new Elem("Pm", "Promethium"   , 145         , 12),
 new Elem("Sm", "Samarium"     , 150.36      , 12),
 new Elem("Eu", "Europium"     , 151.964     , 12),
 new Elem("Gd", "Gadolinium"   , 157.25      , 12),
 new Elem("Tb", "Terbium"      , 158.92535   , 12),
 new Elem("Dy", "Dysprosium"   , 162.500     , 12),
 new Elem("Ho", "Holmium"      , 164.93032   , 12),
 new Elem("Er", "Erbium"       , 167.259     , 12),
 new Elem("Tm", "Thulium"      , 168.93421   , 12),
 new Elem("Yb", "Ytterbium"    , 173.054     , 12), // 70
 new Elem("Lu", "Lutetium"     , 174.9668    , 12),
 new Elem("Hf", "Hafnium"      , 178.49      , 14),
 new Elem("Ta", "Tantalum"     , 180.94788   , 14),
 new Elem("W" , "Tungsten"     , 183.84      , 14),
 new Elem("Re", "Rhenium"      , 186.207     , 14),
 new Elem("Os", "Osmium"       , 190.23      , 14),
 new Elem("Ir", "Iridium"      , 192.217     , 14),
 new Elem("Pt", "Platinum"     , 195.084     , 14),
 new Elem("Au", "Gold"         , 196.966569  , 14),
 new Elem("Hg", "Mercury"      , 200.59      , 14), // 80
 new Elem("Tl", "Thallium"     , 204.38      , 15),
 new Elem("Pb", "Lead"         , 207.2       , 15),
 new Elem("Bi", "Bismuth"      , 208.98040   , 15),
 new Elem("Po", "Polonium"     , 209         , 20),
 new Elem("At", "Astatine"     , 210         ,  0),
 new Elem("Rn", "Radon"        , 222         ,  1),
 new Elem("Fr", "Francium"     , 223         , 10),
 new Elem("Ra", "Radium"       , 226         , 11),
 new Elem("Ac", "Actinium"     , 227         , 13),
 new Elem("Th", "Thorium"      , 232.03806   , 13), // 90
 new Elem("Pa", "Protactinium" , 231.03588   , 13),
 new Elem("U" , "Uranium"      , 238.02891   , 13),
 new Elem("Np", "Neptunium"    , 237         , 13),
 new Elem("Pu", "Plutonium"    , 244         , 13),
 new Elem("Am", "Americium"    , 243         , 13),
 new Elem("Cm", "Curium"       , 247         , 13),
 new Elem("Cf", "Californium"  , 251         , 13),
 new Elem("Bk", "Berkelium"    , 247         , 13),
 new Elem("Es", "Einsteinium"  , 252         , 13),
 new Elem("Fm", "Fermium"      , 257         , 13), // 100
 new Elem("Md", "Mendelevium"  , 258         , 13),
 new Elem("No", "Nobelium"     , 259         , 13),
 new Elem("Lr", "Lawrencium"   , 262         , 13),
 new Elem("Rf", "Rutherfordium", 267         , 14),
 new Elem("Db", "Dubnium"      , 268         , 14),
 new Elem("Sg", "Seaborgium"   , 271         , 14),
 new Elem("Bh", "Bohrium"      , 272         , 14),
 new Elem("Hs", "Hassium"      , 270         , 14),
 new Elem("Mt", "Meitnerium"   , 276         , 14),
 new Elem("Ds", "Darmstadtium" , 281         , 14), // 110
 new Elem("Rg", "Roentgenium"  , 280         , 14),
 new Elem("Cn", "Copernicium"  , 285         , 14),
 new Elem("Nh", "Nihonium"     , 284         , 15),
 new Elem("Fl", "Flerovium"    , 289         , 15),
 new Elem("Mc", "Moscovium"    , 288         , 15),
 new Elem("Lv", "Livermorium"  , 293         , 15),
 new Elem("Ts", "Tennessine"   , 294         ,  0),
 new Elem("Og", "Oganesson"    , 294         ,  1)
];

var spacialElems = [
 new Elem(" ", false, false, -1)
];

var customElems = [];