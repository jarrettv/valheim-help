export type Gear = {
  id:       string;
  code:     string;
  name:     string;
  desc:     string;
  type:     string;
  image:    string;
  usage:    string;
  wield:    string;
  weight:   number;
  power:    number;
  source:   string;
  durab:    string;
  craft:    string;
  repair:   string;
  mats:     { [key: string]: string };
  attack?:  { [key: string]: string };
  block?:   { [key: string]: string };
  passive?: { [key: string]: number };
};