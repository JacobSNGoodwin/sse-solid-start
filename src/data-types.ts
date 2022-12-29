export type ListicleInfo = {
  id: number;
  title: string;
};

export type ListicleEntry = {
  id: number;
  text: string;
};

export type Listicle = ListicleInfo & {
  entries: ListicleEntry[];
};
