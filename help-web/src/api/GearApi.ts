export type Gear = {
  id: string;
  code: string;
  name: string;
  desc: string;
  type: string;
  image: string;
  usage: string;
  wield: string;
  weight: number;
  power: number;
  source: string;
  durab: string;
  craft: string;
  repair: string;
  passive:{
    [key: string]: string;
  };
  mats: {
    [key: string]: string;
  };
  attack?: {
    [key: string]: string;
  };
  block?: {
    [key: string]: string;
  };
};

export const fetchGear = async (): Promise<Gear[]> => {
  const res = await fetch('gear.json');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};