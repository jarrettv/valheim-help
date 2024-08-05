export type Gear = {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  type: string;
  source: string;
  usage: string;
  wielding: string;
  weight: number;
  passive:{
    [key: string]: string;
  };
  power: number;
  levels: {
      level: number;
      durability: number;
      craftingLevel: number;
      repairLevel: number;
      materials: {
        [key: string]: string;
      };
      primaryAttack: {
        [key: string]: string;
      };
      secondaryAttack: {
        [key: string]: string;
      };
      blocking: {
        [key: string]: string;
      };
  }[];
};

export const fetchGear = async (): Promise<Gear[]> => {
  const res = await fetch('gear.json');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};